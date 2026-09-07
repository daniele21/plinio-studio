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

  // Fatti & Voce Media Configuration (Evidence / Voice & Facts Layer Pipeline)
  fattiVoceMedia: {
    type: 'pipeline',
    pipeline: [
      {
        id: 'facts',
        src: './src/assets/fatti-voce-1.png',
        alt: 'Plinio: Le vostre fonti - Progetti e documenti, persone e conversazioni, conoscenze del team',
        tag: '1. Fonti',
        title: 'Le vostre fonti',
        caption: 'I materiali che avete già.'
      },
      {
        id: 'content',
        src: './src/assets/fatti-voce-2.png',
        alt: 'Plinio Radar collega il progetto al contesto esterno: caso studio, approfondimento tecnico, dietro le quinte, opinione e newsjacking',
        tag: '2. Radar',
        title: 'Plinio Radar',
        caption: 'Ogni settimana, nuove opportunità da raccontare.'
      },
      {
        id: 'voice',
        src: './src/assets/fatti-voce-3.png',
        alt: 'Plinio: Contenuti pronti nel vostro tono con fonti collegate',
        tag: '3. Content Studio',
        title: 'Content Studio',
        caption: 'Contenuti pronti, nel vostro tono.'
      }
    ],
    src: './src/assets/fatti-voce-2.png',
    alt: 'Plinio: Dalle fonti aziendali al Radar fino ai contenuti pronti nel vostro tono',
    tag: '3. Fatti + Voce',
    title: 'Fatti & Voce aziendale',
    caption: 'Dalle fonti alla linea editoriale',
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
