/**
 * Firebase Client SDK Initialization
 * Configures core Firebase App for Plinio Studio without automatic analytics.
 */

import { initializeApp } from 'firebase/app';

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
