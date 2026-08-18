/**
 * Plinio Site Configuration
 * Central configuration file for layout options, media assets, feature toggles and themes.
 */

export const siteConfig = {
  theme: 'dark', // 'dark' | 'light'

  // Feature Toggles
  showOrbit: false, // Set to true to test the system solar/orbit visualization in the capabilities section

  // Hero Media Configuration
  heroMedia: {
    type: 'carousel', // 'carousel' | 'screenshot' | 'video'

    // Carousel settings (Automatic sliding showcase)
    carousel: {
      autoPlay: true,
      interval: 4500, // ms per slide
      pauseOnHover: true,
      slides: [
        {
          id: 'radar',
          src: './src/assets/plinio-slide-radar.png',
          alt: 'Plinio Studio - Radar opportunità editoriali',
          url: 'app.plinio.ai/studio',
          badgeText: 'Radar opportunità editoriali · Proposte radicate in fonti',
        },
        {
          id: 'knowledge-graph',
          src: './src/assets/plinio-slide-knowledge-graph.png',
          alt: 'Plinio Studio - Grafo di conoscenza aziendale',
          url: 'app.plinio.ai/knowledge-graph',
          badgeText: 'Grafo di conoscenza · Connessione tra fonti, progetti e deliverable',
        },
      ]
    },

    // Screenshot fallback settings (Mockup UI)
    screenshot: {
      src: './src/assets/plinio-slide-radar.png',
      alt: 'Interfaccia Plinio: radar opportunità editoriali e creazione contenuti da fonti validate',
      caption: 'Plinio Dashboard · Radar opportunità editoriali e gestione contenuti',
      useFallbackSvg: true
    },

    // Video settings (Demo / Loom / MP4)
    video: {
      src: '', // e.g. 'https://www.youtube-nocookie.com/embed/...' or local mp4
      poster: '',
      title: 'Guarda Plinio in azione in 90 secondi',
      duration: '1:30'
    }
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
