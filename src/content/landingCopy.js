/**
 * PLINIO LANDING COPY
 * -------------------
 * Questo è l'unico file da modificare per cambiare i testi della landing.
 * Layout, componenti e stile vivono altrove.
 *
 * Nota sul claim “almeno 3 topic”: durante la fase Pilot viene trattato come
 * target di servizio da verificare sui materiali reali del cliente.
 */
export const landingCopy = {
  meta: {
    title: 'Plinio — Dai progetti a topic e contenuti già contestualizzati',
    description:
      'Da ogni progetto Plinio fa emergere almeno 3 topic da comunicare e trasforma quello che scegli in una prima bozza costruita sulla conoscenza reale della tua azienda.',
  },

  nav: {
    brand: 'Plinio',
    links: [
      { label: 'Come funziona', href: '#come-funziona' },
      { label: 'Perché è diverso', href: '#differenza' },
      { label: 'Confronto', href: '#confronto' },
    ],
    cta: { label: 'Provalo su un progetto', href: '#pilot' },
  },

  hero: {
    eyebrow: 'Per aziende che lavorano su progetti complessi e su commessa',
    title: 'Un progetto dentro. Almeno 3 topic pronti da comunicare.',
    subtitle:
      'Plinio trova cosa vale la pena raccontare, recupera contesto, fatti e fonti dalla vostra conoscenza aziendale e trasforma il topic che scegliete in una prima bozza già costruita sul vostro modo di comunicare.',
    outcomeLine: ['1 progetto', '≥3 topic', '1 prima bozza', 'fonti incluse'],
    ctaPrimary: { label: 'Provalo su un progetto reale', href: '#pilot' },
    ctaSecondary: { label: 'Scopri cosa ti evita', href: '#beneficio' },
    microcopy:
      'Nessun nuovo report da compilare. Nessun brief da ricostruire da zero. Ogni informazione importante torna alla fonte.',
  },

  pain: {
    eyebrow: 'Lo stesso ingorgo, visto da tre ruoli',
    title: 'Il valore c’è già. Il tempo si perde nel recuperarlo.',
    intro:
      'Quando un progetto finisce, informazioni, risultati e competenze restano sparse tra documenti e persone. Per comunicarli, il lavoro ricomincia quasi da zero.',
    personas: [
      {
        role: 'CEO / Founder',
        quote: '“Ogni contenuto importante passa ancora da me.”',
        outcome:
          'Il progetto chiuso diventa materiale riutilizzabile senza passare ogni volta dalla tua scrivania. Tu approvi, non ricostruisci.',
      },
      {
        role: 'Marketing / Communication',
        quote: '“Passo più tempo a rincorrere i colleghi che a decidere cosa dire.”',
        outcome:
          'Apri la settimana con topic già motivati, contestualizzati e collegati alle fonti. Scegli l’angolo, non insegui il materiale.',
      },
      {
        role: 'Project Manager',
        quote: '“Mi interrompono per ricostruire cose che sono già scritte da qualche parte.”',
        outcome:
          'Rispondi solo alle domande davvero necessarie. Le informazioni validate restano disponibili per i contenuti successivi.',
      },
    ],
  },

  benefit: {
    eyebrow: 'Meno lavoro prima di poter scrivere',
    title: '3 topic. Senza dover costruire 3 brief.',
    intro:
      'Plinio non parte da un prompt vuoto. Mantiene un contesto riutilizzabile su progetti, risultati, competenze, fonti e linee di comunicazione, così il team non deve ricostruirlo per ogni nuovo contenuto.',
    beforeTitle: 'Senza Plinio',
    before: [
      'Cercare un’idea',
      'Recuperare i documenti',
      'Chiedere contesto al PM',
      'Costruire il brief',
      'Spiegare tutto all’AI',
      'Verificare i fatti',
      'Riscrivere',
    ],
    afterTitle: 'Con Plinio',
    after: ['Valuti i topic', 'Approvi', 'Revisioni la prima bozza'],
    result:
      'Il beneficio non è generare più testo. È eliminare una parte del lavoro necessario prima che il testo possa essere davvero utile.',
  },

  universe: {
    eyebrow: 'L’universo Plinio',
    title: 'Ogni funzione esiste per togliere un pezzo di lavoro manuale.',
    intro:
      'I nomi raccontano l’architettura. Il valore, invece, è ciò che cambia nel lavoro quotidiano del team.',
    capabilities: [
      {
        planet: 'Sole',
        name: 'AI Brain',
        title: 'Il brief non riparte da zero ogni volta.',
        description:
          'Organizza progetti, risultati, competenze e contesto aziendale in una base riutilizzabile per le comunicazioni successive.',
        outcome: 'Meno contesto da ricostruire.',
      },
      {
        planet: 'Terra',
        name: 'AI Radar',
        title: 'Non partire più dal calendario editoriale vuoto.',
        description:
          'Fa emergere dai progetti cosa vale la pena comunicare, perché è rilevante, per chi e con quale angolo.',
        outcome: 'Almeno 3 topic da valutare per progetto nel Pilot.',
      },
      {
        planet: 'Mercurio',
        name: 'Knowledge Cards',
        title: 'Verifica un’informazione una volta. Riutilizzala quando serve.',
        description:
          'Struttura fatti e informazioni rilevanti mantenendoli collegati alle fonti da cui provengono.',
        outcome: 'Meno ricerche e verifiche ripetute.',
      },
      {
        planet: 'Venere',
        name: 'Content Studio',
        title: 'Dall’opportunità approvata alla prima bozza senza ricostruire il brief.',
        description:
          'Usa il contesto già disponibile per sviluppare il topic scelto in una prima versione pronta per la revisione.',
        outcome: 'Meno lavoro preparatorio prima di scrivere.',
      },
      {
        planet: 'Giove',
        name: 'Evidence Layer',
        title: 'Controlla un’affermazione senza cercare di nuovo nel progetto.',
        description:
          'Mantiene i passaggi importanti collegati ai documenti che li supportano, così sai da dove arriva ciò che stai pubblicando.',
        outcome: 'Più controllo, meno tempo perso a ricontrollare.',
      },
      {
        planet: 'Saturno',
        name: 'Feedback Loop',
        title: 'Le correzioni di oggi riducono le revisioni di domani.',
        description:
          'Registra approvazioni, modifiche e rifiuti per allineare progressivamente le proposte alle decisioni del team.',
        outcome: 'Meno correzioni ripetitive nel tempo.',
        status: 'In validazione con i Pilot Design Partner',
      },
    ],
  },

  difference: {
    eyebrow: 'Perché non è un altro generatore',
    title: 'Non contenuti che potrebbero essere di chiunque.',
    intro:
      'Un’AI generalista riceve il contesto che le date nel prompt. Plinio parte dalla conoscenza aziendale già disponibile e la combina con il progetto che state raccontando.',
    benefits: [
      {
        title: 'Meno spiegazioni',
        description:
          'Non devi insegnare ogni volta all’AI chi siete, cosa fate e cosa è successo nel progetto.',
      },
      {
        title: 'Meno riscrittura',
        description:
          'La prima bozza nasce già da fatti, fonti e contesto aziendale invece di partire da testo generico.',
      },
      {
        title: 'Più pertinenza',
        description:
          'I topic vengono proposti sulla base di ciò che l’azienda ha realmente fatto, non soltanto di idee editoriali astratte.',
      },
      {
        title: 'Più controllo',
        description:
          'Le informazioni rilevanti restano riconducibili alle fonti e il team mantiene approvazione e ultima parola.',
      },
    ],
    tagline: 'Il contenuto non parte da un prompt. Parte dalla vostra azienda.',
  },

  process: {
    eyebrow: 'Come funziona',
    title: 'Partite dai materiali che avete già. Arrivate a qualcosa che potete approvare.',
    steps: [
      {
        number: '01',
        title: 'Non cambiate il vostro modo di lavorare',
        description:
          'Report, deck, verbali e materiali di progetto che producete già diventano le fonti.',
      },
      {
        number: '02',
        title: 'Non ricostruite il contesto',
        description:
          'Plinio estrae e organizza fatti, risultati, competenze e informazioni rilevanti.',
      },
      {
        number: '03',
        title: 'Non cercate da zero cosa comunicare',
        description:
          'Ricevete almeno 3 topic da valutare, con razionale, angolo e fonti.',
      },
      {
        number: '04',
        title: 'Non partite dalla pagina bianca',
        description:
          'Scegliete il topic. Plinio usa il contesto aziendale per preparare la prima bozza.',
      },
    ],
  },

  comparison: {
    eyebrow: 'Confronto',
    title:
      'Generare testo è facile. Il lavoro è arrivare al testo giusto senza ricostruire tutto prima.',
    legend: '✓ nativo  ·  ~ possibile con lavoro/configurazione  ·  × non è il focus',
    columns: ['Cosa ottieni', 'AI generaliste', 'Content tool', 'Workflow tool', 'Plinio'],
    rows: [
      ['Trova cosa comunicare dai progetti', '~', '~', '×', '✓'],
      ['Recupera il contesto senza rincorrere i team', '~', '×', '~', '✓'],
      ['Mantiene informazioni e fonti collegate', '~', '~', '~', '✓'],
      ['Porta un topic approvato alla prima bozza', '✓', '✓', '~', '✓'],
    ],
    note:
      'La colonna Plinio descrive la direzione funzionale del prodotto. La disponibilità delle singole capability viene definita nel perimetro del Pilot.',
  },

  objections: {
    eyebrow: 'Obiezioni',
    title: 'Cosa vi preoccupa davvero?',
    items: [
      {
        question: '“I team non hanno tempo per compilare nuovi report.”',
        answer:
          'Non glielo chiediamo. Il punto di partenza sono i materiali che l’azienda produce già nel lavoro quotidiano.',
      },
      {
        question: '“Ci sono cose che non possono uscire.”',
        answer:
          'Le fonti e le informazioni utilizzabili vengono governate nel perimetro del Pilot. Il team mantiene sempre approvazione e controllo.',
      },
      {
        question: '“Temiamo contenuti AI generici.”',
        answer:
          'Plinio non lavora soltanto sul prompt corrente: combina il progetto con il contesto aziendale disponibile e con le decisioni già registrate.',
      },
      {
        question: '“Non vogliamo perdere il controllo.”',
        answer:
          'Plinio propone e prepara. Le persone decidono cosa comunicare, cosa modificare e cosa non pubblicare.',
      },
      {
        question: '“Non abbiamo un team IT da dedicarci.”',
        answer:
          'Il Pilot include setup e configurazione assistita: non è richiesto un progetto IT interno per iniziare.',
      },
      {
        question: '“Come dimostriamo che vale la pena?”',
        answer:
          'Misuriamo tempo di recupero informazioni, richieste agli esperti, topic accettati e tempo dall’approvazione alla prima bozza.',
      },
    ],
  },

  pilot: {
    eyebrow: 'Pilot Design Partner',
    title: 'Portate un progetto chiuso. Guardiamo quanto valore è ancora fermo lì dentro.',
    subtitle:
      'Usiamo un vostro progetto reale per verificare se Plinio riesce a ridurre il lavoro necessario per trasformarlo in comunicazione.',
    deliverables: [
      {
        value: '≥3',
        label: 'topic da valutare',
        description: 'con razionale, angolo e fonti',
      },
      {
        value: '1',
        label: 'prima bozza',
        description: 'costruita sul contesto aziendale disponibile',
      },
      {
        value: '1',
        label: 'stima del lavoro evitabile',
        description: 'rispetto al processo attuale',
      },
    ],
    cta: { label: 'Provalo su un progetto reale', href: '#' },
    footnote:
      'Nel Pilot “≥3 topic per progetto” è il target minimo che vogliamo verificare sui materiali reali: non viene presentato come garanzia universale fuori dal perimetro concordato.',
  },

  footer: {
    brand: 'Plinio',
    tagline: 'Trasforma ciò che l’azienda sa già in qualcosa che può usare oggi.',
    legal: '© 2026 Plinio. Pilot Design Partner.',
  },
};
