/**
 * Plinio Animations & Micro-Interactions Controller
 * Modular engine for staggered scroll reveals, cursor spotlight,
 * KPI number tickers, and button shimmers.
 */

const reduceMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

/**
 * 1. Staggered Scroll Reveals via IntersectionObserver
 */
export function initScrollReveals() {
  const revElements = [...document.querySelectorAll('[data-rev]')];
  if (!revElements.length) return;

  if (reduceMotion) {
    revElements.forEach(el => {
      el.classList.add('is-revealed');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Auto-stagger children inside grid containers if not explicitly delayed
  const gridContainers = document.querySelectorAll(
    '.pl-personas-grid, .pl-evidence-grid, .pl-v5-proof__grid, .pl-process-steps, .pl-v5-product__signals'
  );

  gridContainers.forEach(container => {
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      if (!child.hasAttribute('data-rev')) {
        child.setAttribute('data-rev', '1');
        child.setAttribute('data-delay', (index * 0.07).toFixed(2));
      }
    });
  });

  // Re-query in case children were added
  const allRevs = [...document.querySelectorAll('[data-rev]')];

  allRevs.forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0) || 0;
    el.style.transition = `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-revealed');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  allRevs.forEach(el => observer.observe(el));
}

/**
 * 2. Mouse Spotlight / Glow Surfaces
 */
export function initSpotlightGlow() {
  if (reduceMotion) return;

  const spotlightCards = document.querySelectorAll(
    '.pl-persona-card, .pl-v5-product__shot, .pl-stat-card, .pl-dual-card, .pl-fatti-voce-card, .pl-pipeline-showcase, .pl-hero-pipeline, .pl-content-pipeline, .pl-evidence-pipeline'
  );

  spotlightCards.forEach(card => {
    card.classList.add('pl-spotlight');

    let rafId = null;
    const onPointerMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', `${x}px`);
        card.style.setProperty('--spotlight-y', `${y}px`);
      });
    };

    card.addEventListener('pointermove', onPointerMove, { passive: true });
  });
}

/**
 * 3. KPI Number Ticker (Smooth count-up with ease-out curve)
 */
export function initNumberCounters() {
  if (reduceMotion) return;

  const counterTargets = document.querySelectorAll(
    '.pl-evidence-stat, .pl-stat-number, .pl-v5-signal-chip--terracotta strong'
  );

  if (!counterTargets.length) return;

  const parseTarget = (text) => {
    const trimmed = text.trim();
    const hasMinus = trimmed.includes('−') || trimmed.includes('-');
    const hasPercent = trimmed.includes('%');
    const hasPlus = trimmed.includes('+');
    const numericValue = parseFloat(trimmed.replace(/[^0-9.]/g, ''));

    return {
      hasMinus,
      hasPercent,
      hasPlus,
      target: isNaN(numericValue) ? null : numericValue,
      originalText: text
    };
  };

  const animateValue = (el, meta, duration = 1100) => {
    if (meta.target === null) return;
    const start = performance.now();
    const isDecimal = meta.target % 1 !== 0;

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic ease-out curve: 1 - Math.pow(1 - progress, 5)
      const easeOut = 1 - Math.pow(1 - progress, 5);
      const current = meta.target * easeOut;

      let display = isDecimal ? current.toFixed(1) : Math.round(current);
      if (meta.hasMinus) display = '−' + display;
      if (meta.hasPlus) display = display + '+';
      if (meta.hasPercent) display = display + '%';

      el.textContent = display;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = meta.originalText;
      }
    };

    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const meta = parseTarget(el.textContent);
          if (meta.target !== null) {
            animateValue(el, meta);
          }
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  counterTargets.forEach(el => observer.observe(el));
}

/**
 * 4. Periodic Shimmer on Primary CTAs
 */
export function initShimmerEffects() {
  if (reduceMotion) return;

  const primaryBtns = document.querySelectorAll('.pl-btn--primary, .pl-header__cta');
  if (!primaryBtns.length) return;

  // Run periodic subtle shimmer sweep every 6 seconds
  setInterval(() => {
    primaryBtns.forEach(btn => {
      btn.classList.remove('pl-shimmer-fire');
      // Trigger reflow to restart CSS animation
      void btn.offsetWidth;
      btn.classList.add('pl-shimmer-fire');
    });
  }, 6000);
}

/**
 * Initialize all animation and micro-interaction systems
 */
export function initAnimations() {
  initScrollReveals();
  initSpotlightGlow();
  initNumberCounters();
  initShimmerEffects();
}
