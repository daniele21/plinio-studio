import { landingCopy as copy } from './content/landingCopy.js';

const app = document.querySelector('#app');

document.title = copy.meta.title;
document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description);

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const icon = (symbol) => {
  const className = symbol === '✓' ? 'yes' : symbol === '×' ? 'no' : 'partial';
  return `<span class="comparison-symbol ${className}" aria-label="${symbol}">${symbol}</span>`;
};

const sectionHeader = (eyebrow, title, intro = '') => `
  <div class="section-heading reveal">
    <span class="eyebrow">${escapeHtml(eyebrow)}</span>
    <h2>${escapeHtml(title)}</h2>
    ${intro ? `<p>${escapeHtml(intro)}</p>` : ''}
  </div>
`;

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Plinio home">
      <span class="brand-mark">P</span>
      <span>${escapeHtml(copy.nav.brand)}</span>
    </a>
    <nav class="nav-links" aria-label="Navigazione principale">
      ${copy.nav.links.map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join('')}
    </nav>
    <a class="button button-small" href="${copy.nav.cta.href}">${escapeHtml(copy.nav.cta.label)}</a>
  </header>

  <main id="top">
    <section class="hero section-shell">
      <div class="hero-copy reveal">
        <span class="eyebrow">${escapeHtml(copy.hero.eyebrow)}</span>
        <h1>${escapeHtml(copy.hero.title)}</h1>
        <p class="hero-subtitle">${escapeHtml(copy.hero.subtitle)}</p>
        <div class="hero-actions">
          <a class="button" href="${copy.hero.ctaPrimary.href}">${escapeHtml(copy.hero.ctaPrimary.label)}</a>
          <a class="text-link" href="${copy.hero.ctaSecondary.href}">${escapeHtml(copy.hero.ctaSecondary.label)} <span>↓</span></a>
        </div>
        <p class="microcopy">${escapeHtml(copy.hero.microcopy)}</p>
      </div>
      <div class="hero-visual reveal" aria-label="Flusso di valore Plinio">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="sun">P</div>
        ${copy.hero.outcomeLine.map((item, index) => `
          <div class="orbit-label orbit-label-${index + 1}">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <strong>${escapeHtml(item)}</strong>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="section section-muted" id="problema">
      <div class="section-shell">
        ${sectionHeader(copy.pain.eyebrow, copy.pain.title, copy.pain.intro)}
        <div class="persona-grid">
          ${copy.pain.personas.map((persona) => `
            <article class="card persona-card reveal">
              <span class="card-label">${escapeHtml(persona.role)}</span>
              <blockquote>${escapeHtml(persona.quote)}</blockquote>
              <div class="card-outcome">${escapeHtml(persona.outcome)}</div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="beneficio">
      <div class="section-shell">
        ${sectionHeader(copy.benefit.eyebrow, copy.benefit.title, copy.benefit.intro)}
        <div class="process-compare reveal">
          <div class="process-column process-before">
            <span class="process-label">${escapeHtml(copy.benefit.beforeTitle)}</span>
            <div class="process-chain">
              ${copy.benefit.before.map((step) => `<span>${escapeHtml(step)}</span>`).join('<i>→</i>')}
            </div>
          </div>
          <div class="process-divider">VS</div>
          <div class="process-column process-after">
            <span class="process-label">${escapeHtml(copy.benefit.afterTitle)}</span>
            <div class="process-chain compact">
              ${copy.benefit.after.map((step) => `<span>${escapeHtml(step)}</span>`).join('<i>→</i>')}
            </div>
          </div>
        </div>
        <p class="statement reveal">${escapeHtml(copy.benefit.result)}</p>
      </div>
    </section>

    <section class="section section-dark" id="universo">
      <div class="section-shell">
        ${sectionHeader(copy.universe.eyebrow, copy.universe.title, copy.universe.intro)}
        <div class="capability-grid">
          ${copy.universe.capabilities.map((item, index) => `
            <article class="capability-card reveal">
              <div class="planet-index">${String(index + 1).padStart(2, '0')}</div>
              <div>
                <span class="card-label">${escapeHtml(item.name)} · ${escapeHtml(item.planet)}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <div class="outcome-pill">${escapeHtml(item.outcome)}</div>
                ${item.status ? `<small>${escapeHtml(item.status)}</small>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="differenza">
      <div class="section-shell">
        ${sectionHeader(copy.difference.eyebrow, copy.difference.title, copy.difference.intro)}
        <div class="benefit-grid">
          ${copy.difference.benefits.map((item) => `
            <article class="benefit-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>
          `).join('')}
        </div>
        <p class="big-tagline reveal">${escapeHtml(copy.difference.tagline)}</p>
      </div>
    </section>

    <section class="section section-muted" id="come-funziona">
      <div class="section-shell">
        ${sectionHeader(copy.process.eyebrow, copy.process.title)}
        <div class="steps-grid">
          ${copy.process.steps.map((step) => `
            <article class="step-card reveal">
              <span class="step-number">${escapeHtml(step.number)}</span>
              <h3>${escapeHtml(step.title)}</h3>
              <p>${escapeHtml(step.description)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="confronto">
      <div class="section-shell">
        ${sectionHeader(copy.comparison.eyebrow, copy.comparison.title)}
        <div class="comparison-wrap reveal">
          <div class="comparison-scroll">
            <table>
              <thead>
                <tr>${copy.comparison.columns.map((column, index) => `<th class="${index === copy.comparison.columns.length - 1 ? 'plinio-column' : ''}">${escapeHtml(column)}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${copy.comparison.rows.map((row) => `
                  <tr>
                    ${row.map((cell, index) => `<td class="${index === row.length - 1 ? 'plinio-column' : ''}">${index === 0 ? escapeHtml(cell) : icon(cell)}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <p class="table-legend">${escapeHtml(copy.comparison.legend)}</p>
          <p class="table-note">${escapeHtml(copy.comparison.note)}</p>
        </div>
      </div>
    </section>

    <section class="section section-dark" id="obiezioni">
      <div class="section-shell objections-shell">
        ${sectionHeader(copy.objections.eyebrow, copy.objections.title)}
        <div class="accordion">
          ${copy.objections.items.map((item, index) => `
            <details class="objection reveal" ${index === 0 ? 'open' : ''}>
              <summary>
                <span>${escapeHtml(item.question)}</span>
                <span class="plus">+</span>
              </summary>
              <p>${escapeHtml(item.answer)}</p>
            </details>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section pilot" id="pilot">
      <div class="section-shell pilot-shell">
        <div class="pilot-copy reveal">
          <span class="eyebrow">${escapeHtml(copy.pilot.eyebrow)}</span>
          <h2>${escapeHtml(copy.pilot.title)}</h2>
          <p>${escapeHtml(copy.pilot.subtitle)}</p>
          <a class="button" href="${copy.pilot.cta.href}">${escapeHtml(copy.pilot.cta.label)}</a>
        </div>
        <div class="deliverables reveal">
          ${copy.pilot.deliverables.map((item) => `
            <div class="deliverable">
              <strong>${escapeHtml(item.value)}</strong>
              <div>
                <span>${escapeHtml(item.label)}</span>
                <small>${escapeHtml(item.description)}</small>
              </div>
            </div>
          `).join('')}
        </div>
        <p class="pilot-footnote reveal">${escapeHtml(copy.pilot.footnote)}</p>
      </div>
    </section>
  </main>

  <footer>
    <div class="section-shell footer-inner">
      <div>
        <a class="brand" href="#top"><span class="brand-mark">P</span><span>${escapeHtml(copy.footer.brand)}</span></a>
        <p>${escapeHtml(copy.footer.tagline)}</p>
      </div>
      <small>${escapeHtml(copy.footer.legal)}</small>
    </div>
  </footer>
`;

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);
revealElements.forEach((element) => observer.observe(element));
