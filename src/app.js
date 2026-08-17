import { landingCopy as copy } from './content/landingCopy.js';

const fragmentPaths = [
  './fragments/progress.html',
  './fragments/header.html',
  './fragments/section-1.html',
  './fragments/section-2.html',
  './fragments/section-3.html',
  './fragments/section-4.html',
  './fragments/section-5.html',
  './fragments/section-6.html',
  './fragments/section-7.html',
  './fragments/footer.html',
];

async function mountOriginalLayout() {
  const parts = await Promise.all(fragmentPaths.map(async path => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Impossibile caricare ${path}`);
    return response.text();
  }));
  const [progress, header, ...rest] = parts;
  const footer = rest.pop();
  document.querySelector('#app').innerHTML = `${progress}${header}<main id="top">${rest.join('')}</main>${footer}`;
}

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const timers = [];

const setText = (el, value) => { if (el && value != null) el.textContent = value; };
const setHtml = (el, value) => { if (el && value != null) el.innerHTML = value; };

function applyCopy() {
  document.title = copy.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description);

  const header = document.querySelector('header[data-head]');
  if (header) {
    const brandLines = header.querySelectorAll('a[aria-label] div span');
    setText(brandLines[1], copy.header.tagline);
    const cta = header.querySelector('a[href="#prenota"]');
    setText(cta, copy.header.cta);
  }

  const sections = [...document.querySelectorAll('main > section')];
  const [hero, personas, universe, process, comparison, objections, pilot] = sections;

  if (hero) {
    const left = hero.querySelector('div[style*="flex:1 1 440px"]');
    if (left) {
      const directDivs = left.querySelectorAll(':scope > div');
      setText(directDivs[0], copy.hero.eyebrow);
      setHtml(left.querySelector('h1'), copy.hero.titleHtml);
      const ps = left.querySelectorAll(':scope > p');
      setText(ps[0], copy.hero.subtitle);
      setText(ps[1], copy.hero.support);
      const links = left.querySelectorAll('a');
      if (links[0]) links[0].childNodes[0].nodeValue = `${copy.hero.primaryCta} `;
      if (links[1]) setText(links[1], copy.hero.secondaryCta);
      const proof = left.querySelectorAll(':scope > div:last-child > span');
      copy.hero.proof.forEach((value, i) => setText(proof[i], value));
    }
    setText(hero.querySelector('.pl-ecosystem-title'), copy.hero.ecosystemTitle);
    setText(hero.querySelector('.pl-ecosystem-intro'), copy.hero.ecosystemIntro);
  }

  if (personas) {
    const head = personas.querySelector('div[data-rev]');
    if (head) {
      setText(head.querySelector('div'), copy.personas.eyebrow);
      setText(head.querySelector('h2'), copy.personas.title);
    }
    const rows = [...personas.querySelectorAll('[data-delay]')].slice(0, 3);
    rows.forEach((row, i) => {
      const ps = row.querySelectorAll('p');
      setText(ps[0], copy.personas.items[i]?.quote);
      setText(ps[1], copy.personas.items[i]?.outcome);
    });
  }

  if (universe) {
    const head = universe.querySelector('div[data-rev]');
    if (head) {
      setText(head.children[0], copy.universe.eyebrow);
      setText(head.querySelector('h2'), copy.universe.title);
      setText(head.querySelector('p'), copy.universe.intro);
      setText(head.children[3], copy.universe.tagline);
    }
    const rows = [...universe.querySelectorAll('div[data-delay]')].slice(0, 6);
    rows.forEach((row, i) => {
      const ps = row.querySelectorAll('p');
      setText(ps[0], copy.universe.rows[i]?.action);
      setText(ps[1], copy.universe.rows[i]?.outcome);
    });
    const status = [...universe.querySelectorAll('p')].find(p => p.textContent.includes('AI Radar, Content Studio'));
    setText(status, copy.universe.status);
  }

  if (process) {
    const head = process.querySelector('div[data-rev]');
    if (head) {
      setText(head.querySelector('div'), copy.process.eyebrow);
      setText(head.querySelector('h2'), copy.process.title);
    }
    const cards = [...process.querySelectorAll('h3')].map(h => h.parentElement).slice(0, 4);
    cards.forEach((card, i) => {
      setText(card.querySelector('h3'), copy.process.steps[i]?.[0]);
      setText(card.querySelector('p'), copy.process.steps[i]?.[1]);
    });
  }

  if (comparison) {
    const head = comparison.querySelector('div[data-rev]');
    if (head) {
      setText(head.querySelector('div'), copy.comparison.eyebrow);
      setText(head.querySelector('h2'), copy.comparison.title);
      setText(head.querySelector('p'), copy.comparison.intro);
    }
    const featureHeaders = comparison.querySelectorAll('th.pl-feature-col');
    copy.comparison.featureRows.forEach((row, i) => {
      const th = featureHeaders[i];
      if (!th) return;
      const small = th.querySelector('small');
      const textNode = [...th.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (textNode) textNode.nodeValue = row[0];
      setText(small, row[1]);
    });
    setText(comparison.querySelector('.pl-compare-diff strong'), copy.comparison.diffTitle);
    setText(comparison.querySelector('.pl-compare-diff p'), copy.comparison.diffText);
    const notes = [...comparison.querySelectorAll('p[data-rev]')];
    setText(notes.at(-1), copy.comparison.note);
  }

  if (objections) {
    const head = objections.querySelector('div[data-rev]');
    if (head) {
      setText(head.querySelector('div'), copy.objections.eyebrow);
      setText(head.querySelector('h2'), copy.objections.title);
      setText(head.querySelector('p'), copy.objections.intro);
    }
  }

  if (pilot) {
    const columns = pilot.querySelectorAll('div[data-rev]');
    const left = columns[0];
    const right = columns[1];
    if (left) {
      setHtml(left.querySelector('h2'), copy.pilot.titleHtml);
      setText(left.querySelector('p'), copy.pilot.subtitle);
      const cta = left.querySelector('a');
      if (cta) cta.childNodes[0].nodeValue = `${copy.pilot.cta} `;
      setText(left.querySelector('span'), copy.pilot.microcopy);
    }
    if (right) {
      const items = right.querySelectorAll('div[style*="grid-template-columns:26px 1fr"] p');
      copy.pilot.deliverables.forEach((value, i) => setText(items[i], value));
      const allP = right.querySelectorAll('p');
      setText(allP[allP.length - 1], copy.pilot.footnote);
    }
  }
}

function wireReveals() {
  const revs = [...document.querySelectorAll('[data-rev]')];
  const show = el => {
    const d = parseFloat(el.dataset.delay || 0) || 0;
    el.style.transition = `opacity .6s cubic-bezier(.22,.61,.36,1) ${d}s, transform .7s cubic-bezier(.22,.61,.36,1) ${d}s`;
    el.style.opacity = '1';
    el.style.transform = 'none';
  };
  if (reduce) return revs.forEach(show);
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
  }), { threshold: 0, rootMargin: '0px 0px -4% 0px' });
  revs.forEach(el => io.observe(el));
}

function wireHeaderAndProgress() {
  const bar = document.querySelector('[data-progress]');
  const head = document.querySelector('[data-head]');
  const hero = document.querySelector('main > section');
  const onScroll = () => {
    if (!bar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${h > 0 ? Math.min(1, window.scrollY / h) * 100 : 0}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (head && hero) {
    const io = new IntersectionObserver(([entry]) => {
      head.style.transform = entry.isIntersecting ? 'translateY(-104%)' : 'translateY(0)';
    }, { threshold: 0 });
    io.observe(hero);
  }
}

function wireHoverStyles() {
  document.querySelectorAll('[style-hover]').forEach(el => {
    const pairs = el.getAttribute('style-hover').split(';').map(s => s.trim()).filter(Boolean).map(s => {
      const idx = s.indexOf(':'); return idx > 0 ? [s.slice(0, idx).trim(), s.slice(idx + 1).trim()] : null;
    }).filter(Boolean);
    const original = pairs.map(([prop]) => [prop, el.style.getPropertyValue(prop)]);
    el.addEventListener('mouseenter', () => pairs.forEach(([prop, value]) => el.style.setProperty(prop, value)));
    el.addEventListener('mouseleave', () => original.forEach(([prop, value]) => value ? el.style.setProperty(prop, value) : el.style.removeProperty(prop)));
  });
  document.querySelectorAll('[data-arrow]').forEach(arrow => {
    const link = arrow.closest('a'); if (!link) return;
    link.addEventListener('mouseenter', () => { arrow.style.transform = 'translateX(5px)'; });
    link.addEventListener('mouseleave', () => { arrow.style.transform = 'none'; });
  });
}

function wireConcerns() {
  const wrap = document.querySelector('[data-concerns]');
  const panel = document.querySelector('[data-answers]');
  const empty = document.querySelector('[data-answers-empty]');
  const count = document.querySelector('[data-concern-count]');
  if (!wrap || !panel) return;
  const answers = {
    team: ['I team non compilano niente', 'Plinio parte dai materiali che il delivery produce già. Al PM arrivano solo domande mirate quando manca un’informazione decisiva.'],
    riservatezza: ['Ogni fonte ha uno stato', 'Pubblicabile, da validare o riservato. Il team mantiene sempre l’approvazione finale.'],
    generico: ['Il contenuto parte dall’azienda', 'Plinio combina il progetto con fatti, fonti e contesto aziendale disponibile: meno testo generico da riscrivere.'],
    controllo: ['Voi decidete, Plinio prepara', 'La strategia resta vostra. Plinio non pubblica nulla da solo e ogni contenuto passa da una persona che approva.'],
    tecnico: ['Nessun progetto IT', 'Il Pilot include setup e configurazione assistita. Si parte da poche fonti reali, senza una migrazione complessa.'],
    roi: ['Si misura, non si racconta', 'Misuriamo topic utili, tempo progetto → prima bozza, richieste ai team e progetti trasformati in comunicazione. Target Pilot: -30% sul tempo.']
  };
  const selected = new Set();
  const render = () => {
    const keys = [...selected];
    if (empty) empty.style.display = keys.length ? 'none' : 'block';
    panel.querySelectorAll('[data-answer]').forEach(el => { if (!selected.has(el.dataset.answer)) el.remove(); });
    keys.forEach((key, i) => {
      if (panel.querySelector(`[data-answer="${key}"]`)) return;
      const answer = answers[key]; if (!answer) return;
      const row = document.createElement('div'); row.dataset.answer = key;
      row.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px 30px;padding:18px 0;border-bottom:1px solid rgba(247,239,221,.22);opacity:0;transform:translateY(8px)';
      const h = document.createElement('div'); h.style.cssText = "font-family:'Cormorant Garamond',serif;font-weight:600;font-size:21px;line-height:1.2;color:#F7EFDD"; h.textContent = answer[0];
      const p = document.createElement('p'); p.style.cssText = 'font-size:16px;line-height:1.5;color:rgba(247,239,221,.78)'; p.textContent = answer[1];
      row.append(h, p); panel.append(row);
      timers.push(setTimeout(() => { row.style.transition = 'opacity .4s ease, transform .5s cubic-bezier(.22,.61,.36,1)'; row.style.opacity = '1'; row.style.transform = 'none'; }, reduce ? 0 : 40 + i * 40));
    });
    if (count) count.textContent = keys.length ? `${keys.length} ${keys.length === 1 ? 'punto selezionato, lo portiamo' : 'punti selezionati, li portiamo'} in call` : 'Nessun punto selezionato';
  };
  wrap.querySelectorAll('[data-concern]').forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      const key = btn.dataset.concern; const on = !selected.has(key);
      on ? selected.add(key) : selected.delete(key);
      btn.setAttribute('aria-pressed', String(on));
      btn.style.background = on ? '#BD5430' : 'transparent'; btn.style.borderColor = on ? '#BD5430' : 'rgba(247,239,221,.35)'; render();
    });
  });
}

function wireOrbit() {
  const copyOrbit = {
    brain: ['AI Brain · Sole', 'Il contesto non riparte da zero.', 'Organizza documenti, progetti e risultati affinché il contesto aziendale sia disponibile quando serve.'],
    radar: ['AI Radar · Marte', 'Trova cosa vale la pena comunicare.', 'Analizza la conoscenza aziendale e fa emergere opportunità con razionale e fonti.'],
    cards: ['Knowledge Cards · Mercurio', 'Fatti verificabili e riutilizzabili.', 'Trasforma le fonti in unità sintetiche, consultabili e sempre riconducibili al documento originale.'],
    content: ['Content Studio · Venere', 'Dal topic approvato alla prima bozza.', 'Usa il contesto aziendale per sviluppare ciò che avete scelto di comunicare.'],
    evidence: ['Evidence Layer · Terra', 'Ogni claim torna alla fonte.', 'Collega contenuti e affermazioni ai documenti e ai risultati che li sostengono.'],
    loop: ['Feedback Loop · Saturno', 'Le correzioni di oggi riducono quelle di domani.', 'Conserva approvazioni e preferenze per ridurre progressivamente le revisioni.']
  };
  const shell = document.querySelector('.pl-ecosystem-card [data-orbit-shell]');
  const popover = document.querySelector('[data-orbit-popover]');
  const label = document.querySelector('[data-orbit-popover-label]');
  const metaphor = document.querySelector('[data-orbit-popover-metaphor]');
  const text = document.querySelector('[data-orbit-popover-text]');
  if (!shell || !popover || !label || !metaphor || !text) return;
  const planets = [...shell.querySelectorAll('[data-planet]')];
  const layers = [...new Set(planets.filter(p => p.dataset.planet !== 'brain').map(p => p.parentElement?.parentElement).filter(Boolean))];
  layers.forEach(l => { l.style.pointerEvents = 'none'; }); planets.forEach(p => { p.style.pointerEvents = 'auto'; });
  const pause = state => { layers.forEach(l => l.style.animationPlayState = state); planets.filter(p => p.dataset.planet !== 'brain').forEach(p => p.style.animationPlayState = state); };
  const place = planet => {
    const sr = shell.getBoundingClientRect(), r = planet.getBoundingClientRect(), width = Math.min(300, sr.width - 20), gap = 8, edge = 10;
    popover.style.width = `${width}px`; let left = r.left - sr.left + r.width / 2 - width / 2; left = Math.max(edge, Math.min(left, sr.width - width - edge));
    const height = popover.offsetHeight || 145; let top = r.bottom - sr.top + gap; if (top + height > sr.height - edge) top = r.top - sr.top - height - gap; top = Math.max(edge, Math.min(top, sr.height - height - edge));
    popover.style.left = `${left}px`; popover.style.top = `${top}px`;
  };
  const hide = () => { popover.dataset.open = 'false'; pause('running'); };
  planets.forEach(planet => {
    planet.addEventListener('mouseenter', () => { const item = copyOrbit[planet.dataset.planet]; if (!item) return; setText(label, item[0]); setText(metaphor, item[1]); setText(text, item[2]); pause('paused'); popover.dataset.open = 'true'; requestAnimationFrame(() => place(planet)); });
    planet.addEventListener('mouseleave', hide);
  });
  window.addEventListener('scroll', hide, { passive: true }); window.addEventListener('resize', hide, { passive: true });
}

async function init() {
  await mountOriginalLayout();
  applyCopy();
  wireReveals();
  wireHeaderAndProgress();
  wireHoverStyles();
  wireConcerns();
  wireOrbit();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init().catch(console.error), { once: true });
else init().catch(console.error);
