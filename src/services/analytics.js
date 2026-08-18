/**
 * Plinio Analytics Service (Basic Consent Mode)
 * Ensures Google/Firebase Analytics is only loaded and executed when explicit
 * user consent for analytics is granted.
 */

import { getAnalytics, isSupported, setConsent, logEvent } from 'firebase/analytics';
import { app } from './firebase.js';
import { getConsent } from './consent.js';

let analyticsInstance = null;
let initPromise = null;

/**
 * Initialize and enable Firebase Analytics with granted analytics_storage
 * while keeping all advertising/profiling storage denied.
 * @returns {Promise<import('firebase/analytics').Analytics | null>}
 */
export async function enableAnalytics() {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (!supported) return null;

    if (!analyticsInstance) {
      if (!initPromise) {
        initPromise = (async () => {
          // Explicit consent grant for basic consent mode
          setConsent({
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
          analyticsInstance = getAnalytics(app);
          return analyticsInstance;
        })();
      }
      analyticsInstance = await initPromise;
    } else {
      setConsent({
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }

    return analyticsInstance;
  } catch (err) {
    console.warn('[Analytics] Failed to initialize analytics:', err);
    return null;
  }
}

/**
 * Revoke analytics consent and set all consent states to denied.
 */
export function disableAnalytics() {
  try {
    setConsent({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  } catch (err) {
    console.warn('[Analytics] Failed to set consent to denied:', err);
  }
}

/**
 * Safely log a custom analytics event.
 * If user consent for analytics is not granted, this function quietly no-ops (Basic Consent Mode).
 * @param {string} eventName - Semantic event name (e.g. 'pilot_cta_click')
 * @param {Record<string, any>} [eventParams] - Optional parameters dictionary
 */
export async function trackEvent(eventName, eventParams = {}) {
  try {
    const consent = getConsent();
    // Only track if explicit consent was granted
    if (!consent || !consent.analytics) {
      return;
    }

    const inst = await enableAnalytics();
    if (inst) {
      logEvent(inst, eventName, eventParams);
    }
  } catch (err) {
    console.warn(`[Analytics] Error tracking event "${eventName}":`, err);
  }
}

/**
 * Bootstrap analytics based on current stored consent, and listen to dynamic consent changes.
 */
export function initAnalyticsFromConsent() {
  if (typeof window === 'undefined') return;

  const current = getConsent();
  if (current && current.analytics) {
    enableAnalytics().catch(err => console.warn('[Analytics] Consent init error:', err));
  } else {
    // Ensure default denied state is registered
    disableAnalytics();
  }

  // Reactively respond to consent changes without page reload
  window.addEventListener('plinio:consent-changed', (event) => {
    const detail = event.detail;
    if (detail && detail.analytics) {
      enableAnalytics().catch(err => console.warn('[Analytics] Consent change enable error:', err));
    } else {
      disableAnalytics();
    }
  });
}
