/**
 * Plinio Privacy & Cookie Copy Configuration
 * Centralized Italian texts for cookie choices and the landing privacy notice.
 * Legal identity/company details should be verified before production publication.
 */

export const consentCopy = {
  banner: {
    title: 'Cookie e misurazione',
    description: 'Usiamo cookie tecnici necessari e, solo con il tuo consenso, Analytics per capire come viene usato il sito e migliorarlo. Puoi cambiare scelta in qualsiasi momento.',
    acceptBtn: 'Accetta analytics',
    rejectBtn: 'Rifiuta',
    manageBtn: 'Gestisci →',
    closeAriaLabel: 'Chiudi e rifiuta cookie opzionali',
    policyLinkText: 'Privacy & Cookie Policy',
  },

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
        description: 'Strumenti tecnici indispensabili per il corretto funzionamento del sito e per memorizzare le tue preferenze sulla privacy. Non possono essere disattivati.',
        disabled: true,
        defaultChecked: true,
      },
      analytics: {
        id: 'analytics',
        title: 'Analytics',
        badge: 'Opzionali',
        provider: 'Google Analytics / Firebase',
        description: 'Ci aiutano a produrre statistiche sull’uso della landing page e a migliorarne contenuti e usabilità. Vengono attivati solo dopo il tuo consenso e non sono usati da Plinio per finalità pubblicitarie o remarketing.',
        disabled: false,
        defaultChecked: false,
      },
    },
    footerLinks: {
      cookieText: 'Informativa Cookie',
      privacyText: 'Informativa Privacy',
    },
  },

  policyModal: {
    title: 'Informativa Privacy & Cookie Policy',
    closeAriaLabel: 'Chiudi informativa',
    intro: 'Questa informativa descrive come vengono trattati i dati raccolti attraverso la landing page di Plinio, inclusi i dati inviati per richiedere una prova del prodotto, ai sensi del Regolamento UE 2016/679 (GDPR).',
    sections: [
      {
        title: '1. Titolare del trattamento',
        content: 'Il Titolare del trattamento è <strong>Plinio Studio</strong>. Per richieste relative alla privacy o all’esercizio dei diritti puoi scrivere a <a href="mailto:info@plinio.studio" class="pl-consent-link">info@plinio.studio</a>.'
      },
      {
        title: '2. Dati inviati con il form “Prova Plinio”',
        content: 'Quando richiedi di provare Plinio raccogliamo i dati che inserisci nel form: <strong>nome e cognome, email di lavoro, azienda, ruolo</strong> ed eventualmente <strong>numero di telefono</strong>. Salviamo inoltre informazioni tecniche minime relative alla provenienza della richiesta (ad esempio pagina di ingresso e parametri UTM, se presenti) per attribuire correttamente il contatto. Non chiediamo di caricare documenti di progetto attraverso questo form.'
      },
      {
        title: '3. Finalità e base giuridica della richiesta Pilot',
        content: 'Usiamo i dati del form esclusivamente per <strong>gestire la tua richiesta, ricontattarti, capire il progetto più adatto alla prova e organizzare l’onboarding</strong>. La base giuridica è l’esecuzione di misure precontrattuali richieste dall’interessato ai sensi dell’art. 6(1)(b) GDPR. La casella presente nel form serve a confermare la lettura dell’informativa e <strong>non costituisce consenso marketing</strong>. Non utilizziamo questi dati per newsletter o comunicazioni promozionali senza un’ulteriore base giuridica o un consenso separato, quando necessario.'
      },
      {
        title: '4. Conservazione dei dati del form',
        content: 'Per una nuova richiesta impostiamo una conservazione predefinita massima di <strong>12 mesi dalla ricezione del form</strong>. Alla scadenza il record viene eliminato automaticamente. Se nel frattempo nasce un diverso rapporto commerciale o contrattuale, la conservazione può essere aggiornata in base alla nuova finalità e alla relativa base giuridica. Restano salvi eventuali obblighi di legge o esigenze di tutela di diritti.'
      },
      {
        title: '5. Sicurezza e prevenzione degli abusi',
        content: 'Il form utilizza controlli di validazione, un campo antispam non visibile e limitazione della frequenza delle richieste. Per il rate limiting il backend elabora temporaneamente un <strong>identificativo tecnico derivato dall’indirizzo IP tramite hashing</strong>; non salviamo l’indirizzo IP in chiaro nel record del lead. L’identificativo tecnico è utilizzato esclusivamente per prevenire abusi ed è previsto per una conservazione breve.'
      },
      {
        title: '6. Fornitori e destinatari',
        content: 'La landing e il backend utilizzano servizi <strong>Google Firebase / Google Cloud</strong> per hosting, funzione di ricezione del form, database e, se acconsentito, analytics. I fornitori tecnici possono trattare dati per conto del Titolare secondo i rispettivi accordi sul trattamento dei dati. L’accesso ai lead è limitato alle persone che ne hanno bisogno per gestire le richieste commerciali e di onboarding.'
      },
      {
        title: '7. Trasferimenti internazionali',
        content: 'L’infrastruttura applicativa viene configurata privilegiando regioni europee. Alcuni fornitori globali possono comunque comportare trattamenti o accessi da Paesi extra SEE; in tali casi il trasferimento deve avvenire sulla base degli strumenti previsti dal GDPR, incluse decisioni di adeguatezza o clausole contrattuali standard ove applicabili.'
      },
      {
        title: '8. Cookie tecnici e preferenze',
        content: 'Il sito usa strumenti tecnici necessari per consentire la navigazione e memorizzare la scelta relativa ai cookie (chiave locale <code>plinio_consent_v1</code>). Questi strumenti non vengono utilizzati per profilazione pubblicitaria.'
      },
      {
        title: '9. Analytics opzionali',
        content: 'Google/Firebase Analytics viene attivato <strong>solo dopo consenso espresso</strong>. Se rifiuti o chiudi il banner, lo storage analytics rimane negato. Puoi modificare o revocare la scelta in qualsiasi momento tramite “Preferenze cookie” nel footer. La preferenza viene conservata per un massimo di <strong>180 giorni</strong>, salvo modifiche sostanziali che richiedano una nuova scelta.'
      },
      {
        title: '10. Diritti dell’interessato',
        content: 'Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità ove applicabile e opporti ai trattamenti nei casi previsti dagli artt. 15–22 GDPR, scrivendo a <a href="mailto:info@plinio.studio" class="pl-consent-link">info@plinio.studio</a>. Hai inoltre diritto di proporre reclamo all’autorità di controllo competente.'
      }
    ]
  }
};
