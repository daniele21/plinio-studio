/**
 * Plinio Image Zoom Modal Component
 * Accessible, lightweight lightbox that enlarges product showcase screenshots
 * with warm theme styling, zoom toggle, and keyboard accessibility.
 */

import { trackEvent } from '../services/analytics.js';

let modalEl = null;
let currentImgEl = null;
let activeTriggerEl = null;
let isExpanded = false;

/**
 * Creates and injects the modal DOM structure (Singleton pattern)
 */
function createModalDOM() {
  if (modalEl) return modalEl;

  const modal = document.createElement('div');
  modal.className = 'pl-image-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Anteprima immagine ingrandita');
  modal.id = 'pl-image-zoom-modal';

  modal.innerHTML = `
    <div class="pl-image-modal__dialog" tabindex="-1">
      <div class="pl-image-modal__header">
        <div class="pl-image-modal__info">
          <span class="pl-image-modal__dot" aria-hidden="true"></span>
          <span class="pl-image-modal__title" data-modal-title>Anteprima</span>
          <span class="pl-image-modal__caption" data-modal-caption></span>
        </div>
        <div class="pl-image-modal__actions">
          <button type="button" class="pl-image-modal__btn pl-image-modal__btn--toggle" data-modal-zoom aria-label="Ingrandisci o riduci dimensione">
            <span class="pl-modal-zoom-text">Ingrandisci</span>
          </button>
          <button type="button" class="pl-image-modal__btn pl-image-modal__close" data-modal-close aria-label="Chiudi finestra (Esc)">
            ✕
          </button>
        </div>
      </div>
      <div class="pl-image-modal__body">
        <div class="pl-image-modal__img-wrap">
          <img class="pl-image-modal__img" data-modal-img src="" alt="" />
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  const closeBtn = modal.querySelector('[data-modal-close]');
  closeBtn?.addEventListener('click', closeImageModal);

  // Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeImageModal();
    }
  });

  // Zoom toggle
  const zoomBtn = modal.querySelector('[data-modal-zoom]');
  const zoomText = modal.querySelector('.pl-modal-zoom-text');
  const imgEl = modal.querySelector('[data-modal-img]');

  const toggleZoom = () => {
    isExpanded = !isExpanded;
    imgEl.classList.toggle('pl-image-modal__img--expanded', isExpanded);
    if (zoomText) {
      zoomText.textContent = isExpanded ? 'Adatta' : 'Ingrandisci';
    }
  };

  zoomBtn?.addEventListener('click', toggleZoom);
  imgEl?.addEventListener('click', toggleZoom);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('pl-image-modal--active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeImageModal();
    } else if (e.key === 'Tab') {
      // Focus trapping
      const focusableEls = modal.querySelectorAll('button, [tabindex="0"]');
      if (!focusableEls.length) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  });

  modalEl = modal;
  currentImgEl = imgEl;
  return modal;
}

/**
 * Open the Image Zoom Modal with the specified image data
 * @param {Object} options
 * @param {string} options.src - URL of image
 * @param {string} [options.alt] - Alt text
 * @param {string} [options.title] - Title
 * @param {string} [options.caption] - Caption/subtitle
 * @param {HTMLElement} [options.triggerEl] - Element that triggered open
 */
export function openImageModal({ src, alt = '', title = '', caption = '', triggerEl = null }) {
  const modal = createModalDOM();
  activeTriggerEl = triggerEl;
  isExpanded = false;

  const titleEl = modal.querySelector('[data-modal-title]');
  const captionEl = modal.querySelector('[data-modal-caption]');
  const zoomText = modal.querySelector('.pl-modal-zoom-text');

  if (currentImgEl) {
    currentImgEl.src = src;
    currentImgEl.alt = alt || title || 'Anteprima schermata Plinio';
    currentImgEl.classList.remove('pl-image-modal__img--expanded');
  }

  if (titleEl) titleEl.textContent = title || 'Plinio Studio';
  if (captionEl) {
    if (caption) {
      captionEl.textContent = `· ${caption}`;
      captionEl.style.display = 'inline';
    } else {
      captionEl.textContent = '';
      captionEl.style.display = 'none';
    }
  }

  if (zoomText) zoomText.textContent = 'Ingrandisci';

  // Prevent page scroll
  document.body.style.overflow = 'hidden';

  // Activate modal
  modal.classList.add('pl-image-modal--active');

  // Focus dialog / close button
  setTimeout(() => {
    const closeBtn = modal.querySelector('[data-modal-close]');
    closeBtn?.focus();
  }, 50);

  // Analytics event
  trackEvent('image_zoom_opened', {
    image_src: src,
    image_title: title || alt,
  });
}

/**
 * Close the Image Zoom Modal
 */
export function closeImageModal() {
  if (!modalEl || !modalEl.classList.contains('pl-image-modal--active')) return;

  modalEl.classList.remove('pl-image-modal--active');
  document.body.style.overflow = '';

  if (currentImgEl) {
    currentImgEl.classList.remove('pl-image-modal__img--expanded');
  }
  isExpanded = false;

  // Restore focus to trigger
  if (activeTriggerEl && typeof activeTriggerEl.focus === 'function') {
    activeTriggerEl.focus();
  }
  activeTriggerEl = null;
}

/**
 * Attaches zoom listeners and hints to all zoomable screenshot containers in the page
 */
export function initImageModal() {
  createModalDOM();

  // Find all cards / media wrappers with zoomable images
  const zoomTargets = document.querySelectorAll(
    '[data-zoomable="true"], .pl-dual-card, .pl-v5-product__shot, .pl-mockup-wrapper'
  );

  zoomTargets.forEach((target) => {
    // Avoid double initialization
    if (target.dataset.zoomInitialized === 'true') return;
    target.dataset.zoomInitialized = 'true';
    target.dataset.zoomable = 'true';

    // Ensure keyboard focusable
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '0');
    }

    // Add zoom hint badge if not present
    if (!target.querySelector('.pl-zoom-hint')) {
      const hint = document.createElement('div');
      hint.className = 'pl-zoom-hint';
      hint.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <span>Ingrandisci</span>
      `;
      target.appendChild(hint);
    }

    const handleTrigger = (e) => {
      // If clicking interactive child like button/link, let it handle
      if (e.target.closest('a, button')) return;

      const img = target.querySelector('img');
      if (!img) return;

      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      
      // Extract title and caption from card header if available
      const titleStrong = target.querySelector('.pl-dual-card__title strong, .pl-dual-card__header strong');
      const titleEl = target.querySelector('.pl-dual-card__title');
      let title = titleStrong ? titleStrong.textContent.trim() : (alt || 'Plinio Studio');
      let caption = '';

      if (titleEl && titleStrong) {
        const fullText = titleEl.textContent.trim();
        caption = fullText.replace(titleStrong.textContent, '').replace(/^[·\s-]+/, '').trim();
      }

      openImageModal({
        src,
        alt,
        title,
        caption,
        triggerEl: target,
      });
    };

    target.addEventListener('click', handleTrigger);

    target.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });
}
