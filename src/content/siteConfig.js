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
    type: 'screenshot', // 'screenshot' | 'video'
    
    // Screenshot settings (Mockup UI)
    screenshot: {
      src: './src/assets/plinio-dashboard-preview.png',
      alt: 'Interfaccia Plinio: estrazione di topic da un progetto e creazione bozze con fonti citate',
      caption: 'Plinio Dashboard · Project to draft pipeline',
      // Fallback SVG graphic generated dynamically if file doesn't exist
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

  // Company and legal info placeholders
  company: {
    legalName: 'Plinio Studio S.r.l.',
    vatNumber: 'IT00000000000',
    contactEmail: 'demo@plinio.ai'
  }
};
