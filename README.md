# Plinio Studio — Landing Page

Landing page statica e modulare di Plinio.

## Modificare il copy

Tutto il testo della landing, inclusi benchmark, fonti e target del Pilot, vive in un solo file:

```text
src/content/landingCopy.js
```

Per cambiare headline, CTA, testi delle feature, comparison, obiezioni, evidenze o Pilot **non serve modificare `index.html` o `src/app.js`**.

Esempio:

```js
hero: {
  title: 'Fate vedere di più ciò che la vostra azienda sa fare. Senza chiedere più tempo ai team.',
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

## Gerarchia editoriale

La landing segue una logica outcome-first:

1. **Visibilità:** più del lavoro già fatto arriva davanti al mercato.
2. **Output concreto:** `1 progetto → ≥3 topic → 1 prima bozza → fonti`.
3. **Efficienza:** brief e contesto non vengono ricostruiti da zero.
4. **Qualità:** il contenuto parte dalla conoscenza aziendale, non da un prompt vuoto.
5. **Controllo:** fatti e informazioni rimangono collegati alle fonti.
6. **Impatto business:** più continuità, più prove delle competenze, più occasioni per entrare nella considerazione dei buyer.
7. **Misurazione:** il Pilot confronta processo attuale e processo supportato da Plinio.

## Guardrail sui claim

### Target Plinio da validare

- `≥3 topic per progetto`
- `−30% tempo progetto → prima bozza verificabile`

Sono **target del Pilot Design Partner**, non performance Plinio già dimostrate.

### Benchmark esterni

La landing cita studi indipendenti su:

- produttività della GenAI nel professional writing e nel knowledge work;
- familiarità del brand nei buying group B2B;
- influenza della thought leadership su considerazione e ricettività commerciale.

Questi numeri devono restare esplicitamente presentati come **evidenze di contesto**, mai come risultati causati da Plinio.

Vendite, pipeline e revenue sono metriche downstream: Plinio abilita più continuità e più prove visibili, ma l'impatto commerciale dipende anche da distribuzione, mercato, offerta e processo sales.