/**
 * Plinio Web Application Entry Point
 * Handles dynamic template mounting, copy population, scroll reveals,
 * objection selector interactivity, and optional orbit visualization.
 */

import { landingCopy as copy } from './content/landingCopy.js';
import { siteConfig } from './content/siteConfig.js';
import { trackEvent, initAnalyticsFromConsent } from './services/analytics.js';
import { initCookieConsent, openCookiePreferences, openPrivacyPolicy } from './components/cookieConsent.js';
import { initImageModal } from './components/imageModal.js';
import { initAnimations } from './components/animations.js';
import { initMobileCarousels } from './components/mobileCarousel.js';

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
    
    // Editorial Micro-Blocks (Proof & Value)
    if (copy.hero.proofBlock) {
      setHtml(document.querySelector('[data-hero-proof-tag]'), copy.hero.proofBlock.tag);
      setHtml(document.querySelector('[data-hero-proof-stat]'), copy.hero.proofBlock.statHtml);
      const sourceEl = document.querySelector('[data-hero-proof-source]');
      if (sourceEl) {
        setText(sourceEl, copy.hero.proofBlock.source);
        if (copy.hero.proofBlock.sourceUrl) {
          sourceEl.setAttribute('href', copy.hero.proofBlock.sourceUrl);
        }
      }
    }

    if (copy.hero.valueBlock) {
      setHtml(document.querySelector('[data-hero-value-lead]'), copy.hero.valueBlock.lead);
      setHtml(document.querySelector('[data-hero-value-body]'), copy.hero.valueBlock.body);
    }

    // Backwards compatibility fallbacks if older subtitle/support format is used
    if (copy.hero.subtitle) setHtml(document.querySelector('[data-hero-subtitle]'), copy.hero.subtitle);
    if (copy.hero.support) setHtml(document.querySelector('[data-hero-support]'), copy.hero.support);

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
    const kickerEl = document.querySelector('.pl-personas-kicker') || document.querySelector('.pl-personas-heading .pl-hero-kicker');
    if (kickerEl && copy.personas.kicker) setText(kickerEl, copy.personas.kicker);
    const titleEl = document.querySelector('.pl-personas-heading h2') || document.querySelector('.pl-personas-grid')?.parentElement?.querySelector('h2');
    if (titleEl) setHtml(titleEl, copy.personas.title);
    const cards = document.querySelectorAll('.pl-persona-card');
    copy.personas.items?.forEach((item, i) => {
      const card = cards[i];
      if (!card) return;
      const roleEl = card.querySelector('.pl-persona-card__role-name') || card.querySelector('.pl-persona-card__role');
      if (roleEl) setText(roleEl, item.role);
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
      const sowhatEl = card.querySelector('.pl-evidence-sowhat');
      if (sowhatEl) {
        setHtml(sowhatEl, stat.sowhat || stat.implication || '');
      }
      const sourceEl = card.querySelector('.pl-evidence-source');
      if (sourceEl) {
        if (stat.url) {
          setHtml(sourceEl, `Fonte: <a href="${stat.url}" target="_blank" rel="noopener noreferrer" class="pl-source-link" data-analytics-event="source_link_click" data-analytics-location="evidence">${stat.source} ↗</a>`);
        } else {
          setText(sourceEl, `Fonte: ${stat.source}`);
        }
      }
    });
    const disclaimerEl = document.querySelector('.pl-evidence-disclaimer');
    if (disclaimerEl) {
      if (copy.evidence.disclaimer) {
        setHtml(disclaimerEl, copy.evidence.disclaimer);
      } else {
        disclaimerEl.remove();
      }
    }
  }

  // Universe / Capabilities Section
  if (copy.universe) {
    setHtml(document.querySelector('#universo h2'), copy.universe.title);
    setHtml(document.querySelector('#universo p:first-of-type'), copy.universe.intro);
    const rows = document.querySelectorAll('.pl-cap-row');
    copy.universe.rows?.forEach((r, i) => {
      const row = rows[i];
      if (!row) return;
      setHtml(row.querySelector('.pl-cap-title'), r.action || r.title);
      setHtml(row.querySelector('.pl-cap-badge'), r.feature);
      const outcomeText = row.querySelector('.pl-cap-outcome-text');
      if (outcomeText) {
        setHtml(outcomeText, r.outcome);
      }
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

  // Product Section Copy & Media
  if (copy.product) {
    const productCopy = document.querySelector('.pl-v5-product__copy');
    if (productCopy) {
      if (copy.product.title) setHtml(productCopy.querySelector('h3'), copy.product.title);
      if (copy.product.description) setHtml(productCopy.querySelector('p'), copy.product.description);
    }
  }

  // Content Studio Media Configuration (Pipeline synchronization)
  const contentShowcase = document.querySelector('.pl-content-pipeline-showcase') || document.querySelector('.pl-content-pipeline');
  if (contentShowcase) {
    const pipelineCols = contentShowcase.querySelectorAll('.pl-pipeline-col');
    if (pipelineCols.length > 0 && Array.isArray(siteConfig.productMedia?.pipeline)) {
      pipelineCols.forEach((col, idx) => {
        const item = siteConfig.productMedia.pipeline[idx];
        if (!item) return;
        const img = col.querySelector('.pl-pipeline-img');
        if (img && item.src) img.src = item.src;
        if (img && item.alt) img.alt = item.alt;
        const titleEl = col.querySelector('.pl-pipeline-col-title');
        if (titleEl && item.title) titleEl.textContent = item.title;
      });
    }
  }

  if (siteConfig.productMedia?.src) {
    const productImg = document.querySelector('.pl-v5-product__shot img');
    if (productImg) {
      productImg.src = siteConfig.productMedia.src;
      if (siteConfig.productMedia.alt) {
        productImg.alt = siteConfig.productMedia.alt;
      }
    }
  }

  // Fatti & Voce Section Copy & Media
  if (copy.fattiVoce) {
    const fattiSection = document.querySelector('#fatti-voce');
    if (fattiSection) {
      if (copy.fattiVoce.kicker) setHtml(fattiSection.querySelector('[data-fatti-voce-kicker]'), copy.fattiVoce.kicker);
      if (copy.fattiVoce.title) setHtml(fattiSection.querySelector('[data-fatti-voce-title]'), copy.fattiVoce.title);
      if (copy.fattiVoce.subtitle) setHtml(fattiSection.querySelector('[data-fatti-voce-subtitle]'), copy.fattiVoce.subtitle);
      if (copy.fattiVoce.cardTitle) setHtml(fattiSection.querySelector('[data-fatti-voce-card-title]'), copy.fattiVoce.cardTitle);
      if (copy.fattiVoce.cardTag) setText(fattiSection.querySelector('[data-fatti-voce-card-tag]'), copy.fattiVoce.cardTag);
    }
  }

  // Fatti & Voce Media Configuration (Pipeline synchronization)
  const evidenceShowcase = document.querySelector('.pl-evidence-pipeline-showcase') || document.querySelector('.pl-evidence-pipeline');
  if (evidenceShowcase) {
    const pipelineCols = evidenceShowcase.querySelectorAll('.pl-pipeline-col');
    if (pipelineCols.length > 0 && Array.isArray(siteConfig.fattiVoceMedia?.pipeline)) {
      pipelineCols.forEach((col, idx) => {
        const item = siteConfig.fattiVoceMedia.pipeline[idx];
        if (!item) return;
        const img = col.querySelector('.pl-pipeline-img');
        if (img && item.src) img.src = item.src;
        if (img && item.alt) img.alt = item.alt;
        const titleEl = col.querySelector('.pl-pipeline-col-title');
        if (titleEl && item.title) titleEl.textContent = item.title;
      });
    }
  }

  if (siteConfig.fattiVoceMedia?.src) {
    const fattiImg = document.querySelector('[data-fatti-voce-img]');
    if (fattiImg) {
      fattiImg.src = siteConfig.fattiVoceMedia.src;
      if (siteConfig.fattiVoceMedia.alt) {
        fattiImg.alt = siteConfig.fattiVoceMedia.alt;
      }
    }
  }

  // Comparison Section
  if (copy.comparison) {
    const compHeading =
      document.querySelector('.pl-v5-compare-heading') ||
      document.querySelector('#pl-compare-minimal') ||
      document.querySelector('#confronto');

    if (compHeading) {
      setHtml(compHeading.querySelector('h2'), copy.comparison.title);
      setHtml(compHeading.querySelector('p'), copy.comparison.intro);
    }

    const featureHeaders =
      document.querySelectorAll('.pl-compare-table tbody th, .pl-v5-compare-table tbody th');

    copy.comparison.featureRows?.forEach((label, i) => {
      const th = featureHeaders[i];
      if (th) setHtml(th, label);
    });

    setHtml(
      document.querySelector('[data-compare-takeaway]'),
      copy.comparison.takeaway
    );
  }

  // Awareness Section (Perché conta / Proof)
  if (copy.awareness) {
    const awarenessSection = document.querySelector('#perche-conta');
    if (awarenessSection) {
      if (copy.awareness.title) setHtml(awarenessSection.querySelector('h2'), copy.awareness.title);
      if (copy.awareness.intro) setHtml(awarenessSection.querySelector('.pl-v5-proof__bridge'), copy.awareness.intro);
    }
  }

  // Objections Section
  if (copy.objections) {
    const section = document.querySelector('.pl-objections');

    setHtml(
      section?.querySelector('h2'),
      copy.objections.title
    );

    const intro = section?.querySelector('.pl-objections__intro p');

    if (intro) {
      if (copy.objections.intro) {
        setHtml(intro, copy.objections.intro);
      } else {
        intro.remove();
      }
    }

    section
      ?.querySelectorAll('[data-concern]')
      .forEach(btn => {
        const item =
          copy.objections.items?.[btn.dataset.concern];

        if (item) {
          setText(btn, item.label);
        }
      });
  }

  // Pilot Section
  if (copy.pilot) {
    const section = document.querySelector('#prenota');

    setText(
      section?.querySelector('[data-pilot-eyebrow]'),
      copy.pilot.eyebrow
    );

    setHtml(
      section?.querySelector('[data-pilot-title]'),
      copy.pilot.titleHtml
    );

    setHtml(
      section?.querySelector('[data-pilot-subtitle]'),
      copy.pilot.subtitle
    );

    const pilotCta = section?.querySelector('[data-pilot-cta]');
    if (pilotCta) {
      const ctaTextEl = pilotCta.querySelector('span:first-child');
      if (ctaTextEl) {
        setText(ctaTextEl, copy.pilot.cta);
      } else {
        setText(pilotCta, copy.pilot.cta);
      }

      if (siteConfig.conversion?.pilotUrl) {
        pilotCta.href = siteConfig.conversion.pilotUrl;
      }
    }

    setText(
      section?.querySelector('[data-pilot-microcopy]'),
      copy.pilot.microcopy
    );

    setText(
      section?.querySelector('[data-pilot-deliverables-title]'),
      copy.pilot.deliverablesTitle
    );

    const deliverableEls =
      section?.querySelectorAll('.pl-pilot-deliverable-item');

    copy.pilot.deliverables?.forEach((item, i) => {
      const el = deliverableEls?.[i];
      if (!el) return;

      setHtml(
        el.querySelector('.pl-pilot-deliverable-title'),
        item.title
      );

      setHtml(
        el.querySelector('.pl-pilot-deliverable-detail'),
        item.detail
      );
    });

    setHtml(
      section?.querySelector('[data-pilot-footnote]'),
      copy.pilot.footnote
    );
  }

  // Footer Info
  if (siteConfig.company) {
    setText(document.querySelector('[data-footer-company]'), siteConfig.company.legalName);
    const vatEl = document.querySelector('[data-footer-vat]');
    const vatWrap = document.querySelector('[data-footer-vat-wrap]');
    if (vatEl && siteConfig.company.vatNumber) {
      setText(vatEl, siteConfig.company.vatNumber);
      if (vatWrap) vatWrap.style.display = 'inline';
    } else if (vatWrap) {
      vatWrap.style.display = 'none';
    }
    const emailEl = document.querySelector('[data-footer-email]');
    if (emailEl && siteConfig.company.contactEmail) {
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

  // Handle Single or Dual Column Showcase synchronization
  const heroShowcase = document.querySelector('.pl-hero-showcase');
  if (heroShowcase) {
    const primaryCard = heroShowcase.querySelector('.pl-dual-card--main') || heroShowcase.querySelector('.pl-dual-column--primary') || heroShowcase.querySelector('.pl-dual-card');
    const secondaryCard = heroShowcase.querySelector('.pl-dual-column--secondary');

    // Pipeline showcase synchronization
    const pipelineCols = heroShowcase.querySelectorAll('.pl-pipeline-col');
    if (pipelineCols.length > 0 && Array.isArray(siteConfig.heroMedia?.pipeline)) {
      pipelineCols.forEach((col, idx) => {
        const item = siteConfig.heroMedia.pipeline[idx];
        if (!item) return;
        const img = col.querySelector('.pl-pipeline-img');
        if (img && item.src) img.src = item.src;
        const titleEl = col.querySelector('.pl-pipeline-col-title');
        if (titleEl && item.title) titleEl.textContent = item.title;
      });
    }

    if (primaryCard && siteConfig.heroMedia?.primary) {
      const img = primaryCard.querySelector('.pl-dual-img');
      if (img && siteConfig.heroMedia.primary.src) img.src = siteConfig.heroMedia.primary.src;
      if (img && siteConfig.heroMedia.primary.alt) img.alt = siteConfig.heroMedia.primary.alt;
      const tag = primaryCard.querySelector('.pl-dual-tag');
      if (tag && siteConfig.heroMedia.primary.tag) tag.textContent = siteConfig.heroMedia.primary.tag;
    }

    if (secondaryCard && siteConfig.heroMedia?.secondary) {
      const img = secondaryCard.querySelector('.pl-dual-img');
      if (img && siteConfig.heroMedia.secondary.src) img.src = siteConfig.heroMedia.secondary.src;
      if (img && siteConfig.heroMedia.secondary.alt) img.alt = siteConfig.heroMedia.secondary.alt;
      const tag = secondaryCard.querySelector('.pl-dual-tag');
      if (tag && siteConfig.heroMedia.secondary.tag) tag.textContent = siteConfig.heroMedia.secondary.tag;
    }
  }

  // Handle Carousel Showcase
  if (carouselTrack) {
    const slidesData = siteConfig.heroMedia?.carousel?.slides || [
      {
        url: 'app.plinio.ai/studio',
        badgeText: 'Radar opportunità · Fatti e scelte da raccontare'
      },
      {
        url: 'app.plinio.ai/knowledge-graph',
        badgeText: 'Fonti collegate · Ogni opportunità ancorata ai file reali'
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

      // Track carousel slide view event
      trackEvent('hero_carousel_slide_view', {
        slide_index: currentIndex,
        slide_id: currentSlideData?.id || `slide_${currentIndex}`,
        slide_url: currentSlideData?.url || ''
      });
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

  if (!wrap || !panel) return;

  const buttons = [
    ...wrap.querySelectorAll('[data-concern]')
  ];

  const items = copy.objections?.items || {};

  let activeKey = buttons[0]?.dataset.concern;

  const render = key => {
    const item = items[key];
    if (!item) return;

    activeKey = key;

    buttons.forEach(btn => {
      const isActive =
        btn.dataset.concern === activeKey;

      btn.setAttribute(
        'aria-pressed',
        String(isActive)
      );
    });

    panel.innerHTML = `
      <div class="pl-objection-answer">

        <div class="pl-objection-answer__marker"
             aria-hidden="true">
          →
        </div>

        <div class="pl-objection-answer__content">

          <h3 class="pl-objection-answer__title">
            ${item.answerTitle}
          </h3>

          <p class="pl-objection-answer__text">
            ${item.answer}
          </p>

          ${
            item.proof
              ? `
                <div class="pl-objection-answer__proof">
                  <span aria-hidden="true">✓</span>
                  ${item.proof}
                </div>
              `
              : ''
          }

        </div>
      </div>
    `;
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.concern;
      render(key);
      const item = items[key];
      trackEvent('objection_selected', {
        concern_id: key,
        concern_label: item?.label || key
      });
    });
  });

  if (activeKey) {
    render(activeKey);
  }
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
 * Global Semantic Analytics Event Tracking & Funnel Monitoring
 */
function wireAnalytics() {
  // Global click delegate for elements with data-analytics-event
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-analytics-event]');
    if (!target) return;

    const eventName = target.dataset.analyticsEvent;
    const location = target.dataset.analyticsLocation || 'unknown';
    const text = target.textContent?.trim().slice(0, 100) || '';
    const href = target.getAttribute('href') || '';

    trackEvent(eventName, {
      location,
      text,
      href
    });
  });

  // Track Pilot section impression (Funnel: arrival -> pilot section view -> pilot conversion)
  const pilotSection = document.querySelector('#prenota');
  if (pilotSection && 'IntersectionObserver' in window) {
    let hasTrackedView = false;
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView) {
            hasTrackedView = true;
            trackEvent('pilot_section_view', {
              location: 'pilot_section'
            });
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    sectionObserver.observe(pilotSection);
  }
}

/**
 * Wire Footer Privacy & Preferences Actions
 */
function wireFooter() {
  const footer = document.querySelector('.pl-footer');
  if (!footer) return;

  footer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-footer-action]');
    if (!btn) return;
    const action = btn.dataset.footerAction;

    if (action === 'policy') {
      openPrivacyPolicy();
    } else if (action === 'preferences') {
      openCookiePreferences();
    }
  });
}

/**
 * Application Bootstrap
 */
async function init() {
  await mountOriginalLayout();
  applyCopy();
  wireHeroMedia();
  initAnimations();
  wireHeaderAndProgress();
  wireConcerns();
  wireOrbit();
  wireFooter();
  wireAnalytics();

  // Initialize Basic Consent Mode Analytics, Cookie UI, and Mobile Carousels
  initAnalyticsFromConsent();
  initCookieConsent();
  initMobileCarousels();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init().catch(console.error), { once: true });
} else {
  init().catch(console.error);
}
