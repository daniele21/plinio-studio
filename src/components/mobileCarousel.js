/**
 * Plinio Mobile Carousels Controller
 * Powers the hero, how-it-works, and unified Sources / Radar / Content Studio mobile carousels
 * with touch swipe, click-to-next slide loop, dot syncing, and dynamic titles.
 */

export function setupCarousel(containerSelector, options = {}) {
  const carouselEl = document.querySelector(containerSelector);
  if (!carouselEl) return;

  const viewport = carouselEl.querySelector('[data-carousel-viewport], [data-radar-viewport]');
  const track = carouselEl.querySelector('[data-carousel-track], [data-radar-track]');
  const prevBtn = carouselEl.querySelector('[data-carousel-prev], [data-radar-prev]');
  const nextBtn = carouselEl.querySelector('[data-carousel-next], [data-radar-next]');
  const dots = carouselEl.querySelectorAll('[data-dot]');
  const titleEl = carouselEl.querySelector('[data-carousel-title], [data-radar-slide-title]');
  const badgeEl = carouselEl.querySelector('[data-carousel-badge], [data-radar-slide-badge]');

  if (!viewport || !track) return;

  const slides = [...track.querySelectorAll('.pl-radar-carousel-slide, .pl-carousel-slide')];
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  const titles = options.titles || [];
  let currentIndex = 0;

  const getActiveIndex = () => {
    const containerCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    slides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(containerCenter - slideCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    });

    return closestIndex;
  };

  const updateUI = (idx) => {
    // Update active dot
    dots.forEach((dot, i) => {
      const isActive = i === idx;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update active slide
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === idx);
    });

    // Update title & badge counter if present
    if (titleEl && titles[idx]) {
      titleEl.innerHTML = titles[idx];
    }
    if (badgeEl) {
      badgeEl.textContent = `${idx + 1} di ${totalSlides}`;
    }
  };

  const scrollToSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const targetSlide = slides[currentIndex];
    if (targetSlide) {
      const scrollTarget = targetSlide.offsetLeft - (viewport.clientWidth - targetSlide.offsetWidth) / 2;
      viewport.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
      });
    }
    updateUI(currentIndex);
  };

  // Button handlers (if present)
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    scrollToSlide(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    scrollToSlide(currentIndex + 1);
  });

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-dot'), 10);
      if (!isNaN(idx)) scrollToSlide(idx);
    });
  });

  // Touch gesture detection
  let isDragging = false;
  let startX = 0;

  viewport.addEventListener('touchstart', (e) => {
    isDragging = false;
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (Math.abs(e.touches[0].clientX - startX) > 10) {
      isDragging = true;
    }
  }, { passive: true });

  // Tap on non-active side slide centers it
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', (e) => {
      if (isDragging) return;
      if (idx !== currentIndex) {
        e.stopPropagation();
        scrollToSlide(idx);
      }
    });
  });

  // Real-time scroll sync with requestAnimationFrame
  let scrollRaf = null;
  viewport.addEventListener('scroll', () => {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      const activeIdx = getActiveIndex();
      if (activeIdx !== currentIndex) {
        currentIndex = activeIdx;
        updateUI(activeIdx);
      }
    });
  }, { passive: true });

  // Initial center on mobile
  const initialCenter = () => {
    const targetSlide = slides[0];
    if (targetSlide) {
      const scrollTarget = targetSlide.offsetLeft - (viewport.clientWidth - targetSlide.offsetWidth) / 2;
      viewport.scrollLeft = scrollTarget;
      updateUI(0);
    }
  };

  setTimeout(initialCenter, 60);
  window.addEventListener('resize', initialCenter, { passive: true });
}

/**
 * Hero Output Cards Carousel (Section 1 Header)
 * Manages touch swipe, dot indicators and centered snapping on mobile devices.
 */
export function initHeroOutputCarousel() {
  const container = document.querySelector('.pl-v2-output__cards');
  if (!container) return;

  const cards = [...container.querySelectorAll('.pl-v2-content-card')];
  const dots = [...document.querySelectorAll('[data-hero-dot], .pl-v2-output__dots button, .pl-v2-output__dots i')];

  if (cards.length < 2) return;

  const getActiveIndex = () => {
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    });

    return closestIndex;
  };

  const updateUI = (activeIdx) => {
    cards.forEach((card, idx) => {
      card.classList.toggle('is-active', idx === activeIdx);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIdx);
      dot.setAttribute('aria-selected', idx === activeIdx ? 'true' : 'false');
    });
  };

  const scrollToCard = (index) => {
    const target = cards[index];
    if (!target) return;
    const scrollTarget = target.offsetLeft - (container.clientWidth - target.offsetWidth) / 2;
    container.scrollTo({
      left: scrollTarget,
      behavior: 'smooth'
    });
  };

  // Dot click handlers
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToCard(idx);
    });
  });

  // Tap on non-active side card to center it
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (window.innerWidth <= 880 && !card.classList.contains('is-active')) {
        scrollToCard(idx);
      }
    });
  });

  // Scroll listener for smooth active dot & card sync
  let scrollRaf = null;
  container.addEventListener('scroll', () => {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      if (window.innerWidth <= 880) {
        const activeIdx = getActiveIndex();
        updateUI(activeIdx);
      }
    });
  }, { passive: true });

  // Initial centering on mobile (LinkedIn is at index 1)
  const initialCenter = () => {
    if (window.innerWidth <= 880) {
      const activeIdx = cards.findIndex(c => c.classList.contains('is-active'));
      const targetIdx = activeIdx >= 0 ? activeIdx : 1;
      const target = cards[targetIdx];
      if (target) {
        const scrollTarget = target.offsetLeft - (container.clientWidth - target.offsetWidth) / 2;
        container.scrollLeft = scrollTarget;
        updateUI(targetIdx);
      }
    }
  };

  setTimeout(initialCenter, 60);
  window.addEventListener('resize', initialCenter, { passive: true });
}

/**
 * Come Funziona Cards Carousel (Section 1 Bottom)
 * Synchronizes horizontal snap scrolling, active card highlighting, and dots.
 */
export function initHowTrackCarousel() {
  const container = document.querySelector('.pl-v2-how__track');
  if (!container) return;

  const cards = [...container.querySelectorAll('.pl-v2-how-step')];
  const dots = [...document.querySelectorAll('[data-how-dot]')];

  if (cards.length < 2) return;

  const getActiveIndex = () => {
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    });

    return closestIndex;
  };

  const updateUI = (activeIdx) => {
    cards.forEach((card, idx) => {
      card.classList.toggle('is-active', idx === activeIdx);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIdx);
      dot.setAttribute('aria-selected', idx === activeIdx ? 'true' : 'false');
    });
  };

  const scrollToCard = (index) => {
    const target = cards[index];
    if (!target) return;
    const scrollTarget = target.offsetLeft - (container.clientWidth - target.offsetWidth) / 2;
    container.scrollTo({
      left: scrollTarget,
      behavior: 'smooth'
    });
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToCard(idx);
    });
  });

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (window.innerWidth <= 880 && !card.classList.contains('is-active')) {
        scrollToCard(idx);
      }
    });
  });

  let scrollRaf = null;
  container.addEventListener('scroll', () => {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      if (window.innerWidth <= 880) {
        const activeIdx = getActiveIndex();
        updateUI(activeIdx);
      }
    });
  }, { passive: true });

  const initialCenter = () => {
    if (window.innerWidth <= 880) {
      updateUI(0);
    }
  };

  setTimeout(initialCenter, 60);
  window.addEventListener('resize', initialCenter, { passive: true });
}

export function initMobileCarousels() {
  // 0. Hero Output Cards (Section 1 Top)
  initHeroOutputCarousel();

  // 1. Come funziona Cards (Section 1 Bottom)
  initHowTrackCarousel();

  // 3. Evidence / Fatti & Voce Carousel
  setupCarousel('[data-evidence-carousel]', {
    titles: [
      '<strong>1. Le vostre fonti</strong> · Progetti, persone e conoscenze',
      '<strong>2. Plinio Radar</strong> · Ogni settimana, nuove opportunità da raccontare.',
      '<strong>3. Content Studio</strong> · Contenuti pronti, nel vostro tono e con fonti collegate'
    ]
  });
}
