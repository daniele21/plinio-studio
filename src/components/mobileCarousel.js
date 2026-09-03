/**
 * Plinio Mobile Carousels Controller
 * Powers Section 1 (Radar), Section 2 (Content Studio), and Section Evidence (Fatti & Voce) mobile carousels
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

  const slides = track.querySelectorAll('.pl-radar-carousel-slide, .pl-carousel-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  const titles = options.titles || [];
  let currentIndex = 0;

  const goToSlide = (index) => {
    // Infinite loop
    currentIndex = (index + totalSlides) % totalSlides;

    const targetSlide = slides[currentIndex];
    if (targetSlide) {
      viewport.scrollTo({
        left: targetSlide.offsetLeft,
        behavior: 'smooth'
      });
    }

    updateUI(currentIndex);
  };

  const updateUI = (idx) => {
    // Update active dot
    dots.forEach((dot, i) => {
      const isActive = i === idx;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update title & badge counter
    if (titleEl && titles[idx]) {
      titleEl.innerHTML = titles[idx];
    }
    if (badgeEl) {
      badgeEl.textContent = `${idx + 1} di ${totalSlides}`;
    }
  };

  // Button handlers
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentIndex + 1);
  });

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-dot'), 10);
      if (!isNaN(idx)) goToSlide(idx);
    });
  });

  // Touch & drag gesture detection
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

  // Click on slide loops to next slide
  slides.forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (isDragging) return;
      e.stopPropagation();
      goToSlide(currentIndex + 1);
    });
  });

  // Touch scroll sync
  let scrollTimeout;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = viewport.scrollLeft;
      const slideWidth = viewport.offsetWidth;
      if (slideWidth > 0) {
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex >= 0 && newIndex < totalSlides && newIndex !== currentIndex) {
          currentIndex = newIndex;
          updateUI(currentIndex);
        }
      }
    }, 50);
  }, { passive: true });

  // Set initial state
  updateUI(0);
}

export function initMobileCarousels() {
  // 1. Radar Carousel (Section 1)
  setupCarousel('[data-radar-carousel]', {
    titles: [
      '<strong>1. I vostri materiali</strong> · Materiali di progetto caricati',
      '<strong>2. Plinio Radar</strong> · Trova le comunicazioni per voi',
      '<strong>3. Comunicazioni pronte</strong> · LinkedIn, Case study, Newsletter'
    ]
  });

  // 2. Content Studio Carousel (Section 2)
  setupCarousel('[data-content-carousel]', {
    titles: [
      '<strong>1. Opportunità</strong> · Topic selezionato dal Radar',
      '<strong>2. Content Studio</strong> · Bozza, claim e fonti verificate',
      '<strong>3. Post Pronto</strong> · Anteprima canale LinkedIn'
    ]
  });

  // 3. Evidence / Fatti & Voce Carousel
  setupCarousel('[data-evidence-carousel]', {
    titles: [
      '<strong>1. Fatti utilizzati</strong> · Report e debrief di progetto',
      '<strong>2. Fatti & Voce applicati</strong> · Bozza con fonti verificate e stile',
      '<strong>3. Voce aziendale</strong> · Tono, principi e linea editoriale'
    ]
  });
}
