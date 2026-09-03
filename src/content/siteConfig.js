/**
 * Plinio Site Configuration
 * Central configuration file for layout options, media assets, feature toggles and themes.
 */

export const siteConfig = {
  theme: 'dark', // 'dark' | 'light'

  // Feature Toggles
  showOrbit: false, // Set to true to test the system solar/orbit visualization in the capabilities section

  // Hero Media Configuration (3-Phase Pipeline Showcase: Fonti -> Radar -> Canali)
  heroMedia: {
    type: 'pipeline', // 'pipeline' | 'single' | 'dual' | 'carousel' | 'video'
    pipeline: [
      {
        id: 'sources',
        src: './src/assets/radar-1.png',
        alt: 'I vostri materiali di progetto analizzati da Plinio: presentazioni, report, note, metriche e verbali',
        tag: '1. Materiali',
        title: 'I vostri materiali',
        caption: 'Materiali caricati da cui estrarre valore'
      },
      {
        id: 'radar',
        src: './src/assets/radar-2.png',
        alt: 'Plinio Radar trova le comunicazioni per voi con fonti collegate',
        tag: '2. Radar',
        title: 'Plinio Radar trova le comunicazioni per voi',
        caption: 'Temi chiave estratti con citazione verificata'
      },
      {
        id: 'outputs',
        src: './src/assets/radar-3.png',
        alt: 'Comunicazioni pronte per la revisione: Post LinkedIn, Case study, Newsletter con avatar',
        tag: '3. Comunicazioni',
        title: 'Comunicazioni pronte',
        caption: 'Bozze strutturate per i canali aziendali'
      }
    ],
    // Video settings fallback (Demo / Loom / MP4)
    video: {
      src: '', // e.g. 'https://www.youtube-nocookie.com/embed/...' or local mp4
      poster: '',
      title: 'Guarda Plinio in azione in 90 secondi',
      duration: '1:30'
    }
  },

  // Product Section Media Configuration (Content Studio Pipeline: Opportunità -> Bozza & Fonti -> Post Pronto)
  productMedia: {
    type: 'pipeline',
    pipeline: [
      {
        id: 'opportunity',
        src: './src/assets/content-studio-1.png',
        alt: 'Opportunità selezionata dal Radar: Ridurre del 18% i tempi di installazione con metriche e fonti',
        tag: '1. Opportunità',
        title: 'Opportunità selezionata',
        caption: 'Tema chiave approvato con fonti collegate'
      },
      {
        id: 'studio',
        src: './src/assets/content-studio-2.png',
        alt: 'Plinio Content Studio: bozza contestuale con canale, pubblico, tono, claim verificati e fonti',
        tag: '2. Content Studio',
        title: 'Content Studio: bozza & fonti',
        caption: 'Contesto aziendale, claim verificati e fonti'
      },
      {
        id: 'channel',
        src: './src/assets/content-studio-3.png',
        alt: 'Post pronto per la revisione: anteprima LinkedIn con foto e fonti per Aurora Engineering',
        tag: '3. Anteprima',
        title: 'Post pronto per il canale',
        caption: 'Contenuto pronto per approvazione e pubblicazione'
      }
    ],
    src: './src/assets/content-studio-2.png',
    alt: 'Plinio Content Studio: bozza ed anteprima canale con claim e fonti collegate',
    tag: '2. Content Studio',
  },

  // Fatti & Voce Media Configuration (Evidence / Voice & Facts Layer Pipeline)
  fattiVoceMedia: {
    type: 'pipeline',
    pipeline: [
      {
        id: 'facts',
        src: './src/assets/fatti-voce-1.png',
        alt: 'Plinio: Fatti utilizzati estratti da report e debrief di progetto con fonti collegate',
        tag: '1. Fatti',
        title: 'Fatti utilizzati',
        caption: 'Metriche e dati estratti dai documenti'
      },
      {
        id: 'content',
        src: './src/assets/fatti-voce-2.png',
        alt: 'Bozza Acme Engineering: affermazioni con fatti verificati e voce aziendale applicata',
        tag: 'Fatti + Voce',
        title: 'Fatti & Voce applicati',
        caption: 'Bozza con fonti verificate e stile aziendale'
      },
      {
        id: 'voice',
        src: './src/assets/fatti-voce-3.png',
        alt: 'Plinio: Voce aziendale con tono diretto e linea editoriale applicata',
        tag: '2. Voce',
        title: 'Voce aziendale',
        caption: 'Tono, stile e regole editoriali'
      }
    ],
    src: './src/assets/fatti-voce-2.png',
    alt: 'Plinio: Fatti utilizzati da documenti di progetto e Voce aziendale applicata al contenuto',
    tag: '3. Fatti + Voce',
    title: 'Fatti & Voce aziendale',
    caption: 'Dalla fonte alla linea editoriale',
  },

  // Conversion & Lead Capture Endpoints
  conversion: {
    pilotUrl: '#prenota',
    leadApiUrl: 'https://europe-west1-plinio-studio.cloudfunctions.net/submitLead',
    thankYouPath: '/grazie',
  },

  // Company and legal info placeholders
  company: {
    legalName: 'Plinio Studio',
    contactEmail: 'info@plinio.studio'
  },

  // Privacy & Consent Settings
  cookieConsent: {
    enabled: true,
    version: 1,
    maxAgeDays: 180,
  }
};
