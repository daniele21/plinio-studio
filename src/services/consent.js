/**
 * Plinio Cookie & Privacy Consent Service
 * Manages user consent state, versioning, expiration (180 days per Italian Privacy Authority),
 * and dispatches change events for reactive analytics initialization.
 */

export const CONSENT_KEY = 'plinio_consent_v1';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;

/**
 * Default consent state prior to explicit user action.
 * Analytics is disabled by default (Privacy by Default).
 */
export const defaultConsent = {
  necessary: true,
  analytics: false,
};

/**
 * Check if a timestamp is within the maximum allowed age (180 days)
 * @param {string} timestampIso 
 * @returns {boolean}
 */
function isConsentFresh(timestampIso) {
  if (!timestampIso) return false;
  const updatedAtTime = new Date(timestampIso).getTime();
  if (isNaN(updatedAtTime)) return false;
  const maxAgeMs = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - updatedAtTime < maxAgeMs;
}

/**
 * Retrieve the current valid user consent from localStorage.
 * Returns null if no decision was made, if the version changed, or if expired.
 * @returns {{ necessary: boolean, analytics: boolean, updatedAt: string, version: number } | null}
 */
export function getConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);

    // Validate structure, version and max age
    if (
      parsed &&
      parsed.version === CONSENT_VERSION &&
      isConsentFresh(parsed.updatedAt)
    ) {
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        updatedAt: parsed.updatedAt,
        version: parsed.version,
      };
    }
    return null;
  } catch (err) {
    console.warn('[Consent] Error reading consent from storage:', err);
    return null;
  }
}

/**
 * Check if the user has already expressed a valid, unexpired consent choice.
 * @returns {boolean}
 */
export function hasValidConsent() {
  return getConsent() !== null;
}

/**
 * Persist user consent choice to localStorage and notify subscribers.
 * @param {{ analytics?: boolean }} consent 
 * @returns {{ necessary: boolean, analytics: boolean, updatedAt: string, version: number }}
 */
export function saveConsent(consent = {}) {
  const value = {
    necessary: true,
    analytics: Boolean(consent.analytics),
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
      // Dispatch custom event for reactive subscribers (e.g. analytics service)
      window.dispatchEvent(
        new CustomEvent('plinio:consent-changed', {
          detail: value,
        })
      );
    } catch (err) {
      console.error('[Consent] Failed to write consent to storage:', err);
    }
  }

  return value;
}

/**
 * Reset consent choice (useful for debugging or explicit complete reset).
 */
export function resetConsent() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CONSENT_KEY);
      window.dispatchEvent(
        new CustomEvent('plinio:consent-changed', {
          detail: null,
        })
      );
    } catch (err) {
      console.error('[Consent] Failed to reset consent:', err);
    }
  }
}
