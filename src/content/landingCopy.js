/**
 * PLINIO LANDING COPY
 * -------------------
 * Unica source of truth editoriale della landing.
 * Layout, rendering e stile vivono altrove.
 *
 * I numeri marcati come benchmark esterni descrivono studi indipendenti e NON
 * risultati ottenuti da Plinio. I target del Pilot sono esplicitamente indicati
 * come obiettivi da validare sui materiali e sul workflow reale del cliente.
 */
export const landingCopy = {
  meta: {
    title: 'Plinio — Fate vedere di più ciò che la vostra azienda sa fare',
    description:
      'Plinio trasforma i progetti già fatti in topic e contenuti contestualizzati, riducendo il lavoro necessario per comunicare con continuità.',
  },

  nav: {
    brand: 'Plinio',
    links: [
      { label: 'Cosa ottieni', href: '#risultato' },
      { label: 'Perché conta', href: '#impatto' },
      { label: 'Come funziona', href: '#come-funziona' },
      { label: 'Confronto', href: '#confronto' },
    ],
    cta: { label: 'Provalo su un progetto', href: '#pilot' },
  },

  hero: {
    eyebrow: 'Per aziende B2B che hanno molto da raccontare e poco tempo per farlo',
    title: 'Fate vedere di più ciò che la vostra azienda sa fare. Senza chiedere più tempo ai team.',
    subtitle:
      'Da ogni progetto selezionato Plinio punta a far emergere almeno 3 topic da comunicare. Quando ne scegliete uno, recupera contesto, fatti e fonti dalla conoscenza aziendale e prepara una prima bozza già costruita sul vostro modo di comunicare.',
    outcomeLine: ['1 progetto', '≥3 topic', '1 prima bozza', 'fonti incluse'],
    ctaPrimary: { label: 'Provalo su un progetto reale', href: '#pilot' },
    ctaSecondary: { label: 'Vedi cosa cambia', href: '#risultato' },
    microcopy:
      'Nessun nuovo report. Nessun brief da ricostruire da zero. Meno richieste a founder e project manager. Il claim ≥3 topic è un target del Pilot da validare sui vostri materiali reali.',
  },

  pain: {
    eyebrow: 'Il problema',
    title: 'Non vi manca qualcosa da dire. Troppo poco di quello che fate arriva al mercato.',
    intro:
      'Ogni progetto produce risultati, competenze, decisioni, immagini e storie. Ma per comunicarli qualcuno deve recuperare i documenti, ricostruire il contesto, chiedere informazioni ai team, preparare il brief, scrivere e verificare. Quando manca il tempo, il contenuto semplicemente non esce.',
    personas: [
      {
        role: 'CEO / Founder',
        quote: '“Facciamo molto più di quello che il mercato vede.”',
        outcome:
          'Più dell’azienda diventa visibile senza trasformarti nel collo di bottiglia della comunicazione.',
      },
      {
        role: 'Marketing / Communication',
        quote: '“Passo più tempo a recuperare materiale che a decidere cosa comunicare.”',
        outcome:
          'Apri la settimana sapendo già cosa vale la pena raccontare e da quali evidenze partire.',
      },
      {
        role: 'Project Manager',
        quote: '“Mi interrompono per informazioni che abbiamo già prodotto.”',
        outcome:
          'Contribuisci solo quando serve davvero. Il contesto validato resta disponibile per i contenuti successivi.',
      },
    ],
    closing: 'Il risultato: l’azienda fa più cose interessanti di quante il mercato riesca a vedere.',
  },

  output: {
    eyebrow: 'Cosa ottieni',
    title: 'Ogni progetto può diventare almeno 3 occasioni per mostrare ciò che sapete fare.',
    intro:
      'Plinio fa emergere dai materiali di progetto opportunità concrete di comunicazione. Non semplici idee editoriali: topic motivati, contestualizzati e collegati a ciò che l’azienda ha realmente fatto.',
    items: [
      {
        value: '≥3',
        label: 'topic da valutare',
        description: 'con angle, target, razionale e fonti',
      },
      {
        value: '1',
        label: 'topic scelto dal team',
        description: 'siete voi a decidere cosa vale la pena raccontare',
      },
      {
        value: '1',
        label: 'prima bozza contestualizzata',
        description: 'costruita usando il contesto aziendale disponibile',
      },
      {
        value: '↗',
        label: 'più progetti comunicati',
        description: 'più del lavoro già fatto diventa visibile e riutilizzabile',
      },
    ],
    footnote:
      '≥3 topic per progetto è il target minimo che vogliamo validare nel Pilot Design Partner, non una garanzia universale fuori dal perimetro concordato.',
  },

  benefit: {
    eyebrow: 'Efficienza',
    title: '3 topic. Senza dover costruire 3 nuovi brief.',
    intro:
      'Plinio mantiene un contesto riutilizzabile su progetti, risultati, competenze, fonti e linee di comunicazione. Ogni nuovo contenuto non deve ripartire da zero.',
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
    benchmarksTitle: 'La GenAI ha già dimostrato di ridurre i tempi del knowledge work. Plinio vuole estendere il beneficio all’intero percorso progetto → comunicazione.',
    benchmarks: [
      {
        value: '−40%',
        label: 'tempo su attività di scrittura professionale',
        detail: '+18% qualità dell’output in un esperimento randomizzato su 453 professionisti.',
        source: 'Noy & Zhang, Science, 2023',
        url: 'https://doi.org/10.1126/science.adh2586',
      },
      {
        value: '−25,1%',
        label: 'tempo su task di knowledge work',
        detail: '+12,2% task completati nell’esperimento su 758 consulenti BCG, per attività entro la frontiera di capacità dell’AI.',
        source: 'Dell’Acqua et al., HBS/BCG, 2023–2026',
        url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321',
      },
    ],
    benchmarkNote:
      'Benchmark esterni, non performance Plinio. Nel Pilot misuriamo il vostro tempo reale dal recupero delle informazioni alla prima bozza verificabile.',
  },

  difference: {
    eyebrow: 'Perché non è un altro generatore',
    title: 'Non contenuti che potrebbero essere di chiunque.',
    intro:
      'Un’AI generalista parte dal prompt che le date. Plinio parte dalla conoscenza aziendale disponibile e la combina con il progetto che state raccontando.',
    benefits: [
      {
        title: 'Meno spiegazioni',
        description:
          'Non devi insegnare ogni volta all’AI chi siete, cosa fate e cosa è successo nel progetto.',
      },
      {
        title: 'Meno riscrittura',
        description:
          'La prima bozza nasce da fatti, fonti e contesto aziendale invece di partire da testo generico.',
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
    tagline: 'Il contenuto non parte da un prompt vuoto. Parte dalla vostra azienda.',
  },

  marketEvidence: {
    eyebrow: 'Perché la visibilità conta nel B2B',
    title: 'Essere bravi conta. Essere già conosciuti quando arriva il momento di scegliere conta ancora di più.',
    intro:
      'La comunicazione non serve solo a “pubblicare di più”. Serve a rendere visibili competenze, risultati e prove prima che inizi una trattativa.',
    stats: [
      {
        value: '81%',
        label: 'degli acquisti B2B analizzati è andato a vendor già conosciuti da tutto o quasi tutto il buying group all’inizio del processo.',
        detail: 'Solo il 4% riguardava vendor conosciuti esclusivamente dalla funzione che li aveva raccomandati.',
        source: 'LinkedIn B2B Institute × Bain & Company',
        url: 'https://www.linkedin.com/business/marketing/blog/research-and-insights/the-principles-of-buyability-why-strong-deals-stall-and-what-separates-the-vendors-who-get-chosen',
      },
      {
        value: '75%',
        label: 'dei decision-maker e C-suite ha approfondito un prodotto o servizio che prima non considerava dopo un contenuto di thought leadership.',
        detail: 'Il contenuto può quindi ampliare la considerazione prima della fase di vendita.',
        source: 'Edelman × LinkedIn, B2B Thought Leadership Impact Report 2024',
        url: 'https://www.linkedin.com/business/marketing/blog/research-and-insights/b2b-thought-leadership-research-impact-linkedin-edelman',
      },
      {
        value: '9/10',
        label: 'decision-maker e C-suite sono più ricettivi all’outreach di aziende che pubblicano con continuità thought leadership di qualità.',
        detail: 'La continuità costruisce familiarità prima del contatto commerciale.',
        source: 'Edelman × LinkedIn, 2024',
        url: 'https://www.linkedin.com/business/marketing/blog/research-and-insights/b2b-thought-leadership-research-impact-linkedin-edelman',
      },
    ],
    closing:
      'Plinio aiuta a trasformare più spesso il lavoro che fate già in prove visibili delle vostre competenze.',
    caveat:
      'Questi dati descrivono dinamiche generali del B2B e della thought leadership. Non implicano che Plinio produca automaticamente lo stesso impatto su vendite o pipeline.',
  },

  businessImpact: {
    eyebrow: 'Dal contenuto al business',
    title: 'Ogni progetto può diventare una prova in più per il prossimo cliente.',
    intro:
      'Case study, risultati, competenze e insight non dovrebbero restare chiusi nei documenti del progetto. Marketing e sales possono riutilizzarli per rendere più comprensibile il valore dell’azienda.',
    items: [
      {
        title: 'Più visibilità',
        description: 'Più del lavoro che fate arriva davanti al mercato con continuità.',
      },
      {
        title: 'Più credibilità',
        description: 'Clienti e prospect vedono esempi concreti delle vostre competenze, non solo claim commerciali.',
      },
      {
        title: 'Più occasioni commerciali',
        description: 'Più contenuti rilevanti creano più occasioni per entrare nella considerazione di chi potrebbe acquistare.',
      },
    ],
    note:
      'Plinio abilita più continuità e più prove visibili. Vendite, pipeline e revenue dipendono anche da distribuzione, mercato, offerta e processo commerciale e vanno misurate nel tempo.',
  },

  universe: {
    eyebrow: 'L’universo Plinio',
    title: 'Ogni funzione esiste per togliere un pezzo di lavoro manuale.',
    intro:
      'I nomi raccontano l’architettura. Il valore è ciò che cambia nel lavoro quotidiano del team.',
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
        outcome: 'Target Pilot: ≥3 topic da valutare per progetto.',
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

  process: {
    eyebrow: 'Come funziona',
    title: 'Partite dai materiali che avete già. Arrivate a qualcosa che potete approvare.',
    steps: [
      {
        number: '01',
        title: 'Non cambiate il vostro modo di lavorare',
        description: 'Report, deck, verbali e materiali di progetto che producete già diventano le fonti.',
      },
      {
        number: '02',
        title: 'Non ricostruite il contesto',
        description: 'Plinio estrae e organizza fatti, risultati, competenze e informazioni rilevanti.',
      },
      {
        number: '03',
        title: 'Non cercate da zero cosa comunicare',
        description: 'Nel Pilot puntiamo ad almeno 3 topic da valutare per progetto, con razionale, angolo e fonti.',
      },
      {
        number: '04',
        title: 'Non partite dalla pagina bianca',
        description: 'Scegliete il topic. Plinio usa il contesto aziendale per preparare la prima bozza.',
      },
    ],
  },

  comparison: {
    eyebrow: 'Confronto',
    title: 'Generare testo è facile. Far emergere continuamente ciò che vale la pena comunicare è il lavoro vero.',
    legend: '✓ nativo  ·  ~ possibile con lavoro/configurazione  ·  × non è il focus',
    columns: ['Cosa ottieni', 'AI generaliste', 'Content tool', 'Workflow tool', 'Plinio'],
    rows: [
      ['Trasforma i progetti in occasioni di comunicazione', '~', '~', '×', '✓'],
      ['Evita di ricostruire ogni volta il brief', '~', '×', '~', '✓'],
      ['Scrive partendo dal contesto aziendale', '~', '~', '~', '✓'],
      ['Mantiene fatti e fonti collegati', '~', '~', '~', '✓'],
      ['Aiuta a comunicare con maggiore continuità', '~', '✓', '~', '✓'],
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
        answer: 'Non glielo chiediamo. Il punto di partenza sono i materiali che l’azienda produce già nel lavoro quotidiano.',
      },
      {
        question: '“Ci sono cose che non possono uscire.”',
        answer: 'Le fonti e le informazioni utilizzabili vengono governate nel perimetro del Pilot. Il team mantiene sempre approvazione e controllo.',
      },
      {
        question: '“Temiamo contenuti AI generici.”',
        answer: 'Plinio non lavora soltanto sul prompt corrente: combina il progetto con il contesto aziendale disponibile e con le decisioni già registrate.',
      },
      {
        question: '“Non vogliamo perdere il controllo.”',
        answer: 'Plinio propone e prepara. Le persone decidono cosa comunicare, cosa modificare e cosa non pubblicare.',
      },
      {
        question: '“Non abbiamo un team IT da dedicarci.”',
        answer: 'Il Pilot include setup e configurazione assistita: non è richiesto un progetto IT interno per iniziare.',
      },
      {
        question: '“Come dimostriamo che vale la pena?”',
        answer: 'Misuriamo topic utili prodotti, tempo progetto → prima bozza, richieste agli esperti, progetti trasformati in comunicazione e topic approvati.',
      },
    ],
  },

  pilot: {
    eyebrow: 'Pilot Design Partner',
    title: 'In 6–8 settimane misuriamo se Plinio vi fa comunicare di più lavorando di meno.',
    subtitle:
      'Partiamo da progetti reali e confrontiamo il vostro processo attuale con quello supportato da Plinio. L’obiettivo non è mostrare una demo: è misurare un cambiamento operativo.',
    targetsTitle: 'Target da validare nel Pilot',
    deliverables: [
      {
        value: '≥3',
        label: 'topic per progetto',
        description: 'utilizzabili, motivati e collegati alle fonti',
      },
      {
        value: '−30%',
        label: 'tempo progetto → prima bozza',
        description: 'target operativo da misurare rispetto al vostro processo attuale',
      },
      {
        value: '↓',
        label: 'richieste ai team',
        description: 'meno interazioni necessarie con founder, PM e account',
      },
      {
        value: '↑',
        label: 'progetti diventati comunicazione',
        description: 'più conoscenza già prodotta trasformata in asset utilizzabili',
      },
    ],
    cta: { label: 'Provalo su un progetto reale', href: '#' },
    footnote:
      '≥3 topic e −30% di tempo sono target del Pilot da validare, non benchmark Plinio già dimostrati. Il target di efficienza è coerente con benchmark sperimentali esterni sulla GenAI nell’ordine del 25–40%, ma viene misurato sul vostro workflow reale.',
  },

  finalCta: {
    eyebrow: 'Partiamo da qualcosa di reale',
    title: 'Portateci un progetto che il mercato ha visto troppo poco.',
    subtitle:
      'Vi mostriamo quante opportunità di comunicazione contiene, sviluppiamo la prima e misuriamo quanto lavoro sarebbe servito al vostro team per ottenere lo stesso risultato.',
    valueLine: ['≥3 topic', '1 prima bozza', 'fonti', 'stima del tempo risparmiabile'],
    cta: { label: 'Provalo su un progetto reale', href: '#' },
  },

  footer: {
    brand: 'Plinio',
    tagline: 'Più del lavoro che fate diventa qualcosa che il mercato può vedere.',
    legal: '© 2026 Plinio. Pilot Design Partner.',
  },
};