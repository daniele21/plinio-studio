/**
 * Plinio Web Application Entry Point
 * Handles dynamic template mounting, copy population, scroll reveals,
 * objection selector interactivity, and optional orbit visualization.
 */

import { landingCopy as copy } from './content/landingCopy.js';
import { siteConfig } from './content/siteConfig.js';

const fragmentPaths = [
  './fragments/progress.html',
  './fragments/header.html',
  './fragments/section-1.html',
  './fragments/section-2.html',
  './fragments/section-evidence.html',
  './fragments/section-3.html',
  './fragments/section-4.html',
  './fragments/section-5.html',
  './fragments/section-6.html',
  './fragments/section-7.html',
  './fragments/footer.html',
];

/**
 * Fetch and mount HTML template fragments into #app
 */
async function mountOriginalLayout() {
  const parts = await Promise.all(
    fragmentPaths.map(async path => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Impossibile caricare ${path}`);
      return response.text();
    })
  );

  const [progress, header, ...rest] = parts;
  const footer = rest.pop();
  const appContainer = document.querySelector('#app');
  if (appContainer) {
    appContainer.innerHTML = `${progress}${header}<main id="top">${rest.join('')}</main>${footer}`;
  }
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setText = (el, value) => { if (el && value != null) el.textContent = value; };
const setHtml = (el, value) => { if (el && value != null) el.innerHTML = value; };

/**
 * Populate copy and dynamic content from landingCopy & siteConfig
 */
function applyCopy() {
  if (copy.meta) {
    document.title = copy.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description);
  }

  // Header
  const header = document.querySelector('[data-head]');
  if (header && copy.header) {
    setText(header.querySelector('.pl-header__tagline'), copy.header.tagline);
    setText(header.querySelector('.pl-header .pl-btn--primary'), copy.header.cta);
  }

  // Hero Section
  if (copy.hero) {
    setHtml(document.querySelector('[data-hero-title]'), copy.hero.titleHtml);
    setHtml(document.querySelector('[data-hero-subtitle]'), copy.hero.subtitle);
    setHtml(document.querySelector('[data-hero-support]'), copy.hero.support);

    const primaryCta = document.querySelector('[data-hero-primary-cta] span:first-child');
    if (primaryCta) setText(primaryCta, copy.hero.primaryCta);
    setText(document.querySelector('[data-hero-secondary-cta]'), copy.hero.secondaryCta);

    const proofContainer = document.querySelector('[data-hero-proof]');
    if (proofContainer && Array.isArray(copy.hero.proof)) {
      const proofItems = proofContainer.querySelectorAll('.pl-hero__proof-item');
      copy.hero.proof.forEach((text, i) => {
        if (proofItems[i]) setText(proofItems[i], text);
      });
    }
  }

  // Personas Section
  if (copy.personas) {
    setHtml(document.querySelector('.pl-personas-grid')?.parentElement?.querySelector('h2'), copy.personas.title);
    const cards = document.querySelectorAll('.pl-persona-card');
    copy.personas.items?.forEach((item, i) => {
      const card = cards[i];
      if (!card) return;
      setText(card.querySelector('.pl-persona-card__role'), item.role);
      setText(card.querySelector('.pl-persona-card__quote'), item.quote);
      setHtml(card.querySelector('.pl-persona-card__outcome-text'), item.outcome);
    });
  }

  // Evidence Section
  if (copy.evidence) {
    setHtml(document.querySelector('#evidenze h2'), copy.evidence.title);
    setHtml(document.querySelector('#evidenze p:first-of-type'), copy.evidence.intro);
    const cards = document.querySelectorAll('.pl-evidence-card');
    copy.evidence.stats?.forEach((stat, i) => {
      const card = cards[i];
      if (!card) return;
      setText(card.querySelector('.pl-evidence-stat'), stat.value);
      setHtml(card.querySelector('.pl-evidence-claim'), stat.claim);
      setHtml(card.querySelector('.pl-evidence-implication p'), stat.implication);
      const sourceEl = card.querySelector('.pl-evidence-source');
      if (sourceEl) {
        if (stat.url) {
          setHtml(sourceEl, `Fonte: <a href="${stat.url}" target="_blank" rel="noopener noreferrer" class="pl-source-link">${stat.source} ↗</a>`);
        } else {
          setText(sourceEl, `Fonte: ${stat.source}`);
        }
      }
    });
    setHtml(document.querySelector('.pl-evidence-disclaimer'), copy.evidence.disclaimer);
  }

  // Universe / Capabilities Section
  if (copy.universe) {
    setHtml(document.querySelector('#universo h2'), copy.universe.title);
    setHtml(document.querySelector('#universo p:first-of-type'), copy.universe.intro);
    const rows = document.querySelectorAll('.pl-cap-row');
    copy.universe.rows?.forEach((r, i) => {
      const row = rows[i];
      if (!row) return;
      setHtml(row.querySelector('.pl-cap-action'), r.action);
      setHtml(row.querySelector('.pl-cap-benefit'), r.outcome);
    });
  }

  // Process Flow Section
  if (copy.process) {
    const processSteps = document.querySelectorAll('.pl-step-card');
    copy.process.steps?.forEach((step, i) => {
      const card = processSteps[i];
      if (!card) return;
      setHtml(card.querySelector('.pl-step-card__title'), step[0]);
      setHtml(card.querySelector('.pl-step-card__desc'), step[1]);
    });
  }

  // Comparison Section
  if (copy.comparison) {
    setHtml(document.querySelector('#pl-compare-minimal h2'), copy.comparison.title);
    setHtml(document.querySelector('#pl-compare-minimal p:first-of-type'), copy.comparison.intro);
    const featureHeaders = document.querySelectorAll('.pl-compare-table tbody th');
    copy.comparison.featureRows?.forEach((row, i) => {
      const th = featureHeaders[i];
      if (!th) return;
      const small = th.querySelector('small');
      const textNode = [...th.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (textNode) textNode.nodeValue = row[0];
      setHtml(small, row[1]);
    });
  }

  // Objections Section
  if (copy.objections) {
    setHtml(document.querySelector('.pl-concerns-container')?.parentElement?.querySelector('h2'), copy.objections.title);
    setHtml(document.querySelector('.pl-concerns-container')?.parentElement?.querySelector('p:first-of-type'), copy.objections.intro);
  }

  // Pilot Section
  if (copy.pilot) {
    setHtml(document.querySelector('#prenota h2'), copy.pilot.titleHtml);
    setHtml(document.querySelector('#prenota p:first-of-type'), copy.pilot.subtitle);
    const deliverables = document.querySelectorAll('.pl-pilot-deliverable-text');
    copy.pilot.deliverables?.forEach((text, i) => {
      if (deliverables[i]) setHtml(deliverables[i], text);
    });
  }

  // Footer Info
  if (siteConfig.company) {
    setText(document.querySelector('[data-footer-company]'), siteConfig.company.legalName);
    setText(document.querySelector('[data-footer-vat]'), siteConfig.company.vatNumber);
    const emailEl = document.querySelector('[data-footer-email]');
    if (emailEl) {
      setText(emailEl, siteConfig.company.contactEmail);
      emailEl.setAttribute('href', `mailto:${siteConfig.company.contactEmail}`);
    }
  }
}

/**
 * Configure Hero Media (Carousel with Auto-Scroll vs Single Screenshot vs Video Player)
 */
function wireHeroMedia() {
  const mockupFrame = document.querySelector('[data-mockup-frame]');
  const videoPlayer = document.querySelector('[data-video-player]');
  const carouselContainer = document.querySelector('[data-carousel-container]');
  const carouselTrack = document.querySelector('[data-carousel-track]');
  const dotsContainer = document.querySelector('[data-carousel-dots]');
  const urlEl = document.querySelector('[data-carousel-url]');
  const badgeTextEl = document.querySelector('[data-carousel-badge-text]');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');

  if (siteConfig.heroMedia?.type === 'video' && videoPlayer) {
    if (mockupFrame) mockupFrame.parentElement.style.display = 'none';
    videoPlayer.style.display = 'flex';

    const overlay = videoPlayer.querySelector('[data-video-trigger]');
    const videoEl = videoPlayer.querySelector('[data-video-element]');

    if (overlay && videoEl && siteConfig.heroMedia.video?.src) {
      overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        videoEl.style.display = 'block';
        videoEl.src = siteConfig.heroMedia.video.src;
        videoEl.play().catch(console.warn);
      });
    }
    return;
  }

  // Handle Carousel Showcase
  if (carouselTrack) {
    const slidesData = siteConfig.heroMedia?.carousel?.slides || [
      {
        url: 'app.plinio.ai/studio',
        badgeText: 'Radar opportunità editoriali · Proposte radicate in fonti'
      },
      {
        url: 'app.plinio.ai/knowledge-graph',
        badgeText: 'Grafo di conoscenza · Connessione tra fonti e progetti'
      }
    ];

    const slideElements = carouselTrack.querySelectorAll('.pl-carousel-slide');
    const totalSlides = slideElements.length;
    if (totalSlides === 0) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    const intervalMs = siteConfig.heroMedia?.carousel?.interval || 4500;
    const isAutoPlay = siteConfig.heroMedia?.carousel?.autoPlay !== false && !reduceMotion;

    // Render dot indicators if missing or sync them
    const dots = dotsContainer ? [...dotsContainer.querySelectorAll('.pl-carousel-dot')] : [];

    const updateSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      
      // Move track
      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('pl-carousel-dot--active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('pl-carousel-dot--active');
          dot.removeAttribute('aria-current');
        }
      });

      // Update URL in browser mockup bar
      const currentSlideData = slidesData[currentIndex];
      if (urlEl && currentSlideData?.url) {
        urlEl.textContent = currentSlideData.url;
      }

      // Update floating badge text
      if (badgeTextEl && currentSlideData?.badgeText) {
        badgeTextEl.style.opacity = '0';
        setTimeout(() => {
          badgeTextEl.textContent = currentSlideData.badgeText;
          badgeTextEl.style.opacity = '1';
        }, 150);
      }
    };

    const nextSlide = () => updateSlide(currentIndex + 1);
    const prevSlide = () => updateSlide(currentIndex - 1);

    // Auto-play management
    const startAutoPlay = () => {
      if (!isAutoPlay || autoPlayTimer) return;
      autoPlayTimer = setInterval(nextSlide, intervalMs);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    // Event Listeners for controls
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    // Dot indicators clicks
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlide(idx);
        stopAutoPlay();
        startAutoPlay();
      });
    });

    // Pause on hover / focus
    if (mockupFrame) {
      mockupFrame.addEventListener('mouseenter', stopAutoPlay);
      mockupFrame.addEventListener('mouseleave', startAutoPlay);
      mockupFrame.addEventListener('focusin', stopAutoPlay);
      mockupFrame.addEventListener('focusout', startAutoPlay);

      // Keyboard navigation (Left/Right arrows)
      mockupFrame.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          nextSlide();
          stopAutoPlay();
          startAutoPlay();
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
          stopAutoPlay();
          startAutoPlay();
        }
      });
    }

    // Touch swipe gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselContainer) {
      carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoPlay();
      }, { passive: true });
    }

    // Initial state and start timer
    updateSlide(0);
    startAutoPlay();
  }
}

/**
 * Progressive Scroll Reveals via IntersectionObserver
 */
function wireReveals() {
  const revs = [...document.querySelectorAll('[data-rev]')];
  const show = el => {
    const delay = parseFloat(el.dataset.delay || 0) || 0;
    el.style.transition = `opacity 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  };

  if (reduceMotion) {
    revs.forEach(show);
    return;
  }

  // Initialize hidden state
  revs.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revs.forEach(el => observer.observe(el));
}

/**
 * Top Progress Bar and Sticky Header Scroll Shadow
 */
function wireHeaderAndProgress() {
  const bar = document.querySelector('[data-progress]');
  const head = document.querySelector('[data-head]');

  const onScroll = () => {
    // Update progress bar
    if (bar) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(1, window.scrollY / scrollHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    }

    // Update header glass elevation on scroll
    if (head) {
      if (window.scrollY > 20) {
        head.classList.add('pl-header--scrolled');
      } else {
        head.classList.remove('pl-header--scrolled');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Interactive Objection Chips (Section 6)
 */
function wireConcerns() {
  const wrap = document.querySelector('[data-concerns]');
  const panel = document.querySelector('[data-answers]');
  const empty = document.querySelector('[data-answers-empty]');
  const count = document.querySelector('[data-concern-count]');
  if (!wrap || !panel) return;

  const answers = Object.fromEntries(
    Object.entries(copy.objections?.items || {}).map(([key, item]) => [key, [item.answerTitle, item.answer]])
  );
  const selected = new Set();

  const render = () => {
    const keys = [...selected];
    if (empty) empty.style.display = keys.length ? 'none' : 'block';

    panel.querySelectorAll('.pl-answer-item').forEach(el => {
      if (!selected.has(el.dataset.answer)) el.remove();
    });

    keys.forEach((key, i) => {
      if (panel.querySelector(`[data-answer="${key}"]`)) return;
      const answer = answers[key];
      if (!answer) return;

      const row = document.createElement('div');
      row.className = 'pl-answer-item';
      row.dataset.answer = key;

      const title = document.createElement('div');
      title.className = 'pl-answer-item__title';
      title.textContent = answer[0];

      const text = document.createElement('p');
      text.className = 'pl-answer-item__text';
      setHtml(text, answer[1]);

      row.append(title, text);
      panel.append(row);
    });

    if (count) {
      count.textContent = keys.length
        ? `${keys.length} ${keys.length === 1 ? 'punto selezionato' : 'punti selezionati'} da portare in call`
        : 'Nessun punto selezionato';
    }
  };

  wrap.querySelectorAll('[data-concern]').forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      const key = btn.dataset.concern;
      const isActive = !selected.has(key);

      if (isActive) {
        selected.add(key);
      } else {
        selected.delete(key);
      }

      btn.setAttribute('aria-pressed', String(isActive));
      render();
    });
  });
}

/**
 * Optional Orbit Metaphor Wiring (conditionally enabled via siteConfig.showOrbit)
 */
function wireOrbit() {
  const orbitContainer = document.querySelector('[data-orbit-container]');
  if (!orbitContainer) return;

  if (!siteConfig.showOrbit) {
    orbitContainer.style.display = 'none';
    return;
  }

  orbitContainer.style.display = 'flex';

  const copyOrbit = copy.hero?.orbit || {};
  const shell = orbitContainer.querySelector('[data-orbit-shell]');
  const popover = orbitContainer.querySelector('[data-orbit-popover]');
  const label = orbitContainer.querySelector('[data-orbit-popover-label]');
  const metaphor = orbitContainer.querySelector('[data-orbit-popover-metaphor]');
  const text = orbitContainer.querySelector('[data-orbit-popover-text]');

  if (!shell || !popover) return;

  const planets = [...shell.querySelectorAll('[data-planet]')];
  const layers = [...new Set(planets.filter(p => p.dataset.planet !== 'brain').map(p => p.parentElement?.parentElement).filter(Boolean))];

  const pause = state => {
    layers.forEach(l => { if (l) l.style.animationPlayState = state; });
  };

  planets.forEach(planet => {
    planet.addEventListener('mouseenter', () => {
      const item = copyOrbit[planet.dataset.planet];
      if (!item) return;
      if (label) setText(label, item[0]);
      if (metaphor) setText(metaphor, item[1]);
      if (text) setText(text, item[2]);
      pause('paused');
      popover.style.display = 'block';
    });

    planet.addEventListener('mouseleave', () => {
      popover.style.display = 'none';
      pause('running');
    });
  });
}

/**
 * Application Bootstrap
 */
async function init() {
  await mountOriginalLayout();
  applyCopy();
  wireHeroMedia();
  wireReveals();
  wireHeaderAndProgress();
  wireConcerns();
  wireOrbit();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init().catch(console.error), { once: true });
} else {
  init().catch(console.error);
}
