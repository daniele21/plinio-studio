import crypto from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();
setGlobalOptions({ region: 'europe-west1', maxInstances: 10 });

const db = getFirestore();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_RETENTION_MS = 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 12_000;

const allowedOrigins = [
  /^https:\/\/(?:www\.)?plinio\.studio$/i,
  /^https:\/\/plinio-studio(?:-[a-z0-9-]+)?\.web\.app$/i,
  /^https:\/\/plinio-studio(?:-[a-z0-9-]+)?\.firebaseapp\.com$/i,
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

const clean = (value, max = 200) => String(value ?? '').trim().slice(0, max);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class RateLimitError extends Error {}

function applyCors(req, res) {
  const origin = req.get('origin');
  if (!origin) return true;

  const allowed = allowedOrigins.some((pattern) => pattern.test(origin));
  if (!allowed) return false;

  res.set('Access-Control-Allow-Origin', origin);
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');
  return true;
}

function getClientIp(req) {
  const forwarded = clean(req.get('x-forwarded-for'), 300);
  if (forwarded) return forwarded.split(',')[0].trim();
  return clean(req.ip || 'unknown', 120);
}

function rateLimitKey(req) {
  const ip = getClientIp(req);
  return crypto.createHash('sha256').update(`plinio-lead:${ip}`).digest('hex').slice(0, 48);
}

async function enforceRateLimit(req) {
  const key = rateLimitKey(req);
  const ref = db.collection('_landing_rate_limits').doc(key);
  const nowMs = Date.now();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? snap.data() : null;
    const windowStartedAtMs = current?.windowStartedAt?.toMillis?.() || 0;
    const isNewWindow = !current || (nowMs - windowStartedAtMs) >= RATE_LIMIT_WINDOW_MS;

    if (isNewWindow) {
      tx.set(ref, {
        count: 1,
        windowStartedAt: Timestamp.fromMillis(nowMs),
        expiresAt: Timestamp.fromMillis(nowMs + RATE_LIMIT_RETENTION_MS),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return;
    }

    if ((current.count || 0) >= RATE_LIMIT_MAX) {
      throw new RateLimitError('rate_limit_exceeded');
    }

    tx.update(ref, {
      count: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromMillis(nowMs + RATE_LIMIT_RETENTION_MS),
    });
  });
}

function validatePayload(body) {
  const data = {
    fullName: clean(body?.fullName, 120),
    email: clean(body?.email, 180).toLowerCase(),
    company: clean(body?.company, 160),
    role: clean(body?.role, 120),
    phone: clean(body?.phone, 40),
    privacyAcknowledged: body?.privacyAcknowledged === true,
    policyVersion: clean(body?.policyVersion, 32),
    source: clean(body?.source, 80) || 'plinio_landing',
    website: clean(body?.website, 200),
    formStartedAt: Number(body?.formStartedAt || 0),
    attribution: {
      utmSource: clean(body?.utmSource, 100),
      utmMedium: clean(body?.utmMedium, 100),
      utmCampaign: clean(body?.utmCampaign, 160),
      utmContent: clean(body?.utmContent, 160),
      referrer: clean(body?.referrer, 300),
      landingPath: clean(body?.landingPath, 500),
    },
  };

  const errors = [];
  if (data.fullName.length < 2) errors.push('fullName');
  if (!emailRegex.test(data.email)) errors.push('email');
  if (data.company.length < 2) errors.push('company');
  if (data.role.length < 2) errors.push('role');
  if (!data.privacyAcknowledged) errors.push('privacyAcknowledged');
  if (!data.policyVersion) errors.push('policyVersion');

  return { data, errors };
}

export const submitLead = onRequest(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Content-Type-Options', 'nosniff');

  if (!applyCors(req, res)) {
    res.status(403).json({ ok: false, error: 'origin_not_allowed' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.set('Allow', 'POST, OPTIONS');
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const contentLength = Number(req.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    res.status(413).json({ ok: false, error: 'payload_too_large' });
    return;
  }

  const { data, errors } = validatePayload(req.body || {});

  // Honeypot submissions are acknowledged but intentionally discarded.
  if (data.website) {
    res.status(200).json({ ok: true });
    return;
  }

  // Very fast automated submissions are discarded without retaining PII.
  if (data.formStartedAt && (Date.now() - data.formStartedAt) < 700) {
    res.status(200).json({ ok: true });
    return;
  }

  if (errors.length) {
    res.status(400).json({ ok: false, error: 'validation_error', fields: errors });
    return;
  }

  try {
    await enforceRateLimit(req);

    const leadRef = db.collection('landing_leads').doc();
    await leadRef.set({
      fullName: data.fullName,
      email: data.email,
      company: data.company,
      role: data.role,
      phone: data.phone || null,
      source: data.source,
      attribution: data.attribution,
      status: 'new',
      privacy: {
        acknowledged: true,
        policyVersion: data.policyVersion,
        acknowledgedAt: FieldValue.serverTimestamp(),
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Deliberately avoid logging names, email addresses, phone numbers or form payloads.
    console.info('[submitLead] Lead stored', { leadId: leadRef.id, source: data.source });
    res.status(201).json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError) {
      res.status(429).json({ ok: false, error: 'rate_limit_exceeded' });
      return;
    }

    console.error('[submitLead] Failed to store lead', { message: error?.message || 'unknown_error' });
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

/**
 * Rate-limit records contain only a one-way hash derived from the request IP.
 * This scheduled cleanup ensures those technical records are removed after their short retention window.
 */
export const cleanupLandingRateLimits = onSchedule(
  {
    schedule: 'every 24 hours',
    timeZone: 'Europe/Rome',
    retryCount: 1,
  },
  async () => {
    const now = Timestamp.now();
    let deleted = 0;

    while (true) {
      const snapshot = await db
        .collection('_landing_rate_limits')
        .where('expiresAt', '<=', now)
        .limit(400)
        .get();

      if (snapshot.empty) break;

      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      deleted += snapshot.size;

      if (snapshot.size < 400) break;
    }

    console.info('[cleanupLandingRateLimits] Cleanup completed', { deleted });
  }
);
