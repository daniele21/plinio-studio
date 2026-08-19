const DEMO_TOPICS = {
  setup: {
    title: 'Come abbiamo ridotto del 32% i tempi di setup',
    claim: '−32% tempo medio di setup',
    evidence: '“Il nuovo flusso ha ridotto il tempo medio di setup da 47 a 32 minuti.”',
    source: 'Report finale.pdf · p. 8',
    body: `
      <p>Nel progetto Brand X il collo di bottiglia non era la tecnologia. Era il modo in cui veniva preparato ogni ambiente prima dell'apertura.</p>
      <p>Abbiamo ripensato il flusso operativo e ridotto il tempo medio di setup <mark>da 47 a 32 minuti: −32%</mark>.</p>
      <p>La parte interessante non è il numero in sé. È che il miglioramento è arrivato eliminando passaggi ridondanti, non aggiungendo altra tecnologia.</p>
    `,
  },
  choice: {
    title: 'Perché abbiamo scelto questa tecnologia invece dell’alternativa',
    claim: 'Scelta motivata da 3 vincoli progettuali',
    evidence: '“La soluzione scelta riduceva dipendenze esterne e manteneva il controllo sul flusso operativo.”',
    source: 'Deck cliente.pptx · slide 18',
    body: `
      <p>Nel progetto Brand X avevamo due strade tecnicamente valide. La scelta non si è giocata sulla feature più appariscente.</p>
      <p>Abbiamo preferito la soluzione che ci permetteva di <mark>ridurre le dipendenze esterne, mantenere controllo sul flusso e semplificare la manutenzione</mark>.</p>
      <p>È una decisione che riutilizzeremmo anche oggi: meno complessità operativa vale più di una capability in più che il team non usa.</p>
    `,
  },
  problem: {
    title: 'Il blocco che impediva al cliente di scalare l’esperienza',
    claim: 'Processo manuale non scalabile su più sedi',
    evidence: '“Ogni nuova installazione richiedeva la ricostruzione manuale della configurazione locale.”',
    source: 'Verbale kickoff.docx · § 2.1',
    body: `
      <p>Il cliente non aveva un problema di idee. Aveva un problema di replica.</p>
      <p>Ogni nuova installazione richiedeva di <mark>ricostruire manualmente configurazione, controlli e passaggi operativi</mark>.</p>
      <p>Il progetto è partito da qui: trasformare un'esperienza che funzionava una volta in un sistema che potesse funzionare anche la decima.</p>
    `,
  },
  method: {
    title: 'Il metodo che possiamo riutilizzare sul prossimo progetto',
    claim: 'Framework di rollout riutilizzabile',
    evidence: '“Il rollout è stato standardizzato in quattro checkpoint replicabili sui progetti successivi.”',
    source: 'Retro progetto.docx · § 4.3',
    body: `
      <p>Una parte del valore di un progetto non resta nel deliverable. Resta nel metodo che il team costruisce mentre lavora.</p>
      <p>Su Brand X abbiamo trasformato il rollout in <mark>quattro checkpoint standardizzati</mark>, ciascuno con input, responsabilità e criteri di uscita chiari.</p>
      <p>Questo è il tipo di know-how che rischia di sparire in una cartella. E che invece può diventare una prova concreta di competenza.</p>
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
  const sourceEl = document.querySelector('[data-demo-source]');

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
    if (sourceEl) sourceEl.textContent = topic.source;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activate(button.dataset.demoTopic);
      document.querySelector('#demo-bozza')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
