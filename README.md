# Plinio Studio — Landing Page

Landing page statica e modulare di Plinio.

## Modificare il copy

Tutto il testo della landing vive in un solo file:

```text
src/content/landingCopy.js
```

Per cambiare headline, CTA, testi delle feature, comparison, obiezioni o Pilot **non serve modificare `index.html` o `src/app.js`**.

Esempio:

```js
hero: {
  title: 'Un progetto dentro. Almeno 3 topic pronti da comunicare.',
  subtitle: '...',
}
```

## Struttura

```text
.
├── index.html
├── README.md
└── src
    ├── app.js                  # rendering e interazioni
    ├── styles.css              # UI / responsive / tema
    └── content
        └── landingCopy.js      # unica source of truth editoriale
```

## Avvio locale

Non ci sono dipendenze o build obbligatorie. Basta servire la cartella con un server statico, ad esempio:

```bash
python3 -m http.server 8080
```

Poi aprire `http://localhost:8080`.

> Aprire direttamente `index.html` con `file://` può bloccare gli ES modules in alcuni browser; usa un server statico locale.

## Deploy

La pagina è compatibile con hosting statico come GitHub Pages, Firebase Hosting, Netlify, Cloudflare Pages e simili.

## Regola editoriale

La landing segue una gerarchia outcome-first:

1. **Output:** cosa ottiene il cliente (`1 progetto → ≥3 topic → 1 prima bozza`).
2. **Lavoro evitato:** brief e contesto non vengono ricostruiti da zero.
3. **Qualità:** il contenuto parte dalla conoscenza aziendale, non da un prompt vuoto.
4. **Controllo:** fatti e informazioni rimangono collegati alle fonti.

Il claim `≥3 topic per progetto` è esplicitamente trattato come target da verificare durante il Pilot Design Partner, non come garanzia universale fuori dal perimetro concordato.
