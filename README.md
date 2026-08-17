# Plinio Studio — Landing Page

La landing mantiene la **grafica originale** di Plinio: layout, palette, tipografia, universo orbitale, animazioni, comparison e struttura delle sezioni.

## Modificare il copy

Tutto il testo editoriale modificabile è centralizzato in:

```text
src/content/landingCopy.js
```

Per cambiare headline, value proposition, testi delle capability, process, comparison o Pilot non serve modificare HTML, CSS o JavaScript.

## Struttura

```text
index.html                    # entrypoint
fragments/                    # markup originale della landing, diviso per sezioni
src/
  styles.css                  # stile originale della landing
  app.js                      # interazioni + applicazione del copy
  content/
    landingCopy.js            # unica source of truth editoriale
```

## Guardrail dei claim

- `≥3 topic per progetto`: target del Pilot da validare.
- `-30% tempo progetto → prima bozza`: target del Pilot da validare.
- I dati B2B citati nel copy sono evidenze esterne e non risultati attribuiti a Plinio.
