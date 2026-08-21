/**
 * Radar Mobile Carousel Controller
 * Handles touch gestures, click-to-next slide loop, button navigation, and dot updates.
 */

export function initRadarCarousel() {
  const carouselEl = document.querySelector('[data-radar-carousel]');
  if (!carouselEl) return;

  const viewport = carouselEl.querySelector('[data-radar-viewport]');
  const track = carouselEl.querySelector('[data-radar-track]');
  const prevBtn = carouselEl.querySelector('[data-radar-prev]');
  const nextBtn = carouselEl.querySelector('[data-radar-next]');
  const dots = carouselEl.querySelectorAll('[data-dot]');
  const titleEl = carouselEl.querySelector('[data-radar-slide-title]');
  const badgeEl = carouselEl.querySelector('[data-radar-slide-badge]');

  if (!viewport || !track) return;

  const slides = track.querySelectorAll('.pl-radar-carousel-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  const slideTitles = [
    '<strong>1. Documenti</strong> · Materiali caricati',
    '<strong>2. Radar</strong> · Opportunità individuate',
    '<strong>3. Dettaglio</strong> · Topic, motivazione e fonti'
  ];

  let currentIndex = 0;

  const goToSlide = (index) => {
    // Loop around
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
    dots.forEach((dot, i) => {
      const isActive = i === idx;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (titleEl && slideTitles[idx]) {
      titleEl.innerHTML = slideTitles[idx];
    }
    if (badgeEl) {
      badgeEl.textContent = `${idx + 1} di ${totalSlides}`;
    }
  };

  // Button navigation
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentIndex + 1);
  });

  // Dots navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-dot'), 10);
      if (!isNaN(idx)) goToSlide(idx);
    });
  });

  // Tap/click on slide to loop to next slide
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

  slides.forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (isDragging) return;
      e.stopPropagation();
      goToSlide(currentIndex + 1);
    });
  });

  // Sync state on manual swipe/scroll
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

  // Initial render state
  updateUI(0);
}
