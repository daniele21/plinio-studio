import { initAnalyticsFromConsent, trackEvent } from './services/analytics.js';
import {
  initCookieConsent,
  openCookiePreferences,
  openPrivacyPolicy,
} from './components/cookieConsent.js';

function init() {
  initAnalyticsFromConsent();
  initCookieConsent();

  document.querySelector('[data-thanks-privacy]')?.addEventListener('click', openPrivacyPolicy);
  document.querySelector('[data-thanks-preferences]')?.addEventListener('click', openCookiePreferences);

  trackEvent('lead_thank_you_view', { location: 'thank_you_page' });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
