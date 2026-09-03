/**
 * Plinio Admin Leads Service
 * Interacts directly with Cloud Firestore to fetch and listen to incoming pilot leads.
 */

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../services/firebase.js';
import { adminConfig } from './adminConfig.js';

export const db = getFirestore(app, adminConfig.databaseId || 'lead');

/**
 * Formats a timestamp into friendly absolute and relative strings.
 * @param {any} raw
 * @returns {{ absolute: string, relative: string, date: Date|null }}
 */
export function formatLeadDate(raw) {
  let date = null;

  if (!raw) {
    return { absolute: 'Data non disponibile', relative: '–', date: null };
  }

  if (typeof raw.toDate === 'function') {
    date = raw.toDate();
  } else if (raw instanceof Date) {
    date = raw;
  } else if (typeof raw === 'number') {
    date = new Date(raw);
  } else if (typeof raw === 'string') {
    date = new Date(raw);
  }

  if (!date || isNaN(date.getTime())) {
    return { absolute: 'Data non valida', relative: '–', date: null };
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  let relative = '';
  if (diffMinutes < 1) {
    relative = 'Adesso';
  } else if (diffMinutes < 60) {
    relative = `${diffMinutes}m fa`;
  } else if (diffHours < 24 && date.getDate() === now.getDate()) {
    relative = `Oggi alle ${date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1 || (diffHours < 48 && date.getDate() === now.getDate() - 1)) {
    relative = `Ieri alle ${date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    relative = `${diffDays} gg fa`;
  } else {
    relative = date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const absolute = date.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return { absolute, relative, date };
}

/**
 * Normalizes a single Firestore lead document snapshot into a standardized UI object.
 * @param {import('firebase/firestore').DocumentSnapshot} docSnap
 * @returns {object}
 */
export function normalizeLead(docSnap) {
  const data = docSnap.data() || {};
  const dateInfo = formatLeadDate(data.createdAt || data.formStartedAt);

  return {
    id: docSnap.id,
    fullName: data.fullName || '–',
    email: data.email || '–',
    company: data.company || '–',
    role: data.role || '–',
    phone: data.phone || null,
    status: data.status || 'new',
    source: data.source || 'plinio_landing',
    attribution: {
      utmSource: data.attribution?.utmSource || '–',
      utmMedium: data.attribution?.utmMedium || '–',
      utmCampaign: data.attribution?.utmCampaign || '–',
      utmContent: data.attribution?.utmContent || '–',
      referrer: data.attribution?.referrer || '–',
      landingPath: data.attribution?.landingPath || '–',
    },
    privacy: {
      policyVersion: data.privacy?.policyVersion || '–',
      acknowledgedAt: formatLeadDate(data.privacy?.acknowledgedAt).absolute,
    },
    rawDate: dateInfo.date,
    dateFormatted: dateInfo.absolute,
    dateRelative: dateInfo.relative,
  };
}

/**
 * Subscribes to real-time updates of the leads collection.
 * @param {Function} onData - Callback with array of normalized leads.
 * @param {Function} onError - Callback with error.
 * @returns {Function} Unsubscribe function.
 */
export function subscribeLeads(onData, onError) {
  const colRef = collection(db, adminConfig.collectionName);
  const q = query(
    colRef,
    orderBy(adminConfig.query.defaultSortField, adminConfig.query.defaultSortDirection),
    limit(adminConfig.query.maxResults)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const leads = snapshot.docs.map(normalizeLead);
      if (typeof onData === 'function') onData(leads);
    },
    (err) => {
      console.error('[LeadsService] Error listening to Firestore:', err);
      if (typeof onError === 'function') onError(err);
    }
  );
}

/**
 * Performs a one-time fetch of leads from Firestore.
 * @returns {Promise<Array<object>>}
 */
export async function fetchLeads() {
  const colRef = collection(db, adminConfig.collectionName);
  const q = query(
    colRef,
    orderBy(adminConfig.query.defaultSortField, adminConfig.query.defaultSortDirection),
    limit(adminConfig.query.maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(normalizeLead);
}

/**
 * Updates a lead document status in Firestore.
 * @param {string} leadId
 * @param {string} newStatus
 * @returns {Promise<void>}
 */
export async function updateLeadStatus(leadId, newStatus) {
  if (!leadId) return;
  const leadDoc = doc(db, adminConfig.collectionName, leadId);
  await updateDoc(leadDoc, {
    status: newStatus,
    updatedAt: new Date(),
  });
}

/**
 * Exports current leads list to a downloadable CSV file.
 * @param {Array<object>} leads
 */
export function exportLeadsToCsv(leads = []) {
  if (!leads.length) return;

  const headers = [
    'ID',
    'Data e Ora',
    'Nome Completo',
    'Email',
    'Azienda',
    'Ruolo',
    'Telefono',
    'Stato',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Referrer',
    'Landing Path',
    'Policy Versione',
  ];

  const escapeCell = (str) => {
    const val = String(str ?? '').replace(/"/g, '""');
    return `"${val}"`;
  };

  const rows = leads.map((l) => [
    l.id,
    l.dateFormatted,
    l.fullName,
    l.email,
    l.company,
    l.role,
    l.phone || '',
    l.status,
    l.attribution.utmSource,
    l.attribution.utmMedium,
    l.attribution.utmCampaign,
    l.attribution.referrer,
    l.attribution.landingPath,
    l.privacy.policyVersion,
  ].map(escapeCell).join(','));

  const csvContent = '\uFEFF' + [headers.map(escapeCell).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `plinio-leads-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
