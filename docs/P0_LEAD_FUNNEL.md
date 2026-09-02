# P0 — Lead funnel: setup e rilascio

Questa implementazione sostituisce il vecchio `mailto:` con un funnel reale:

1. CTA → form nella landing
2. validazione client + server
3. anti-spam honeypot + rate limiting
4. salvataggio in Firestore (`landing_leads`)
5. redirect a `/grazie`
6. tracking funnel, solo se l'utente ha accettato Analytics
7. privacy notice aggiornata per la raccolta lead

## 1. Prerequisito: Firestore

Nel progetto Firebase `plinio-studio` deve essere attivo Cloud Firestore in modalità Native.

Per coerenza con la privacy della landing, usare una location europea (preferibilmente `eur3` se compatibile con il progetto e con i servizi già esistenti).

La Cloud Function usa Firebase Admin SDK: il browser non scrive direttamente su Firestore e non sono necessarie regole pubbliche di scrittura per `landing_leads`.

## 2. Installazione dipendenze Functions

```bash
cd functions
npm install
cd ..
```

Node richiesto: 20.

## 3. Deploy backend

```bash
npm run deploy:functions
```

Il deploy usa `firebase.functions.json` e crea in `europe-west1`:

- `submitLead`: endpoint HTTP del form
- `cleanupLandingRateLimits`: pulizia giornaliera dei record tecnici di rate limiting scaduti

Endpoint atteso:

```text
https://europe-west1-plinio-studio.cloudfunctions.net/submitLead
```

Se il nome progetto o la region cambiano, aggiornare `conversion.leadApiUrl` in `src/content/siteConfig.js`.

> Le Cloud Functions e Cloud Scheduler richiedono un piano Firebase/Google Cloud che supporti questi servizi.

## 4. Deploy landing

Dopo il deploy della funzione, pubblicare il target Hosting desiderato con il normale workflow del progetto.

La landing invierà il form al backend e, in caso di `201`, reindirizzerà a:

```text
/grazie
```

Con `cleanUrls: true`, Firebase Hosting serve `grazie.html` come `/grazie`.

## 5. Dove arrivano i lead

Firestore collection:

```text
landing_leads
```

Campi principali:

- `fullName`
- `email`
- `company`
- `role`
- `phone` (opzionale)
- `status = new`
- `source`
- `attribution` (UTM/referrer/landing path)
- `privacy.policyVersion`
- `privacy.acknowledgedAt`
- `createdAt`

Il backend non registra payload, email o telefono nei log applicativi.

## 6. Alert operativo

Il P0 registra i contatti in Firestore. Prima di aprire campagne/traffico a volume, configurare anche una notifica operativa sui nuovi documenti `landing_leads`, scegliendo il canale aziendale definitivo (email, Slack o CRM) e documentando l'eventuale nuovo fornitore nella privacy/DPA se riceve dati personali.

Evitare di introdurre un provider email/CRM direttamente nel codice senza aver prima scelto il fornitore e verificato il relativo trattamento dati.

## 7. Test minimo prima del go-live

### Happy path

- compilare tutti i campi obbligatori
- aprire l'informativa dal form
- accettare la presa visione
- inviare
- verificare `201` sulla Function
- verificare nuovo documento in `landing_leads`
- verificare redirect a `/grazie`

### Errori

- email non valida → errore inline
- privacy non selezionata → errore inline
- campi obbligatori vuoti → errore inline
- endpoint non disponibile → messaggio senza perdita silenziosa
- oltre 5 richieste / 15 minuti dallo stesso IP → `429`

### Anti-spam

- campo honeypot `website` valorizzato → richiesta scartata senza salvare PII
- rate limiting server-side → massimo 5 richieste ogni 15 minuti per identificativo IP pseudonimizzato
- i record tecnici del rate limiting hanno scadenza a 24 ore e vengono puliti automaticamente

### Analytics

Con consenso Analytics:

- `lead_form_start`
- `lead_form_submit_attempt`
- `lead_form_submit_success`
- `lead_thank_you_view`

Senza consenso Analytics: nessuno di questi eventi deve essere inviato.

## 8. Checklist privacy prima della produzione

Il copy della privacy è tecnicamente aggiornato per il nuovo form, ma prima della pubblicazione definitiva verificare:

- ragione sociale / nome completo del vero Titolare del trattamento al posto di eventuali denominazioni commerciali
- indirizzo o ulteriori dati identificativi richiesti per il Titolare
- email privacy corretta
- effettiva location Firestore/Functions
- Data Processing Terms / accordi con Google Cloud/Firebase
- periodo di conservazione di 12 mesi coerente con la policy aziendale reale
- eventuali ulteriori destinatari (CRM, email automation, Slack connector, ecc.)

La checkbox del form indica esclusivamente presa visione dell'informativa. Non viene usata come consenso marketing.
