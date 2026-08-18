/**
 * Firebase Client SDK Initialization
 * Configures Firebase App and optional services for Plinio Studio.
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Plinio Web App Firebase Configuration
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyDQHfXvrzpULFNiZtxk2_fV1qiN7tO4yd0',
  authDomain: 'plinio-studio.firebaseapp.com',
  projectId: 'plinio-studio',
  storageBucket: 'plinio-studio.firebasestorage.app',
  messagingSenderId: '179907961651',
  appId: '1:179907961651:web:22ba8fe83d6bea52e1d446'
};

/**
 * Initialized Firebase Application instance
 */
export const app = initializeApp(firebaseConfig);

/**
 * Initialized Analytics instance (if supported by the client browser/environment)
 */
export let analytics = null;
let analyticsPromise = null;

/**
 * Initialize and get Firebase Analytics instance
 * @returns {Promise<import('firebase/analytics').Analytics | null>}
 */
export async function initAnalytics() {
  if (analytics) return analytics;
  if (typeof window === 'undefined') return null;

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then(supported => {
        if (supported) {
          analytics = getAnalytics(app);
          return analytics;
        }
        return null;
      })
      .catch(err => {
        console.warn('Firebase Analytics not initialized:', err);
        return null;
      });
  }
  return analyticsPromise;
}

// Automatically start initialization in browser environments
if (typeof window !== 'undefined') {
  initAnalytics();
}

/**
 * Safely log a custom analytics event to Firebase
 * @param {string} eventName - Name of the event (e.g. 'pilot_cta_click')
 * @param {Record<string, any>} [eventParams] - Optional parameters dictionary
 */
export async function trackEvent(eventName, eventParams = {}) {
  try {
    const inst = await initAnalytics();
    if (inst) {
      const { logEvent } = await import('firebase/analytics');
      logEvent(inst, eventName, eventParams);
    }
  } catch (err) {
    console.warn(`[Analytics] Error logging event "${eventName}":`, err);
  }
}
