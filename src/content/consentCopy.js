/**
 * Plinio Cookie Consent & Privacy Copy Configuration
 * Centralized Italian texts, labels and full policy content compliant with GDPR & Garante Privacy.
 */

export const consentCopy = {
  // Floating Cookie Banner
  banner: {
    title: 'Cookie e misurazione',
    description: 'Usiamo cookie tecnici necessari e, solo con il tuo consenso, Analytics per capire come viene usato il sito e migliorarlo. Puoi cambiare scelta in qualsiasi momento.',
    acceptBtn: 'Accetta analytics',
    rejectBtn: 'Rifiuta',
    manageBtn: 'Gestisci →',
    closeAriaLabel: 'Chiudi e rifiuta cookie opzionali',
    policyLinkText: 'Privacy & Cookie Policy',
  },

  // Preferences Center Modal
  preferencesModal: {
    title: 'Preferenze cookie',
    description: 'Personalizza le tue scelte sul tracciamento. Puoi modificare o revocare il tuo consenso in qualsiasi momento dal link nel footer.',
    saveBtn: 'Salva preferenze',
    closeAriaLabel: 'Chiudi preferenze',
    categories: {
      necessary: {
        id: 'necessary',
        title: 'Necessari',
        badge: 'Sempre attivi',
        description: 'Cookie tecnici indispensabili per il corretto funzionamento del sito e per memorizzare le tue preferenze sulla privacy. Non possono essere disattivati.',
        disabled: true,
        defaultChecked: true,
      },
      analytics: {
        id: 'analytics',
        title: 'Analytics',
        badge: 'Opzionali',
        provider: 'Google Analytics / Firebase',
        description: 'Ci aiutano a raccogliere statistiche aggregate e anonime per comprendere come viene consultata la landing page e migliorarne contenuti e usabilità. I dati non vengono utilizzati per finalità pubblicitarie o di profilazione.',
        disabled: false,
        defaultChecked: false,
      },
    },
    footerLinks: {
      cookieText: 'Informativa Cookie',
      privacyText: 'Informativa Privacy',
    },
  },

  // Comprehensive Privacy & Cookie Policy Modal
  policyModal: {
    title: 'Informativa Privacy & Cookie Policy',
    closeAriaLabel: 'Chiudi informativa',
    intro: 'La presente informativa è resa ai sensi dell’art. 13 del Regolamento UE 2016/679 (GDPR) e delle Linee guida cookie e altri strumenti di tracciamento del Garante Privacy italiano.',
    sections: [
      {
        title: '1. Titolare del Trattamento',
        content: 'Il Titolare del trattamento è <strong>Plinio Studio</strong>. Per qualsiasi richiesta relativa alla privacy o all’esercizio dei propri diritti, è possibile contattarci all’indirizzo email: <a href="mailto:info@plinio.studio" class="pl-consent-link">info@plinio.studio</a>.'
      },
      {
        title: '2. Tipologie di Dati e Strumenti di Tracciamento',
        content: 'Il nostro sito utilizza esclusivamente due categorie di strumenti:<br><ul><li><strong>Cookie tecnici e di stato necessari:</strong> utilizzati esclusivamente per consentire la navigazione e memorizzare la tua scelta sul consenso (chiave locale <code>plinio_consent_v1</code>).</li><li><strong>Analytics (opzionali):</strong> forniti da Google/Firebase Analytics, attivati solo ed esclusivamente previo tuo consenso espresso, per fini statistici aggregati sull’uso della landing. Non utilizziamo cookie di marketing, profilazione o remarketing di terze parti.</li></ul>'
      },
      {
        title: '3. Gestione del Consenso (Basic Consent Mode)',
        content: 'In conformità alle prescrizioni del Garante, al tuo primo accesso nessun cookie analitico viene installato o eseguito. La chiusura del banner tramite il pulsante <strong>×</strong> o la selezione di <strong>Rifiuta</strong> comporta il mantenimento delle impostazioni predefinite senza alcun tracciamento.'
      },
      {
        title: '4. Periodo di Conservazione della Scelta',
        content: 'La tua preferenza di consenso viene conservata per un periodo massimo di <strong>180 giorni</strong> (6 mesi). Al termine di tale periodo, o in caso di modifiche sostanziali alle categorie di tracciamento, ti verrà riproposta la scelta.'
      },
      {
        title: '5. Modifica o Revoca del Consenso',
        content: 'Puoi modificare o revocare il tuo consenso in qualunque momento cliccando su <strong>"Preferenze cookie"</strong> posizionato nel footer di tutte le pagine del sito.'
      },
      {
        title: '6. Diritti dell’Interessato',
        content: 'In qualità di interessato, hai il diritto di chiedere l’accesso ai tuoi dati, la rettifica, la cancellazione o la limitazione del trattamento ai sensi degli artt. 15-22 del GDPR, scrivendo a <a href="mailto:info@plinio.studio" class="pl-consent-link">info@plinio.studio</a>.'
      }
    ]
  }
};
