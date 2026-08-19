/**
 * Plinio Site Configuration
 * Central configuration file for layout options, media assets, feature toggles and themes.
 */

export const siteConfig = {
  theme: 'dark', // 'dark' | 'light'

  // Feature Toggles
  showOrbit: false, // Set to true to test the system solar/orbit visualization in the capabilities section

  // Hero Media Configuration (Dual Column Visual Story)
  heroMedia: {
    type: 'dual', // 'dual' | 'carousel' | 'screenshot' | 'video'
    primary: {
      id: 'radar',
      src: './src/assets/radar-discovery.png',
      alt: 'Plinio Radar: individua opportunità editoriali dai materiali di progetto',
      url: 'app.plinio.ai/radar',
      tag: '1. Radar',
      caption: 'Radar opportunità · Fatti e scelte da raccontare',
    },
    secondary: {
      id: 'knowledge-graph',
      src: './src/assets/plinio-slide-knowledge-graph.png',
      alt: 'Plinio Grafo di Conoscenza: connessione tra fonti, decisioni e deliverable',
      url: 'app.plinio.ai/knowledge-graph',
      tag: '2. Fonti & Grafo',
      caption: 'Grafo di conoscenza · Connessione tra claim e fonti',
    },
    // Video settings fallback (Demo / Loom / MP4)
    video: {
      src: '', // e.g. 'https://www.youtube-nocookie.com/embed/...' or local mp4
      poster: '',
      title: 'Guarda Plinio in azione in 90 secondi',
      duration: '1:30'
    }
  },

  // Product Section Media Configuration
  productMedia: {
    src: './src/assets/content-studio.png',
    alt: 'Interfaccia Plinio: Content Studio con bozza editoriale e fonti collegate',
  },

  // Conversion & Booking Endpoints
  conversion: {
    pilotUrl: 'mailto:info@plinio.studio?subject=Richiesta%20Pilot%20Plinio%20su%20un%20progetto%20reale',
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
