/*
 * Small mobile-only UX refinements that cannot be expressed safely in CSS.
 * Desktop is intentionally left untouched.
 */

const MOBILE_QUERY = '(max-width: 768px)';

function applyMobileResponsiveEnhancements() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return true;

  const faq = document.querySelector('#faq');
  if (!faq) return false;

  /* Mobile starts compact: users choose which objection to open. */
  faq.querySelector('.pl-faq-card[open]')?.removeAttribute('open');

  /* Make swipe the primary mental model; arrows remain as accessible fallback. */
  document.querySelectorAll('.pl-radar-carousel-hint span').forEach((hint) => {
    hint.textContent = 'Scorri per vedere i 3 passaggi →';
  });

  return true;
}

function initMobileResponsiveEnhancements() {
  if (applyMobileResponsiveEnhancements()) return;

  const observer = new MutationObserver(() => {
    if (!applyMobileResponsiveEnhancements()) return;
    observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileResponsiveEnhancements, { once: true });
} else {
  initMobileResponsiveEnhancements();
}
