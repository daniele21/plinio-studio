/**
 * Plinio Site Configuration
 * Central configuration file for layout options, media assets, feature toggles and themes.
 */

export const siteConfig = {
  theme: 'dark', // 'dark' | 'light'

  // Feature Toggles
  showOrbit: false, // Set to true to test the system solar/orbit visualization in the capabilities section

  // Hero Media Configuration (Single Dominant Screenshot)
  heroMedia: {
    type: 'single', // 'single' | 'dual' | 'carousel' | 'screenshot' | 'video'
    primary: {
      id: 'radar',
      src: './src/assets/1.radar-.png',
      alt: 'Plinio Radar: individua opportunità da comunicare dai materiali di progetto',
      url: 'app.plinio.ai/radar',
      tag: '1. Radar',
      caption: 'Radar opportunità · Fatti e scelte da raccontare',
    },
    // Video settings fallback (Demo / Loom / MP4)
    video: {
      src: '', // e.g. 'https://www.youtube-nocookie.com/embed/...' or local mp4
      poster: '',
      title: 'Guarda Plinio in azione in 90 secondi',
      duration: '1:30'
    }
  },

  // Product Section Media Configuration (Content Studio)
  productMedia: {
    src: './src/assets/2. content-studio.png',
    alt: 'Interfaccia Plinio: Content Studio con opportunità selezionata, bozza ed anteprima canale',
    tag: '2. Content Studio',
  },

  // Fatti & Voce Media Configuration (Evidence / Voice & Facts Layer)
  fattiVoceMedia: {
    src: './src/assets/3.Evidence.png',
    alt: 'Plinio: Fatti utilizzati da documenti di progetto e Voce aziendale applicata al contenuto',
    tag: '3. Fatti + Voce',
    title: 'Fatti & Voce aziendale',
    caption: 'Dalla fonte alla linea editoriale',
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
