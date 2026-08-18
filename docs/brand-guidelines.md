# Plinio Brand Guidelines

> **Status:** Brand system v1.0  
> **Purpose:** source of truth per identità visiva, sito, prodotto e materiali di comunicazione.  
> **Principio guida:** *From project knowledge to credible communication.*

---

## 1. Brand idea

Plinio trasforma la conoscenza prodotta nei progetti in comunicazione credibile, verificabile e riutilizzabile.

L'identità visiva deve quindi trasmettere tre qualità prima di tutto:

- **Credibile** - niente estetica AI generica, futuristica o “magica”. La forma deve comunicare solidità, fonti e controllo.
- **Contestuale** - Plinio connette progetti, fonti, opportunità e contenuti. Il linguaggio visuale deve suggerire relazione e continuità.
- **Efficiente** - l'interfaccia deve apparire semplice e leggibile anche quando il sistema sottostante è complesso.

### 1.1 Brand attributes

| Attributo | Deve sembrare | Non deve sembrare |
|---|---|---|
| Premium | editoriale, curato, misurato | luxury decorativo |
| AI-native | intelligente, contestuale | sci-fi, neon, robotico |
| B2B | affidabile, concreto | corporate freddo |
| Product-led | operativo, leggibile | concept art |
| Human | caldo, naturale | giocoso o infantile |

### 1.2 Visual mantra

**Warm. Credible. Evidence-led.**

Il design deve privilegiare contrasto caldo, spazio, tipografia e gerarchia. Gli effetti decorativi sono subordinati alla comprensione.

---

## 2. Logo system

### 2.1 Concept

Il logo combina:

- **Nucleus** - la fonte, il fatto o la conoscenza reale da cui tutto parte.
- **Orbit** - connessione tra fonti, progetti, opportunità e contenuti.
- **Continuity arc** - il lavoro non si perde: viene riutilizzato e genera nuova comunicazione.
- **Wordmark Plinio** - componente editoriale e autorevole del brand.

Il simbolo orbitale non deve essere interpretato come un pianeta in senso letterale. È una metafora di **conoscenza in movimento attorno a una fonte**.

### 2.2 Primary lockup

Versione predefinita:

**[Orbital symbol] + Plinio**

Utilizzarla in:

- header del sito;
- cover e documenti ufficiali;
- presentazioni;
- social cover;
- materiali sales e marketing.

### 2.3 Symbol-only

Usare il simbolo senza wordmark per:

- favicon;
- app icon;
- avatar;
- elementi UI dove il brand è già evidente;
- spazi inferiori a quelli richiesti dal lockup completo.

### 2.4 Varianti consentite

1. **Horizontal full-color** - versione principale.
2. **Stacked full-color** - solo dove il formato è verticale/quadrato.
3. **Symbol-only full-color**.
4. **Monochrome light** - su fondi scuri o fotografici.
5. **Monochrome dark** - su fondi chiari.

Non creare nuove varianti locali del logo.

### 2.5 Clear space

Definire **x** come il diametro del nucleus centrale.

Mantenere almeno **1× x** di spazio libero su tutti i lati del logo completo e del simbolo.

Nessun testo, bordo, icona o elemento decorativo deve entrare in questa area.

### 2.6 Minimum size

Per garantire leggibilità:

- **Symbol-only:** minimo `24 × 24 px` in digitale.
- **Horizontal lockup:** minimo `120 px` di larghezza in digitale.
- Sotto queste dimensioni usare il symbol-only.

### 2.7 Logo don'ts

Non:

- stirare o deformare;
- ruotare arbitrariamente;
- cambiare proporzioni tra symbol e wordmark;
- sostituire i colori con gradienti casuali;
- aggiungere glow, bevel o ombre forti;
- inserire il logo dentro forme non previste;
- animare continuamente il logo nell'header;
- trasformare l'orbit in una decorazione complessa.

---

## 3. Color system

La palette è deliberatamente **calda**. Evitare il tipico linguaggio SaaS basato su blu elettrico, viola e gradienti AI.

### 3.1 Core palette

| Token | Hex | Ruolo |
|---|---:|---|
| **Warm Obsidian** | `#12100E` | background principale dark |
| **Deep Surface** | `#1A1715` | card e superfici elevate dark |
| **Parchment** | `#F7EFDD` | background light principale |
| **Terracotta** | `#D65527` | brand identity accent, focus, indicatori |
| **Action Primary** | `#C44B1E` | CTA primaria accessibile (WCAG AA > 4.8:1 con testo #FFFFFF) |
| **Bright Accent** | `#FF7547` | highlight ad alta priorità |
| **Soft Terracotta** | `#DE9379` | highlight testuali e bordi soft |
| **Verification Sage** | `#679A92` | verified, evidence, stato positivo |
| **Muted Sand** | `#9C8A78` | metadata e accenti neutri |

### 3.2 Color hierarchy

L'arancio è un **segnale di priorità**, non un colore decorativo.

Regola operativa:

> **Idealmente una sola area arancio dominante per viewport.**

Esempio hero:

1. headline/value proposition;
2. primary CTA;
3. product evidence;

Non rendere contemporaneamente headline, numeri, CTA, glow, bordi e icone tutti arancioni con lo stesso peso visivo.

### 3.3 Recommended usage

#### Warm Obsidian `#12100E`

Usare per:

- hero;
- sezioni di proof/evidence;
- product mockup;
- final CTA;
- footer.

#### Parchment `#F7EFDD`

Usare per:

- sezioni narrative;
- comparison;
- personas;
- blocchi esplicativi;
- documenti/editorial surfaces.

#### Terracotta `#D65527`

Usare per:

- primary CTA;
- elementi selezionati;
- indicatori di progresso;
- piccoli punti focali;
- brand mark.

#### Bright Accent `#FF7547`

Usare con parsimonia per:

- una parola/numero decisivo in headline;
- KPI prioritari;
- active state importante.

Non usarlo per lunghi testi.

#### Verification Sage `#679A92`

È un colore **semantico**, non decorativo.

Usarlo per:

- fonte verificata;
- evidence matched;
- validazione completata;
- status positivo.

### 3.4 Accessibility

Non assumere che un colore brand sia automaticamente adatto a testo e CTA.

Regole:

- **Warm Obsidian + Parchment:** combinazione principale ad alto contrasto.
- Su `#D65527` (terracotta brand), preferire testo **Warm Obsidian** per body-size quando serve conformità AA.
- Il bianco su `#D65527` non raggiunge 4.5:1 per testo normale. Per le **CTA primarie e i bottoni con testo bianco**, si adotta il token dedicato **`--pl-action-primary` (`#C44B1E`)**, che garantisce un contrasto di **> 4.8:1** (piena conformità WCAG AA), preservando il terracotta brand originale come identità.
- Su `#FF7547`, usare testo dark, non bianco.
- Su `#679A92`, usare testo dark per copy piccolo.
- Non affidare mai il significato solo al colore: stato e validazione devono avere anche icona/label.

---

## 4. Typography

Il sistema combina un'anima **editoriale** e una **operativa**.

### 4.1 Headline - Cormorant Garamond

**Uso:**

- H1;
- H2;
- grandi statement;
- brand wordmark quando applicabile.

**Carattere:** autorevole, editoriale, umano.

Indicazioni:

- peso consigliato: `600–700`;
- line-height: `1.05–1.15`;
- tracking leggermente negativo sulle grandi headline;
- evitare tutto maiuscolo.

### 4.2 Body / UI - Inter

**Uso:**

- paragrafi;
- CTA;
- navigazione;
- card;
- tabelle;
- UI applicativa.

Indicazioni:

- body standard: `16–18 px`;
- line-height: `1.5–1.65`;
- peso normale: `400–500`;
- enfasi: `600`, raramente `700`.

### 4.3 Metadata - Cutive Mono

**Uso limitato a:**

- source metadata;
- numerazione step;
- confidence/status;
- piccoli label tecnici;
- date e riferimenti;
- microcopy di sistema.

Non usare il mono per:

- paragrafi;
- CTA principali;
- lunghi label;
- titoli di sezione.

Il mono deve segnalare **evidenza o metadata**, non diventare un effetto estetico diffuso.

### 4.4 Type hierarchy

Indicazione desktop:

| Ruolo | Range |
|---|---:|
| Hero H1 | `52–58 px` |
| Section H2 | `36–44 px` |
| Card H3 | `22–26 px` |
| Lead | `18–20 px` |
| Body | `16–18 px` |
| Small | `14 px` |
| Metadata | `12–13 px` |

Su mobile usare scale responsive con `clamp()` e preservare sempre la gerarchia relativa.

---

## 5. Iconography

### 5.1 Principles

Le icone Plinio devono essere:

- **Geometric** - costruite con geometrie semplici.
- **Evidence-led** - rappresentano funzioni e stati reali, non metafore decorative.
- **Rounded precision** - angoli e terminali morbidi ma non cartoon.
- **Warm contrast** - ivory + terracotta, sage solo semanticamente.

### 5.2 Standard icon family

Il set base include:

1. Project
2. Sources
3. Opportunity Radar
4. Draft
5. Evidence
6. Approval
7. Feedback Loop
8. Search
9. Memory
10. Security
11. Export
12. Analytics

### 5.3 Stroke

- `24 px` icon → stroke circa `1.5 px`.
- `32 px` icon → stroke circa `2 px`.
- Usare `round` cap e join quando possibile.
- Evitare differenze di peso tra icone della stessa famiglia.

### 5.4 Corner radius

Scala raccomandata:

- `4 px` - subtle / piccoli componenti;
- `8 px` - standard UI;
- `12 px` - superfici più generose.

### 5.5 Accent usage

Default:

- struttura: ivory / neutral;
- singolo focus: terracotta;
- verified state: sage.

Non colorare ogni parte dell'icona.

### 5.6 Do / don't

**Do:**

- usare forme semplici;
- mantenere la stessa optical size;
- lasciare whitespace interno;
- usare un solo micro-accent;
- mantenere leggibilità a 24 px.

**Don't:**

- usare emoji;
- mischiare outline e 3D;
- usare icone stock con stili differenti;
- aggiungere gradienti casuali;
- usare glow su tutte le icone;
- rendere ogni capability “planetaria”.

---

## 6. Orbital visual language

L'orbit è una firma visiva del brand, ma deve restare **sottile**.

Può rappresentare:

- conoscenza che resta disponibile;
- connessione tra fonti;
- continuità del workflow;
- trasformazione da progetto a comunicazione.

### Uso corretto

- piccoli archi;
- dotted paths;
- nodi connessi;
- micro-motion lento;
- background decorative molto leggere;
- Opportunity Radar.

### Uso scorretto

- pianeti letterali in ogni sezione;
- animazioni continue invasive;
- grandi sistemi solari decorativi;
- metafore cosmiche che richiedono spiegazione;
- naming UI basato sulla metafora quando riduce la chiarezza.

> La metafora orbitale deve rafforzare il brand, non creare un nuovo modello mentale per l'utente.

---

## 7. UI visual language

### 7.1 General principle

**Less interface, more evidence.**

Il prodotto deve sembrare sofisticato perché è chiaro, non perché contiene molti effetti.

### 7.2 Surfaces

Preferire:

- flat surfaces;
- border sottili;
- pochissime ombre;
- differenza di luminanza tra livelli;
- radius moderati.

Evitare:

- glassmorphism pesante;
- gradienti decorativi ovunque;
- card dentro card dentro card;
- shadow forti su ogni elemento;
- glow come default state.

### 7.3 Primary button

Il primary button deve essere il principale punto d'azione della viewport.

Caratteristiche:

- background: `--pl-action-primary` (`#C44B1E`) con testo `#FFFFFF` (WCAG AA compliant);
- radius `6–8 px` (`--pl-radius-standard`);
- padding generoso;
- label concreta e orientata all'azione;
- eventuale freccia `→` come supporto, non come protagonista.

Esempi coerenti:

- `Provalo su un progetto →`
- `Crea opportunità →`
- `Approva e continua →`

### 7.4 Secondary action

Preferire:

- text-link;
- subtle underline;
- neutral outline.

La CTA secondaria non deve sembrare equivalente alla primaria.

### 7.5 Pills & metadata

Le pill sono appropriate per:

- fonti;
- stati;
- categorie;
- metadata brevi.

Non trasformare interi paragrafi in pill.

### 7.6 Evidence pattern

Quando il prodotto comunica affidabilità, visualizzare insieme:

1. **claim/fatto**;
2. **stato**;
3. **fonte**;
4. opzionalmente **confidence / riferimento**.

Esempio:

```text
✓ Evidence verified
Matched to source
Client Interview · 12 May 2026
```

Il verde/sage supporta il pattern, ma non sostituisce la label.

---

## 8. Layout & spacing

### 8.1 Content width

- Container principale: circa `1200 px` max.
- Paragrafi: non superare circa `60–70` caratteri per riga.
- Lead hero: più stretto del container totale.

### 8.2 Section spacing

Scala raccomandata:

- micro: `4–8 px`;
- component internal: `12–24 px`;
- block: `24–48 px`;
- section: `64–96 px` desktop.

Il whitespace è parte del brand.

### 8.3 Information density

Per ogni viewport chiedersi:

> **Qual è la prima cosa che l'occhio deve capire?**

Ridurre o de-enfatizzare tutto ciò che compete con quella risposta.

### 8.4 Alternating sections

Il contrasto dark/light può essere usato per creare ritmo:

- Dark → promessa / evidence / action.
- Light → spiegazione / comparison / personas.

Non alternare solo per decorazione: ogni cambio di background deve segnare un cambio di funzione narrativa.

---

## 9. Product visuals

Gli screenshot e mockup devono spiegare un workflow, non dimostrare quante feature esistono.

### 9.1 Primary product story

Il visual più importante di Plinio è:

**Project → Opportunities → Draft**

In italiano:

**Progetto → Opportunità → Prima bozza**

Deve essere comprensibile anche senza leggere microcopy.

### 9.2 Screenshot rules

- privilegiare 1–3 elementi importanti;
- aumentare dimensione delle informazioni decisive;
- evitare screenshot completi se diventano illeggibili;
- usare crop narrativi;
- evidenziare fonti e verificabilità;
- non inserire testo inferiore a una dimensione realmente leggibile nel contesto finale.

### 9.3 Motion

Motion consentito:

- reveal leggero;
- arrow/path progress;
- subtle orbit motion;
- hover di pochi pixel;
- feedback di stato.

Motion da evitare:

- floating costante di grandi componenti;
- pulse continuo su più elementi;
- parallax aggressivo;
- animazioni che competono con la CTA.

Rispettare sempre `prefers-reduced-motion`.

---

## 10. Landing page application

### 10.1 Hero hierarchy

La hero deve avere questa gerarchia visiva:

1. **Outcome** - cosa ottengo.
2. **Business reason** - perché conta.
3. **Product proof** - come appare concretamente.
4. **Primary CTA** - cosa faccio adesso.
5. **Micro-proof** - riduzione del rischio.

Non inserire più di 2–3 messaggi forti sopra la fold.

### 10.2 Hero visual target

L'occhio dovrebbe leggere in sequenza:

**3+ contenuti/opportunità → business impact → Project → Opportunities → Draft → CTA**

### 10.3 Proof points

Micro-proof appropriati:

- `30 min su una vostra fonte`
- `Nessuna migrazione IT`
- `Fonti sempre citate`

Devono essere visivamente secondari rispetto alla CTA.

### 10.4 Comparison

Desktop:

- tabella minimal;
- colonna Plinio chiaramente evidenziata;
- check / half / x;
- feature scritte come outcome.

Mobile:

- evitare una tabella larga da scorrere lateralmente come unica soluzione;
- preferire cards/rows verticali o confronto Plinio vs alternative con progressive disclosure.

---

## 11. Brand voice in the interface

L'interfaccia deve parlare in modo:

- diretto;
- concreto;
- verificabile;
- umano;
- senza hype AI.

Preferire:

- `3 opportunità individuate`
- `2 fonti collegate`
- `Claim verificato`
- `Manca una fonte per questa affermazione`

Evitare:

- `AI magic`
- `Supercharge your content`
- `Unleash your potential`
- `Revolutionary AI`
- copy generico da SaaS.

---

## 12. Brand asset naming

Struttura consigliata nel repository:

```text
src/assets/brand/
├── logo/
│   ├── plinio-logo-horizontal-light.svg
│   ├── plinio-logo-horizontal-dark.svg
│   ├── plinio-logo-stacked-light.svg
│   ├── plinio-symbol-color.svg
│   ├── plinio-symbol-light.svg
│   └── plinio-symbol-dark.svg
├── icons/
│   ├── project.svg
│   ├── sources.svg
│   ├── opportunity-radar.svg
│   ├── draft.svg
│   ├── evidence.svg
│   ├── approval.svg
│   ├── feedback-loop.svg
│   ├── search.svg
│   ├── memory.svg
│   ├── security.svg
│   ├── export.svg
│   └── analytics.svg
└── app-icon/
    ├── favicon.svg
    ├── favicon-32.png
    ├── apple-touch-icon.png
    └── app-icon-512.png
```

Per gli elementi di UI preferire **SVG**. PNG solo per asset che lo richiedono esplicitamente.

---

## 13. Design tokens

I token implementativi devono essere centralizzati; non introdurre colori hardcoded nei singoli componenti senza una ragione documentata.

Esempio:

```css
:root {
  --pl-warm-obsidian: #12100E;
  --pl-deep-surface: #1A1715;
  --pl-parchment: #F7EFDD;
  --pl-terracotta: #D65527;
  --pl-action-primary: #C44B1E;
  --pl-bright-accent: #FF7547;
  --pl-soft-terracotta: #DE9379;
  --pl-verification-sage: #679A92;
  --pl-muted-sand: #9C8A78;

  --pl-radius-subtle: 4px;
  --pl-radius-standard: 8px;
  --pl-radius-generous: 12px;
}
```

I nomi semantici sono preferibili a nomi legati alla posizione (`orange-1`, `orange-2`) quando il ruolo è stabile.

---

## 14. Design review checklist

Prima di approvare una nuova pagina o componente verificare:

- [ ] La gerarchia è comprensibile in meno di 5 secondi?
- [ ] C'è un solo primary action chiaramente dominante?
- [ ] L'arancio viene usato per priorità, non come decorazione diffusa?
- [ ] Il mono è limitato a metadata/evidence?
- [ ] Il layout ha abbastanza whitespace?
- [ ] Le card sono davvero necessarie o il contenuto può vivere senza contenitore?
- [ ] Gli elementi interattivi hanno stato hover, focus e active?
- [ ] Il contrasto è sufficiente?
- [ ] Lo stato non è comunicato solo tramite colore?
- [ ] Le icone appartengono alla stessa famiglia?
- [ ] Le fonti sono visivamente riconoscibili quando rilevanti?
- [ ] Il product visual mostra un outcome/workflow invece di una dashboard sovraccarica?
- [ ] La versione mobile è progettata, non solo ridotta?
- [ ] `prefers-reduced-motion` è rispettato?
- [ ] La metafora orbitale aiuta la comprensione anziché complicarla?

---

## 15. North star

Quando ci sono dubbi tra due soluzioni visuali, scegliere quella che rende Plinio:

> **più credibile, più leggibile e più immediato - non quella che sembra più “AI”.**

Il brand deve far percepire che Plinio non inventa contenuti: **fa emergere e rende comunicabile il valore già presente nel lavoro reale dell'azienda.**
