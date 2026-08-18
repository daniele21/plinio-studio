# Plinio Studio - Landing Page

La landing mantiene la **grafica originale** di Plinio: layout, palette, tipografia, universo orbitale, animazioni, comparison e struttura delle sezioni.

---

## 🚀 Sviluppo Locale & Deploy su Firebase

### 1. Sviluppo Locale
Puoi avviare il server di sviluppo locale con:
```bash
npm run dev
# oppure con l'emulatore Firebase
npm run serve
```

### 2. Configurare il Progetto Firebase
Seleziona il progetto Firebase target (o visualizza la lista dei progetti disponibili):
```bash
# Mostra la lista dei progetti a cui hai accesso
npm run projects:list

# Seleziona il progetto da usare
firebase use <project-id>
```

### 3. Deploy in Produzione
Per effettuare il deploy su Firebase Hosting:
```bash
npm run deploy
```

### 4. Deploy di Anteprima (Preview Channel)
Per testare una versione temporanea di anteprima su un URL dedicato:
```bash
npm run deploy:preview
```

---

## ✍️ Modificare il Copy e la Configurazione

Tutto il testo editoriale e le configurazioni sono centralizzati in:
- `src/content/landingCopy.js`: testi, headline, sezioni, statistiche, comparazione e FAQ.
- `src/content/siteConfig.js`: impostazioni di layout, switch media hero (carousel / video / screenshot), contatti aziendali.

Non serve modificare HTML, CSS o JavaScript per aggiornare i contenuti.

---

## 📁 Struttura del Repository

```text
index.html                    # Entry point della Single Page App
firebase.json                 # Configurazione Firebase Hosting (headers, caching, ignore)
.firebaserc                   # Alias del progetto Firebase
package.json                  # Script npm di sviluppo e deploy
brand-kit/                    # Icone e loghi ufficiali del brand
fragments/                    # Template HTML modulari per ciascuna sezione
src/
  styles.css                  # Foglio di stile principale
  styles/                     # CSS modulare (tokens, base, components, sections)
  app.js                      # Bootstrap, routing dei frammenti e interattività
  content/
    landingCopy.js            # Source of truth dei testi editoriali
    siteConfig.js             # Configurazione globale e feature toggles
  assets/                     # Immagini, screenshot di prodotto e grafiche
docs/                         # Documentazione interna, posizionamento e brand guidelines
```

---

## 🛡️ Guardrail dei Claim

- `≥3 topic per progetto`: target del Pilot da validare.
- `-30% tempo progetto → prima bozza`: target del Pilot da validare.
- I dati B2B citati nel copy sono evidenze esterne e non risultati attribuiti a Plinio.
