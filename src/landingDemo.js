const DEMO_TOPICS = {
  setup: {
    title: 'Come abbiamo ridotto del 32% i tempi di setup',
    claim: '−32% tempo medio di setup',
    evidence: '“Il nuovo flusso ha ridotto il tempo medio di setup da 47 a 32 minuti.”',
    source: 'Report finale.pdf · p. 8',
    body: `
      <p>Nel progetto Brand X il collo di bottiglia non era la tecnologia. Era il modo in cui veniva preparato ogni ambiente.</p>
      <p>Abbiamo ripensato il flusso operativo e ridotto il tempo medio di setup <mark>da 47 a 32 minuti: −32%</mark>.</p>
    `,
  },
  choice: {
    title: 'Perché abbiamo cambiato tecnologia a metà progetto',
    claim: 'Scelta motivata da 3 vincoli progettuali',
    evidence: '“La soluzione scelta riduceva dipendenze esterne e manteneva il controllo sul flusso operativo.”',
    source: 'Deck cliente.pptx · slide 18',
    body: `
      <p>Avevamo due strade tecnicamente valide. La scelta non si è giocata sulla feature più appariscente.</p>
      <p>Abbiamo preferito la soluzione che riduceva dipendenze esterne e manteneva <mark>più controllo sul flusso operativo</mark>.</p>
    `,
  },
  problem: {
    title: 'Il blocco che impediva al cliente di scalare l’esperienza',
    claim: 'Processo manuale non scalabile su più sedi',
    evidence: '“Ogni nuova installazione richiedeva la ricostruzione manuale della configurazione locale.”',
    source: 'Verbale kickoff.docx · § 2.1',
    body: `
      <p>Il cliente non aveva un problema di idee. Aveva un problema di replica.</p>
      <p>Ogni nuova installazione richiedeva di <mark>ricostruire manualmente configurazione e controlli</mark>. Il progetto è partito da qui.</p>
    `,
  },
};

function initLandingDemo() {
  const buttons = [...document.querySelectorAll('[data-demo-topic]')];
  if (!buttons.length) return false;

  const titleEl = document.querySelector('[data-demo-draft-title]');
  const bodyEl = document.querySelector('[data-demo-draft-body]');
  const claimEl = document.querySelector('[data-demo-claim]');
  const evidenceEl = document.querySelector('[data-demo-evidence]');
  const sourceEls = [...document.querySelectorAll('[data-demo-source], [data-demo-output-source]')];

  const activate = (key) => {
    const topic = DEMO_TOPICS[key];
    if (!topic) return;

    buttons.forEach((button) => {
      const active = button.dataset.demoTopic === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (titleEl) titleEl.textContent = topic.title;
    if (bodyEl) bodyEl.innerHTML = topic.body;
    if (claimEl) claimEl.textContent = topic.claim;
    if (evidenceEl) evidenceEl.textContent = topic.evidence;
    sourceEls.forEach((el) => { el.textContent = topic.source; });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => activate(button.dataset.demoTopic));
  });

  activate(buttons.find((button) => button.classList.contains('is-active'))?.dataset.demoTopic || 'setup');
  return true;
}

if (!initLandingDemo()) {
  const observer = new MutationObserver(() => {
    if (initLandingDemo()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
