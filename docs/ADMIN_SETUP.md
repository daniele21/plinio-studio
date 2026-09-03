# Setup e Guida all'Uso: Dashboard Lead Riservata (`/admin`)

Questa guida spiega come accedere, configurare e utilizzare la pagina `/admin` creata per consultare in tempo reale i lead raccolti da Plinio Studio su Cloud Firestore.

---

## 1. Accesso alla pagina

La pagina **non è linkata in nessun elemento dell'interfaccia pubblica** (nessun link nel footer, header o menu) e include il tag meta `noindex, nofollow` per impedire l'indicizzazione da parte dei motori di ricerca.

* **In locale:** `http://localhost:8080/admin`
* **In produzione:** `https://plinio.studio/admin` (o sul rispettivo dominio/staging di Firebase Hosting)

---

## 2. Autenticazione & Sicurezza

L'accesso è consentito **esclusivamente all'account Google autorizzato**:
`danielemoltisanti@gmail.com`

### Architettura di sicurezza a doppio livello:
1. **Client-side guard (`src/admin/authService.js`):**
   - L'utente clicca su *Accedi con Google*.
   - Se l'email autenticata non è nell'elenco degli account autorizzati (`adminConfig.allowedEmails`), la sessione viene **immediatamente terminata** con `signOut(auth)`, nessun dato viene richiesto o esposto e viene mostrato un avviso di accesso negato.
2. **Server-side guard (`firestore.rules`):**
   - Anche tentando di aggirare il client, Cloud Firestore consente la lettura della collection `landing_leads` unicamente alle richieste in cui `request.auth.token.email == 'danielemoltisanti@gmail.com'`.
   - La scrittura dal browser è sempre bloccata (`allow write: if false;`), in quanto le registrazioni avvengono solo tramite la Cloud Function protetta da rate limiting e honeypot.

---

## 3. Prerequisiti Firebase

### A. Abilitare l'accesso Google (se non già attivo)
1. Vai su [Firebase Console](https://console.firebase.google.com/) > Seleziona il progetto **plinio-studio**.
2. Nel menu a sinistra vai su **Authentication** > scheda **Sign-in method**.
3. Assicurati che il provider **Google** sia abilitato (se disabilitato, clicca su *Aggiungi nuovo provider*, seleziona *Google* e salva).

### B. Distribuire le regole di sicurezza Firestore
Per permettere la lettura dei lead da parte dell'utente autorizzato, applicare le regole definite in `firestore.rules`.

Puoi farlo in due modi:
* **Via terminale:**
  ```bash
  npm run deploy:rules
  ```
* **Oppure tramite Firebase Console:**
  Copia il contenuto di `firestore.rules` e incollalo nella scheda **Firestore Database > Regole**, quindi clicca su **Pubblica**.

---

## 4. Funzionalità della Dashboard

* **Sincronizzazione Real-Time:** La dashboard è collegata a Firestore via `onSnapshot`: ogni volta che un visitatore compila il form, il nuovo contatto appare istantaneamente nella lista senza bisogno di ricaricare la pagina.
* **KPI in tempo reale:**
  * Totale contatti raccolti.
  * Contatti ricevuti nella data odierna.
  * Data/ora relativa dell'ultimo contatto (es. *12m fa*, *Oggi alle 11:30*).
* **Filtro di Ricerca Live:** Ricerca istantanea su nome, email, azienda, ruolo e campagna UTM.
* **Dettagli Campagna & Attribuzione:** Cliccando sull'icona a freccia di ciascuna riga è possibile espandere i dettagli tecnici:
  * UTM Source, UTM Medium, UTM Campaign
  * Referrer e Landing Path di ingresso
  * Versione dell'informativa privacy presa in visione
* **Esportazione CSV:** Il pulsante *Esporta CSV* genera e scarica immediatamente un file `.csv` formattato con tutti i contatti e i rispettivi metadati di attribuzione.
* **Configurazione personalizzabile:** Eventuali modifiche (es. aggiunta di ulteriori email autorizzate) possono essere effettuate nel file `src/admin/adminConfig.js`.
