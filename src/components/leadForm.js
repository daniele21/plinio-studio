/**
 * Pilot lead form controller.
 * Keeps PII out of Analytics and sends lead data only to the dedicated backend endpoint.
 */

import { trackEvent } from '../services/analytics.js';
import { openPrivacyPolicy } from './cookieConsent.js';
import { siteConfig } from '../content/siteConfig.js';

const DEFAULT_ENDPOINT = 'https://europe-west1-plinio-studio.cloudfunctions.net/submitLead';
const DEFAULT_SUCCESS_PATH = '/grazie';

const normalize = (value) => String(value || '').trim();

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
    website: normalize(data.get('website')), // honeypot; should remain empty
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
  });
}

/**
 * Fragments are mounted asynchronously by app.js. A MutationObserver avoids races and
 * wires the form as soon as #pilot-lead-form enters the DOM.
 */
export function initLeadForm() {
  const existing = document.querySelector('#pilot-lead-form');
  if (existing) {
    wireForm(existing);
    return;
  }

  const observer = new MutationObserver(() => {
    const form = document.querySelector('#pilot-lead-form');
    if (!form) return;
    observer.disconnect();
    wireForm(form);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}

initLeadForm();
