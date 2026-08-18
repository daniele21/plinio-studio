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

if (typeof window !== 'undefined') {
  isSupported()
    .then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(err => {
      console.warn('Firebase Analytics not initialized:', err);
    });
}
