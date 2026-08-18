/**
 * Plinio Cookie Consent & Privacy Preference Center Component
 * Renders the floating cookie banner, the preferences center modal, and the policy modal.
 * Fully compliant with Italian Garante Privacy & GDPR guidelines.
 */

import { getConsent, saveConsent, hasValidConsent } from '../services/consent.js';
import { consentCopy as copy } from '../content/consentCopy.js';

let bannerEl = null;
let preferencesModalEl = null;
let policyModalEl = null;
let analyticsCheckboxEl = null;

/**
 * Creates and injects the Cookie Banner HTML into the DOM
 */
function createBannerElement() {
  const banner = document.createElement('div');
  banner.className = 'pl-consent-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', copy.banner.title);
  banner.innerHTML = `
    <div class="pl-consent-banner__header">
      <h3 class="pl-consent-banner__title">${copy.banner.title}</h3>
      <button type="button" class="pl-consent-banner__close" data-consent-action="reject-close" aria-label="${copy.banner.closeAriaLabel}">
        &times;
      </button>
    </div>
    <p class="pl-consent-banner__description">${copy.banner.description}</p>
    <div class="pl-consent-banner__actions">
      <button type="button" class="pl-consent-btn pl-consent-btn--primary" data-consent-action="accept">
        ${copy.banner.acceptBtn}
      </button>
      <button type="button" class="pl-consent-btn pl-consent-btn--outline" data-consent-action="reject">
        ${copy.banner.rejectBtn}
      </button>
      <button type="button" class="pl-consent-btn pl-consent-btn--text" data-consent-action="manage">
        ${copy.banner.manageBtn}
      </button>
    </div>
    <div class="pl-consent-banner__footer">
      <a href="#privacy" class="pl-consent-link" data-consent-action="policy">
        ${copy.banner.policyLinkText}
      </a>
    </div>
  `;
  document.body.appendChild(banner);
  return banner;
}

/**
 * Creates and injects the Preferences Modal into the DOM
 */
function createPreferencesModalElement() {
  const modal = document.createElement('div');
  modal.className = 'pl-modal-backdrop';
  modal.setAttribute('id', 'pl-cookie-preferences-modal');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'pl-pref-modal-title');

  const catNec = copy.preferencesModal.categories.necessary;
  const catAna = copy.preferencesModal.categories.analytics;

  modal.innerHTML = `
    <div class="pl-modal-dialog" tabindex="-1">
      <div class="pl-modal-header">
        <h3 class="pl-modal-title" id="pl-pref-modal-title">${copy.preferencesModal.title}</h3>
        <button type="button" class="pl-modal-close" data-modal-close aria-label="${copy.preferencesModal.closeAriaLabel}">
          &times;
        </button>
      </div>
      <div class="pl-modal-body">
        <p class="pl-modal-lead">${copy.preferencesModal.description}</p>
        <div class="pl-consent-categories">
          <!-- Necessary Category (Always Active) -->
          <div class="pl-consent-category-card">
            <div class="pl-consent-category-header">
              <div class="pl-consent-category-title-group">
                <span class="pl-consent-category-name">${catNec.title}</span>
                <span class="pl-consent-badge pl-consent-badge--necessary">${catNec.badge}</span>
              </div>
              <label class="pl-toggle-switch is-disabled" title="${catNec.badge}">
                <input type="checkbox" class="pl-toggle-input" checked disabled aria-label="${catNec.title}">
                <span class="pl-toggle-track"><span class="pl-toggle-thumb"></span></span>
              </label>
            </div>
            <p class="pl-consent-category-desc">${catNec.description}</p>
          </div>

          <!-- Analytics Category (Optional) -->
          <div class="pl-consent-category-card">
            <div class="pl-consent-category-header">
              <div class="pl-consent-category-title-group">
                <span class="pl-consent-category-name">${catAna.title}</span>
                <span class="pl-consent-badge pl-consent-badge--optional">${catAna.badge}</span>
              </div>
              <label class="pl-toggle-switch" for="pl-consent-analytics-toggle">
                <input type="checkbox" id="pl-consent-analytics-toggle" class="pl-toggle-input" aria-label="${catAna.title}">
                <span class="pl-toggle-track"><span class="pl-toggle-thumb"></span></span>
              </label>
            </div>
            <p class="pl-consent-category-desc">${catAna.description}</p>
            <span class="pl-consent-category-provider">${catAna.provider}</span>
          </div>
        </div>
      </div>
      <div class="pl-modal-footer">
        <div class="pl-modal-footer-links">
          <a href="#cookie-policy" class="pl-consent-link" data-consent-action="policy">
            ${copy.preferencesModal.footerLinks.cookieText}
          </a>
          <span>·</span>
          <a href="#privacy-policy" class="pl-consent-link" data-consent-action="policy">
            ${copy.preferencesModal.footerLinks.privacyText}
          </a>
        </div>
        <button type="button" class="pl-consent-btn pl-consent-btn--primary" data-consent-save>
          ${copy.preferencesModal.saveBtn}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

/**
 * Creates and injects the Extended Policy Modal into the DOM
 */
function createPolicyModalElement() {
  const modal = document.createElement('div');
  modal.className = 'pl-modal-backdrop';
  modal.setAttribute('id', 'pl-cookie-policy-modal');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'pl-policy-modal-title');

  const sectionsHtml = copy.policyModal.sections.map(sec => `
    <div class="pl-policy-section">
      <h4 class="pl-policy-section-title">${sec.title}</h4>
      <div class="pl-policy-section-content">${sec.content}</div>
    </div>
  `).join('');

  modal.innerHTML = `
    <div class="pl-modal-dialog pl-modal-dialog--wide" tabindex="-1">
      <div class="pl-modal-header">
        <h3 class="pl-modal-title" id="pl-policy-modal-title">${copy.policyModal.title}</h3>
        <button type="button" class="pl-modal-close" data-modal-close aria-label="${copy.policyModal.closeAriaLabel}">
          &times;
        </button>
      </div>
      <div class="pl-modal-body">
        <p class="pl-modal-lead">${copy.policyModal.intro}</p>
        ${sectionsHtml}
      </div>
      <div class="pl-modal-footer">
        <div></div>
        <button type="button" class="pl-consent-btn pl-consent-btn--outline" data-modal-close>
          Chiudi
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

/**
 * Show the cookie banner with smooth entrance animation
 */
export function showBanner() {
  if (bannerEl) {
    // Force reflow for CSS transition
    bannerEl.classList.remove('is-visible');
    void bannerEl.offsetWidth;
    bannerEl.classList.add('is-visible');
  }
}

/**
 * Hide the cookie banner
 */
export function hideBanner() {
  if (bannerEl) {
    bannerEl.classList.remove('is-visible');
  }
}

/**
 * Open the Cookie Preferences Center modal
 */
export function openCookiePreferences() {
  if (!preferencesModalEl) return;
  
  // Sync toggle state with currently stored consent
  const currentConsent = getConsent();
  if (analyticsCheckboxEl) {
    analyticsCheckboxEl.checked = Boolean(currentConsent?.analytics);
  }

  preferencesModalEl.classList.add('is-open');
  const dialog = preferencesModalEl.querySelector('.pl-modal-dialog');
  dialog?.focus();
  document.body.style.overflow = 'hidden';
}

/**
 * Close the Cookie Preferences Center modal
 */
export function closeCookiePreferences() {
  if (!preferencesModalEl) return;
  preferencesModalEl.classList.remove('is-open');
  document.body.style.overflow = '';
}

/**
 * Open the Privacy & Cookie Policy modal
 */
export function openPrivacyPolicy() {
  if (!policyModalEl) return;
  policyModalEl.classList.add('is-open');
  const dialog = policyModalEl.querySelector('.pl-modal-dialog');
  dialog?.focus();
  document.body.style.overflow = 'hidden';
}

/**
 * Close the Privacy & Cookie Policy modal
 */
export function closePrivacyPolicy() {
  if (!policyModalEl) return;
  policyModalEl.classList.remove('is-open');
  document.body.style.overflow = '';
}

/**
 * Handle user accepting analytics
 */
function handleAccept() {
  saveConsent({ analytics: true });
  hideBanner();
}

/**
 * Handle user rejecting analytics (or clicking X)
 */
function handleReject() {
  saveConsent({ analytics: false });
  hideBanner();
}

/**
 * Handle saving preferences from modal
 */
function handleSavePreferences() {
  const analyticsGranted = Boolean(analyticsCheckboxEl?.checked);
  saveConsent({ analytics: analyticsGranted });
  closeCookiePreferences();
  hideBanner();
}

/**
 * Bind DOM event handlers for banner, modals and keyboard navigation
 */
function bindEvents() {
  // Banner click actions
  bannerEl?.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-consent-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.consentAction;

    if (action === 'accept') {
      handleAccept();
    } else if (action === 'reject' || action === 'reject-close') {
      handleReject();
    } else if (action === 'manage') {
      openCookiePreferences();
    } else if (action === 'policy') {
      e.preventDefault();
      openPrivacyPolicy();
    }
  });

  // Preferences Modal actions
  preferencesModalEl?.addEventListener('click', (e) => {
    // Backdrop click to close
    if (e.target === preferencesModalEl || e.target.closest('[data-modal-close]')) {
      closeCookiePreferences();
      return;
    }

    if (e.target.closest('[data-consent-save]')) {
      handleSavePreferences();
      return;
    }

    if (e.target.closest('[data-consent-action="policy"]')) {
      e.preventDefault();
      closeCookiePreferences();
      openPrivacyPolicy();
    }
  });

  // Policy Modal actions
  policyModalEl?.addEventListener('click', (e) => {
    if (e.target === policyModalEl || e.target.closest('[data-modal-close]')) {
      closePrivacyPolicy();
    }
  });

  // Global Keyboard Escape listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (preferencesModalEl?.classList.contains('is-open')) {
        closeCookiePreferences();
      }
      if (policyModalEl?.classList.contains('is-open')) {
        closePrivacyPolicy();
      }
    }
  });
}

/**
 * Initialize the complete Cookie Consent System
 */
export function initCookieConsent() {
  if (typeof window === 'undefined') return;

  // Render elements
  bannerEl = createBannerElement();
  preferencesModalEl = createPreferencesModalElement();
  policyModalEl = createPolicyModalElement();
  analyticsCheckboxEl = preferencesModalEl.querySelector('#pl-consent-analytics-toggle');

  // Bind interaction handlers
  bindEvents();

  // Expose global triggers for footer links
  window.openCookiePreferences = openCookiePreferences;
  window.openPrivacyPolicy = openPrivacyPolicy;

  // Show banner only if no valid consent decision is recorded
  if (!hasValidConsent()) {
    // Micro delay to let page mount smoothly
    setTimeout(() => {
      showBanner();
    }, 400);
  }
}
