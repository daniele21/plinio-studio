/**
 * Pilot lead modal + form controller.
 * Keeps PII out of Analytics and sends lead data only to the dedicated backend endpoint.
 */

import { trackEvent } from '../services/analytics.js';
import { openPrivacyPolicy } from './cookieConsent.js';
import { siteConfig } from '../content/siteConfig.js';

const DEFAULT_ENDPOINT = 'https://europe-west1-plinio-studio.cloudfunctions.net/submitLead';
const DEFAULT_SUCCESS_PATH = '/grazie';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const normalize = (value) => String(value || '').trim();
let lastModalTrigger = null;

function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: normalize(params.get('utm_source')).slice(0, 100),
    utmMedium: normalize(params.get('utm_medium')).slice(0, 100),
    utmCampaign: normalize(params.get('utm_campaign')).slice(0, 160),
    utmContent: normalize(params.get('utm_content')).slice(0, 160),
    referrer: normalize(document.referrer).slice(0, 300),
    landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
  };
}

function getModal() {
  return document.querySelector('[data-lead-modal]');
}

function syncBodyLock() {
  const leadOpen = getModal()?.classList.contains('is-open');
  const privacyOpen = document.querySelector('.pl-modal-backdrop.is-open');
  document.body.style.overflow = leadOpen || privacyOpen ? 'hidden' : '';
}

function openLeadModal(trigger = null) {
  const modal = getModal();
  if (!modal) return;

  lastModalTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
  modal.hidden = false;

  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    syncBodyLock();
    modal.querySelector('.pl-lead-modal__dialog')?.focus();
  });

  trackEvent('lead_modal_open', {
    location: trigger?.dataset?.analyticsLocation || 'unknown',
  });
}

function closeLeadModal({ restoreFocus = true } = {}) {
  const modal = getModal();
  if (!modal || !modal.classList.contains('is-open')) return;

  modal.classList.remove('is-open');
  syncBodyLock();

  window.setTimeout(() => {
    if (!modal.classList.contains('is-open')) modal.hidden = true;
  }, 180);

  if (restoreFocus && lastModalTrigger instanceof HTMLElement && document.contains(lastModalTrigger)) {
    lastModalTrigger.focus({ preventScroll: true });
  }
}

function trapModalFocus(event) {
  if (event.key !== 'Tab') return;
  const modal = getModal();
  if (!modal?.classList.contains('is-open')) return;

  const dialog = modal.querySelector('.pl-lead-modal__dialog');
  if (!dialog) return;
  const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)]
    .filter((el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true');

  if (!focusable.length) {
    event.preventDefault();
    dialog.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || !dialog.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function setFieldError(form, fieldName, message = '') {
  const field = form.elements.namedItem(fieldName);
  const error = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (field instanceof HTMLElement) {
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
  if (error) error.textContent = message;
}

function validate(form) {
  const data = new FormData(form);
  const values = {
    fullName: normalize(data.get('fullName')),
    email: normalize(data.get('email')).toLowerCase(),
    company: normalize(data.get('company')),
    role: normalize(data.get('role')),
    phone: normalize(data.get('phone')),
    privacyAcknowledged: data.get('privacyAcknowledged') === 'on',
  };

  let valid = true;
  const required = [
    ['fullName', values.fullName, 'Inserisci nome e cognome.'],
    ['email', values.email, 'Inserisci la tua email di lavoro.'],
    ['company', values.company, 'Inserisci il nome dell’azienda.'],
    ['role', values.role, 'Inserisci il tuo ruolo.'],
  ];

  required.forEach(([name, value, message]) => {
    const error = value ? '' : message;
    setFieldError(form, name, error);
    if (error) valid = false;
  });

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  if (values.email && !emailLooksValid) {
    setFieldError(form, 'email', 'Controlla l’indirizzo email inserito.');
    valid = false;
  }

  if (!values.privacyAcknowledged) {
    setFieldError(form, 'privacyAcknowledged', 'Conferma di aver letto l’informativa privacy.');
    valid = false;
  } else {
    setFieldError(form, 'privacyAcknowledged', '');
  }

  return { valid, values };
}

function setFormState(form, state, message = '') {
  const submit = form.querySelector('[data-lead-submit]');
  const status = form.querySelector('[data-lead-status]');

  form.dataset.state = state;
  form.setAttribute('aria-busy', state === 'submitting' ? 'true' : 'false');

  if (submit) {
    submit.disabled = state === 'submitting';
    const label = submit.querySelector('[data-lead-submit-label]');
    if (label) label.textContent = state === 'submitting' ? 'Invio in corso…' : 'Voglio provare Plinio';
  }

  if (status) {
    status.textContent = message;
    status.classList.toggle('is-error', state === 'error');
  }
}

async function submitLead(form, startedAt) {
  if (form.dataset.state === 'submitting') return;

  const { valid, values } = validate(form);
  if (!valid) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const data = new FormData(form);
  const payload = {
    ...values,
    phone: values.phone || null,
    website: normalize(data.get('website')),
    formStartedAt: startedAt,
    policyVersion: form.dataset.policyVersion || '2026-09-02',
    source: 'plinio_landing',
    ...getAttribution(),
  };

  setFormState(form, 'submitting');
  trackEvent('lead_form_submit_attempt', { location: 'pilot_form' });

  try {
    const endpoint = siteConfig.conversion?.leadApiUrl || DEFAULT_ENDPOINT;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Hai inviato diverse richieste in poco tempo. Riprova tra qualche minuto.');
      }
      if (response.status === 400 && result?.error === 'validation_error') {
        throw new Error('Controlla i dati inseriti e riprova.');
      }
      throw new Error('Non siamo riusciti a inviare la richiesta. Riprova tra poco.');
    }

    await trackEvent('lead_form_submit_success', { location: 'pilot_form' });
    const successPath = siteConfig.conversion?.thankYouPath || DEFAULT_SUCCESS_PATH;
    window.location.assign(successPath);
  } catch (error) {
    console.warn('[LeadForm] Submit failed:', error);
    trackEvent('lead_form_submit_error', { location: 'pilot_form' });
    setFormState(form, 'error', error?.message || 'Si è verificato un errore. Riprova tra poco.');
  }
}

function wireForm(form) {
  if (!form || form.dataset.leadFormReady === 'true') return;
  form.dataset.leadFormReady = 'true';

  let startedAt = Date.now();
  let hasTrackedStart = false;

  form.addEventListener('focusin', () => {
    if (hasTrackedStart) return;
    hasTrackedStart = true;
    startedAt = Date.now();
    trackEvent('lead_form_start', { location: 'pilot_form' });
  }, { once: true });

  form.addEventListener('input', (event) => {
    const name = event.target?.name;
    if (name) setFieldError(form, name, '');
    if (form.dataset.state !== 'submitting') setFormState(form, 'idle');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitLead(form, startedAt);
  });

  form.querySelector('[data-lead-privacy]')?.addEventListener('click', (event) => {
    event.preventDefault();
    openPrivacyPolicy();
    syncBodyLock();
  });
}

function wireModal(modal) {
  if (!modal || modal.dataset.leadModalReady === 'true') return;
  modal.dataset.leadModalReady = 'true';

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-lead-modal-close]')) {
      closeLeadModal();
    }
  });

  modal.addEventListener('keydown', trapModalFocus);
}

function wirePrivacyModalBridge() {
  if (document.documentElement.dataset.leadPrivacyBridgeReady === 'true') return;
  document.documentElement.dataset.leadPrivacyBridgeReady = 'true';

  const connect = () => {
    const policy = document.querySelector('#pl-cookie-policy-modal');
    if (!policy || policy.dataset.leadBridgeReady === 'true') return false;
    policy.dataset.leadBridgeReady = 'true';

    const observer = new MutationObserver(() => {
      const leadModal = getModal();
      if (!leadModal?.classList.contains('is-open')) return;
      syncBodyLock();
      if (!policy.classList.contains('is-open')) {
        leadModal.querySelector('.pl-lead-modal__dialog')?.focus({ preventScroll: true });
      }
    });

    observer.observe(policy, { attributes: true, attributeFilter: ['class'] });
    return true;
  };

  if (connect()) return;
  const observer = new MutationObserver(() => {
    if (!connect()) return;
    observer.disconnect();
  });
  observer.observe(document.body, { childList: true });
}

function wireGlobalTriggers() {
  if (document.documentElement.dataset.leadTriggersReady === 'true') return;
  document.documentElement.dataset.leadTriggersReady = 'true';

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-lead-modal]');
    if (!trigger) return;
    event.preventDefault();
    openLeadModal(trigger);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && getModal()?.classList.contains('is-open') && !document.querySelector('.pl-modal-backdrop.is-open')) {
      event.preventDefault();
      closeLeadModal();
    }
  });
}

function wireMountedLeadUi() {
  const modal = getModal();
  const form = document.querySelector('#pilot-lead-form');
  if (!modal || !form) return false;
  wireModal(modal);
  wireForm(form);
  return true;
}

/**
 * Fragments are mounted asynchronously by app.js. Global CTA delegation is wired immediately;
 * the dialog and form are wired as soon as they enter the DOM.
 */
export function initLeadForm() {
  wireGlobalTriggers();
  wirePrivacyModalBridge();

  if (wireMountedLeadUi()) return;

  const observer = new MutationObserver(() => {
    if (!wireMountedLeadUi()) return;
    observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}

initLeadForm();
