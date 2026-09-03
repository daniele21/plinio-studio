/**
 * Plinio Admin Authentication Service
 * Wraps Firebase Auth with Google Provider and strictly restricts access
 * to allowed administrator email addresses defined in adminConfig.
 */

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { app } from '../services/firebase.js';
import { adminConfig } from './adminConfig.js';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

let currentUser = null;
let isAuthorizing = false;

/**
 * Checks if the given email is present in the allowed administrator list.
 * @param {string} email
 * @returns {boolean}
 */
export function isEmailAllowed(email) {
  if (!email) return false;
  const normalized = String(email).trim().toLowerCase();
  return adminConfig.allowedEmails.some((allowed) => allowed.toLowerCase() === normalized);
}

/**
 * Initializes the auth listener and monitors session state.
 * @param {object} callbacks
 * @param {Function} callbacks.onAuthorized - Called with user object when an authorized admin is detected.
 * @param {Function} callbacks.onDenied - Called with attempted email when an unauthorized user attempts sign in.
 * @param {Function} callbacks.onSignedOut - Called when no user is signed in.
 * @returns {Function} Unsubscribe function.
 */
export function listenAuthState({ onAuthorized, onDenied, onSignedOut }) {
  return onAuthStateChanged(auth, async (user) => {
    if (isAuthorizing) return;

    if (!user) {
      currentUser = null;
      if (typeof onSignedOut === 'function') onSignedOut();
      return;
    }

    const email = user.email || '';
    if (isEmailAllowed(email)) {
      currentUser = user;
      if (typeof onAuthorized === 'function') onAuthorized(user);
    } else {
      isAuthorizing = true;
      currentUser = null;
      try {
        await signOut(auth);
      } finally {
        isAuthorizing = false;
        if (typeof onDenied === 'function') {
          onDenied(email);
        }
      }
    }
  });
}

/**
 * Triggers Google OAuth sign-in popup.
 * @returns {Promise<{ ok: boolean, user?: object, error?: string }>}
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user?.email || '';

    if (!isEmailAllowed(email)) {
      await signOut(auth);
      return {
        ok: false,
        error: `L’account ${email || 'utilizzato'} non è autorizzato ad accedere a quest’area riservata.`,
      };
    }

    currentUser = result.user;
    return { ok: true, user: result.user };
  } catch (error) {
    if (error?.code === 'auth/popup-closed-by-user') {
      return { ok: false, error: 'Finestra di accesso chiusa prima del completamento.' };
    }
    if (error?.code === 'auth/popup-blocked') {
      return { ok: false, error: 'Il browser ha bloccato la finestra di popup. Consenti i popup per accedere.' };
    }
    return {
      ok: false,
      error: error?.message || 'Si è verificato un errore durante l’accesso con Google.',
    };
  }
}

/**
 * Signs out the current user session.
 * @returns {Promise<void>}
 */
export async function logout() {
  currentUser = null;
  await signOut(auth);
}

/**
 * Returns the currently authenticated and verified user, if any.
 * @returns {object|null}
 */
export function getCurrentUser() {
  return currentUser;
}
