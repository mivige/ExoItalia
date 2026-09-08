# Exo Italia — nuovo sito

Brief operativo per Claude Code. Leggilo per intero prima di scrivere codice.

---

## 1. Contesto e obiettivi

Exo Italia è un'associazione no-profit fondata nel 2021 a Latina. Lavora contro l'esodo
giovanile involontario: mette in rete talenti (spesso expat) per creare opportunità nei
territori periferici. Sta nascendo una seconda sede in Molise.

Il sito attuale è su Wix (~400 €/anno). Lo rifacciamo in codice.

**Obiettivi, in ordine di priorità:**

1. **Costo zero di hosting.** GitHub Pages, repo pubblico, deploy via GitHub Actions.
2. **HTML statico pre-renderizzato.** Ogni pagina deve esistere come file `.html` completo
   dopo il build. Niente contenuti iniettati lato client: nessun fetch di markdown o JSON a
   runtime, nessun rendering di testo via JavaScript. Se disabiliti JS nel browser, il sito
   deve essere leggibile al 100%.
3. **Manutenibile da una persona sola.** Chi mantiene il sito è l'unico tecnico del team.
   Tutto ciò che cambia spesso (partner, team, news, numeri, contatti) deve stare in file di
   dati separati dal markup, modificabili dall'editor web di GitHub senza toccare codice.
4. **Scalabile alle sedi locali.** Latina e Molise oggi, altre domani. Aggiungere una sede
   deve significare aggiungere **un solo file**, non duplicare una pagina.

Il dominio cambia rispetto all'attuale: **non serve nessuna logica di redirect o
preservazione di URL storici.** Il dominio definitivo non è ancora deciso — usa il
placeholder `https://ESEMPIO.exoitalia.it` e centralizzalo in `src/data/site.yml` +
`astro.config.mjs` così si cambia in due punti.

---

## 2. Stack

- **Astro 5**, TypeScript, output statico (default).
- **Tailwind CSS v4** via `@tailwindcss/vite`, con tutti i token definiti in un unico
  blocco `@theme` in `src/styles/global.css`. Nessun valore arbitrario sparso nei componenti
  per colori, font e spaziature: se ti serve un valore nuovo, aggiungilo ai token.
- **Content Collections** con schemi zod (`src/content.config.ts`) per news e sedi.
- `@astrojs/sitemap` per la sitemap.
- **Font self-hosted** via `@fontsource-variable/*`. Mai `<link>` a Google Fonts: privacy,
  performance e un requisito in meno per il banner cookie.
- Nessun framework UI (no React/Vue/Svelte). Se serve interattività — menu mobile,
  eventuale filtro news — usa `<script>` vanilla nel componente Astro.

**Non usare:** CMS headless esterni, database, funzioni serverless, analytics con cookie,
librerie di animazione, jQuery, CDN di terze parti.

---

## 3. Struttura del repo

```
.github/workflows/deploy.yml
public/
  images/                  # foto reali, quando arriveranno
  favicon.svg
  robots.txt
  CNAME                    # TODO: dominio definitivo
src/
  components/              # Header, Footer, Hero, PartnerGrid, TeamCard,
                           # SedeCard, NewsCard, Placeholder, Seo, JsonLd
  content/
    news/                  # una news = un .md
    sedi/                  # una sede = un .md   ← latina.md, molise.md
  data/
    site.yml               # dominio, contatti, indirizzo, social, email
    team.yml               # consiglio direttivo
    partners.yml           # partner e sostenitori
    stats.yml              # i numeri della home
  layouts/
    Base.astro
  pages/
    index.astro
    chi-siamo.astro
    attivita.astro
    sedi/index.astro
    sedi/[slug].astro
    news/index.astro
    news/[slug].astro
    contatti.astro
    trasparenza.astro
    404.astro
  styles/global.css
  content.config.ts
docs/
  design-plan.md           # lo scrivi tu alla milestone M1
CONTENT.md                 # guida per il team non tecnico
```

### Mappa URL

| URL | Pagina |
|---|---|
| `/` | Home |
| `/chi-siamo` | Storia, missione, consiglio direttivo |
| `/attivita` | Le tre attività in dettaglio |
| `/sedi` | Indice delle sedi locali |
| `/sedi/latina`, `/sedi/molise` | Pagine sede, generate da `[slug].astro` |
| `/news`, `/news/{slug}` | News ed eventi |
| `/contatti` | Contatti + form |
| `/trasparenza` | Statuto, bilanci, contributi pubblici |

---

## 4. Modello dei contenuti

Gli schemi zod sono la protezione principale: se qualcuno del team salva un file malformato,
**il build deve fallire con un errore leggibile** invece di pubblicare una pagina rotta.
Scrivi messaggi d'errore espliciti dove zod lo permette.

### `src/content/sedi/{slug}.md`

```yaml
---
nome: "Exo Latina"                    # required
citta: "Latina"                       # required
regione: "Lazio"                      # required
stato: "attiva"                       # "attiva" | "in-avvio"
annoAvvio: 2021                       # required
ordine: 1                             # ordinamento in /sedi
claim: "Dove tutto è iniziato."       # max 80 caratteri
sommario: "..."                       # 1-2 frasi, usata nelle card e nella meta description
email: "latina@exoitalia.it"
copertina: "/images/sedi/latina.jpg"  # opzionale: se assente usa <Placeholder>
copertinaAlt: "..."                   # required se copertina è presente
referenti:                            # opzionale
  - nome: "..."
    ruolo: "..."
    linkedin: "..."
attivita:                             # opzionale, elenco locale
  - titolo: "..."
    descrizione: "..."
social:                               # opzionale
  instagram: "..."
---

Corpo markdown: la storia della sede, i progetti, i partner locali.
```

`sedi/[slug].astro` deve gestire con eleganza i campi opzionali assenti: se `referenti` è
vuoto la sezione **non si renderizza**, non compare un titolo con sotto il nulla. Questo è
importante perché la scheda Molise nascerà quasi vuota.

### `src/content/news/{YYYY-MM-DD}-{slug}.md`

Campi: `titolo`, `data` (date), `sommario` (max 200 char), `copertina` + `copertinaAlt`
(opzionali), `sede` (enum: `latina` | `molise` | `nazionale`), `bozza` (boolean, default
false → le bozze non vengono buildate).

Le news sono poche (qualcuna l'anno). Non costruire archivi per anno, tag, paginazione o
ricerca: una lista in ordine cronologico inverso, con RSS. Se `/news` è vuota, mostra uno
stato vuoto sensato ("Stiamo preparando i prossimi appuntamenti") e **nascondi la voce dal
menu principale** finché non c'è almeno una news.

### `src/data/*.yml`

`partners.yml` — ogni voce: `nome`, `logo`, `url`, `tipo` (`partner` | `sostenitore` |
`patrocinio`). `team.yml` — `nome`, `ruolo`, `foto`, `bio`, `email`, `linkedin`.
`stats.yml` — `valore`, `etichetta`, `nota` opzionale.

Valida anche questi con zod tramite una `file()` loader collection.

---

## 5. Direzione di design

**Prima di scrivere CSS, alla milestone M1, produci `docs/design-plan.md`:** palette in 4-6
hex nominati, scelta tipografica con i ruoli, concept di layout con wireframe ASCII, e 3-4
principi guida specifici per questo progetto. Poi rileggilo criticamente: se una parte
sembra quello che produrresti per un'associazione no-profit qualsiasi, cambiala e scrivi
cosa hai cambiato e perché. Solo dopo inizia a costruire.

### Vincoli e proposte

**Colori.** Il logo esiste già (`public/images/logo_exo.png`):
**la palette definitiva si deriva dal logo**, un verde profondo come colore istituzionale, carta quasi bianca,
un solo accento di segnale:

```
--color-verde   #0E3B31   superfici scure, testo, header
--color-carta   #FBFAF7   sfondo pagina
--color-segnale #86bd60   un solo accento: CTA, link, dettagli
--color-pietra  #C9C3B6   bordi, divisori, stati disabilitati
--color-nebbia  #EEEBE4   sezioni alternate
```

L'accento è **uno solo** e va usato con parsimonia: se compare su ogni card ha smesso di
segnalare qualcosa. Verifica il contrasto: minimo AA su tutti gli accostamenti testo/sfondo,
e l'arancio su carta non basta per testo piccolo — usalo su fondo scuro o per superfici.

**Tipografia.** Due famiglie, chiaramente distinte:
- Titoli: `Bricolage Grotesque` (variable) — ha carattere senza essere decorativa.
- Testo: `Atkinson Hyperlegible` — nata per la leggibilità, coerente con una missione
  sociale.

Se in fase di design-plan trovi un accoppiamento più giusto per il progetto, proponilo e
motivalo. Evita Inter, Poppins, Montserrat e Playfair: sono i default riconoscibili.

Scala tipografica coerente e dichiarata nei token. Righe di testo sotto gli 80 caratteri.

**Da evitare** (sono i segni riconoscibili di una pagina generata):
- eyebrow in maiuscoletto spaziato sopra ogni titolo;
- una singola parola del titolo colorata o in corsivo;
- tutto tagliato in card identiche con lo stesso border-radius e la stessa ombra grigia;
- marcatori numerati `01 / 02 / 03` su contenuti che non sono una sequenza;
- una freccia `→` appiccicata al testo di ogni link;
- animazione fade-and-slide-up su ogni sezione allo scroll.

**Movimento.** Al massimo un momento orchestrato, nell'hero. Tutto il resto statico. Rispetta
`prefers-reduced-motion`.

**Hero.** Non la foto a tutta larghezza con titolo centrato sopra: è quello che ha già Wix.
Il concetto forte del progetto è **l'inversione di una rotta** — persone che sono partite e
tornano a costruire dove sono nate. Proponi un trattamento che parta da lì, con la tipografia
come elemento attivo e non come veicolo neutro del testo. Se dopo il design-plan resti
convinto che la foto sia la scelta giusta, va bene, ma deve essere una decisione argomentata.

**Qualità di base, non negoziabile:** responsive fino a 360px, focus da tastiera sempre
visibile, `lang="it"`, gerarchia degli heading corretta (un solo `<h1>` per pagina), `alt`
obbligatorio su ogni immagine (rendilo required nello schema zod), tap target ≥44px.

---

## 6. Immagini placeholder

Non ci sono ancora foto definitive. Non usare servizi esterni tipo placehold.co: crea un
componente `<Placeholder>` che renderizza un blocco con il rapporto d'aspetto corretto, un
fondo neutro dai token e l'etichetta di cosa dovrà andarci.

```astro
<Placeholder ratio="3/2" label="Exodus Community — incontro annuale" />
```

Il blocco deve occupare esattamente lo spazio dell'immagine finale, così sostituire i
placeholder non ricalcola il layout.

Alla fine, in `CONTENT.md`, elenca **tutti gli slot immagine** con formato e proporzione
richiesti: è la lista della spesa per il team che deve raccogliere il materiale.

---

## 7. Contenuti

**Regola ferma: non inventare fatti.** Numeri, date, nomi, importi e attività che non trovi
qui sotto vanno marcati `{/* TODO: da confermare */}` nel codice e raccolti in un elenco
finale. Meglio una sezione vuota con un TODO che una frase plausibile e falsa — questo è il
sito di un'associazione che riceve fondi pubblici.

### Home

**Hero**
> L'innovazione contro l'esodo
> Un'Italia in cui l'innovazione illumina ogni luogo, fatta di territori che invitano a restare.

CTA primaria: `Entra nella community` → `/contatti`. Secondaria: `Scopri chi siamo` →
`/chi-siamo`. *(Nel sito attuale questo secondo pulsante punta per errore alla home stessa.)*

**Cosa facciamo** — tre blocchi, rimando a `/attivita`:
- *Exodus Community* — Trasformiamo il brain-drain in brain-gain: mettiamo in rete expat di
  talento per far crescere le loro terre d'origine.
- *Progetti nelle scuole* — Portiamo cultura imprenditoriale tra i banchi, perché la crescita
  di un territorio nasce dall'istruzione e dall'autoimprenditorialità.
- *Eventi* — Organizziamo occasioni in cui le visioni diventano azione, nelle aree periferiche.

**I numeri** — da `stats.yml`. Nel sito attuale numeri ed etichette sono disallineati; questi
sono i valori corretti, **da far riconfermare al team prima della pubblicazione**:
`2021 Anno di fondazione` · `150 Membri della community` · `30 Volontari` ·
`600 Studenti raggiunti`.

**Le sedi** — nuova sezione, due card da `src/content/sedi/`, link a `/sedi/{slug}`. Deve
reggere graficamente anche con una sede sola o con quattro.

**Partner** — griglia loghi da `partners.yml`, ciascuno linkato. Loghi in scala di grigi che
diventano a colori all'hover **solo se** i loghi originali lo reggono; altrimenti lasciali
com'è. *(Nel sito attuale TEDx Lago di Fogliano compare due volte e c'è anche il logo di Exo
stesso: nella lista qui sotto è già corretto.)*

**CTA finale** — verso `/contatti`.

### Chi siamo

**La nostra storia**
> Exo Italia è un progetto collettivo nato nel 2021 a Latina, dalla visione condivisa di
> persone che si erano trasferite in altre città italiane e straniere per studiare e
> lavorare. Oggi stiamo costruendo community analoghe in altri territori dove l'esodo
> giovanile involontario è una sfida quotidiana. L'obiettivo è sempre lo stesso: unire
> talenti e risorse per creare prospettive dove servono di più.

**Come lavoriamo** — tre punti (non numerarli, non sono una sequenza):
- *Collaborazioni* — Costruiamo alleanze con no-profit e aziende che condividono i nostri valori.
- *Competenze diverse* — Il nostro team mette insieme percorsi complementari: è così che
  affrontiamo ogni problema da più angoli.
- *Responsabilità* — Misuriamo l'effetto di quello che facciamo sulle persone e sui territori,
  e lo rendiamo pubblico.

**La nostra missione**
> Creare opportunità dove l'esodo giovanile le ha ridotte. Lo facciamo con progetti
> innovativi e sostenibili, insieme a chi quei territori li vive.

**Consiglio direttivo** — da `team.yml`. Dati reali:

| Nome | Ruolo | Email | LinkedIn |
|---|---|---|---|
| Lorenzo Di Filippo | Presidente | lorenzo.difilippo@exoitalia.it | /in/lorenzodifilippo/ |
| Francesco Pappone | Vice Presidente | francesco.pappone@exoitalia.it | /in/francesco-pappone-914b51197/ |
| Federico Califano | Segretario | federico.califano@exoitalia.it | /in/federicocalifano/ |
| Carlo Francesco Porcelli | Tesoriere | carlofrancesco.porcelli@exoitalia.it | /in/carlo-francesco-porcelli-b03300188/ |
| Niccolò Di Filippo | Membro del consiglio direttivo | niccolo.difilippo@exoitalia.it | /in/niccolò-di-filippo-0467901a2/ |

Bio (accorciate rispetto al sito attuale, una frase su percorso + una su ruolo attuale):

- **Lorenzo Di Filippo** — Laureato in Physics of Complex Systems al Politecnico di Torino e
  Senior Allievo del Collegio Carlo Alberto. Risk Analyst nel Global Risk Management di ENEL.
  Presidente di Exo dal 2020.
- **Francesco Pappone** — Fisica a Bologna e Ingegneria Matematica al Politecnico di Torino,
  allievo dell'Alta Scuola Politecnica XVIII. Fellow del Collège des Ingénieurs e CEO di AiSparks.
- **Federico Califano** — Ingegneria Meccanica alla Sapienza e Collegio Universitario
  Lamaro-Pozzani. Dottorando in Meccanica Teorica e Applicata, CTO di AiSparks.
- **Carlo Francesco Porcelli** — Economia e Management alla LUISS Guido Carli. Head of Sales
  in JELU Consulting; nel 2023 ha cofondato TraynMe a Tallinn.
- **Niccolò Di Filippo** — Economia e Management alla LUISS Guido Carli. CMO di AiSparks,
  segue tecnologia e startup.

Nel sito attuale la home ha una griglia di 14 foto del team **senza un nome né un ruolo**:
non riproporla. I profili stanno qui, con nome e ruolo.

### Attività

Le tre attività della home, sviluppate. Per ciascuna: cos'è, a chi si rivolge, cosa è
successo finora `{/* TODO: esempi concreti dal team */}`, come partecipare.

### Sedi

`/sedi` — indice breve: una frase di introduzione più le card. Testo introduttivo:
> Exo cresce per territori. Ogni sede è un gruppo locale autonomo che lavora sul proprio
> contesto, dentro una rete nazionale che condivide metodo, contatti e progetti.

**`sedi/latina.md`** — sede storica, attiva dal 2021.
Claim: *Dove tutto è iniziato.*
Sommario: *La prima community Exo, nata nel 2021 nel capoluogo pontino.*
Corpo: origine dell'associazione, Exodus Community, i progetti nelle scuole del territorio,
gli eventi. `{/* TODO: elenco progetti e referenti locali */}`
Da citare qui (oggi è sepolto in un paragrafo della home): il progetto **Latina Innovation
Community**, finanziato con **21.200 €** dal bando *Vitamina G* nell'ambito del programma
*GenerAzioniGiovani.it*, Politiche Giovanili della Regione Lazio con il sostegno del
Dipartimento per la Gioventù, a favore di *Associazione Giovanile Exo Latina* (C.F.
91170700594), erogato da *Regione Lazio* (C.F. 80143490581).

**`sedi/molise.md`** — `stato: in-avvio`. Non conosciamo i dettagli: crea il file con la
struttura completa, contenuto minimo e `{/* TODO */}` ovunque serva. La pagina deve essere
dignitosa anche così: una spiegazione di cosa significa "sede in avvio" e una CTA forte per
chi vuole partecipare alla nascita del gruppo. `annoAvvio`, referenti, email e attività: TODO.

### Contatti

Sede legale: Via Francesco Caffi, 42 — 04100 Latina (LT). Tel. +39 380 383 7273.
info@exoitalia.it. Instagram `@exo_italia_official`, LinkedIn `/company/exoitalia`.

Il sito attuale ha solo un `mailto:`. Metti un **form vero** — Web3Forms o Formspree, entrambi
hanno un free tier che funziona su siti statici e usano una access key pubblica (nessun
segreto nel repo). Campi: nome, email, motivo del contatto (select: *entrare nella
community* / *proporre una collaborazione* / *scuole e docenti* / *stampa* / *altro*),
messaggio, consenso privacy con link alla policy. Mantieni il `mailto:` come alternativa
visibile. Gestisci esplicitamente gli stati di errore e di invio riuscito.

### Trasparenza

Pagina nuova. Exo riceve contributi pubblici, e la L. 124/2017 richiede di darne pubblicità
sopra i 10.000 €: oggi l'informazione c'è ma è annegata nella home. Struttura la pagina con
statuto, bilanci e un elenco dei contributi pubblici ricevuti (anno, ente, importo, progetto),
partendo dal contributo Regione Lazio descritto sopra. Documenti e bilanci: `{/* TODO */}`.
Aggiungi una nota nel TODO finale: **far verificare i contenuti obbligatori a chi segue
l'amministrazione dell'associazione**, perché dipendono dalla forma giuridica.

### Footer

Logo, sede legale, contatti, social, link a Privacy e Cookie Policy Iubenda (già attive:
`https://www.iubenda.com/privacy-policy/11896394` e `.../cookie-policy`), C.F. Copyright con
**anno dinamico** — il sito attuale è fermo a "© 2023".

### Partner (per `partners.yml`)

| Nome | URL |
|---|---|
| AI Sparks | http://aisparks.it |
| Technoscience | https://www.technoscience.it/ |
| ToBe Srl | https://tobe-srl.it/ |
| TEDx Lago di Fogliano | https://www.tedxlagodifogliano.com/ |
| Open Hub Lazio | https://openhublazio.it/ |
| Lazio Innova | https://www.lazioinnova.it/ |
| Virgilio 2080 | https://www.virgilio2080.it/ |
| The Space Coworking | https://www.thespacecoworking.website/ |
| Foooball | https://foooball.com/it |

I loghi vanno recuperati dal sito attuale o richiesti ai partner; nel frattempo `<Placeholder>`.

---

## 8. SEO e metadati

Dominio nuovo, quindi si parte da zero: nessun redirect, nessuna mappatura di URL storici.

- Componente `<Seo>` obbligatorio in `Base.astro`: `title`, `description` (150-160 caratteri,
  **diversa per ogni pagina**), canonical assoluto, `og:title`, `og:description`, `og:image`,
  `og:locale=it_IT`, `twitter:card=summary_large_image`.
- Pattern title: `{Pagina} — Exo Italia`. Home: `Exo Italia — L'innovazione contro l'esodo
  giovanile`. Non `Home | Exo Italia` come oggi.
- JSON-LD: schema `NGO` in home (nome, logo, indirizzo, email, telefono, `sameAs` verso
  Instagram e LinkedIn), `NewsArticle` sulle news, `BreadcrumbList` sulle sedi.
- `@astrojs/sitemap` + `robots.txt` che punta alla sitemap. RSS su `/news/rss.xml`.
- OG image: una statica di default, più una per sede quando ci saranno le foto.
- Analytics: **senza cookie** (Cloudflare Web Analytics, Plausible o Umami). Non aggiungere
  GA4. Motivo: senza cookie di profilazione il banner non serve e il sito resta pulito.

---

## 9. Deploy

`.github/workflows/deploy.yml`: trigger su push a `main` e `workflow_dispatch`, Node 22,
`npm ci && npm run build`, `actions/upload-pages-artifact` + `actions/deploy-pages` con i
permessi `pages: write` e `id-token: write`.

Aggiungi un secondo workflow che gira **solo il build** sulle pull request: serve a impedire
che un file YAML sbagliato dal team finisca in produzione.

`astro.config.mjs`: imposta `site` con il dominio definitivo (necessario per canonical e
sitemap). File `public/CNAME` con il dominio. Il repo deve restare pubblico: GitHub Pages non
è gratuito su repo privati.

Attenzione al peso: Pages ha un limite di ~1 GB per repo. Comprimi ogni immagine prima del
commit e documentalo in `CONTENT.md`.

---

## 10. `CONTENT.md` — la guida per il team

Deliverable a sé, scritto per qualcuno che non ha mai usato Git. Deve coprire, con screenshot
testuali dei passaggi:

1. Aggiungere o rimuovere un partner (`partners.yml`, con esempio commentato da copiare).
2. Aggiungere una news (nome del file, campi del frontmatter, come caricare l'immagine).
3. Aggiornare i numeri della home.
4. Aggiornare una scheda sede.
5. Cosa fare se il deploy fallisce: dove si vede l'errore nella tab Actions, e la regola
   d'oro — se il build fallisce, **il sito online resta quello di prima**, non si è rotto niente.
6. L'elenco degli slot immagine con proporzioni e peso massimo.

---

## 11. Come procedere

Lavora a milestone, una alla volta. Alla fine di ognuna: `npm run build` deve passare pulito.

- **M0** — Scaffold Astro + Tailwind + fontsource, token, layout base, workflow di deploy.
  Verifica subito che il deploy su Pages funzioni con una pagina vuota: sistemare l'idraulica
  alla fine è sempre peggio.
- **M1** — `docs/design-plan.md`, con la revisione critica descritta al §5. **Fermati e fammi
  vedere il piano prima di costruire.**
- **M2** — Header, Footer, Home.
- **M3** — Chi siamo, Attività.
- **M4** — Content collection sedi, `/sedi`, `/sedi/[slug]`, schede Latina e Molise.
- **M5** — News (lista, dettaglio, RSS, stato vuoto), Contatti con form, Trasparenza, 404.
- **M6** — SEO, JSON-LD, accessibilità, performance. Obiettivo Lighthouse ≥95 su tutte e
  quattro le voci. Verifica il contrasto colore e la navigazione da sola tastiera.
- **M7** — `CONTENT.md` e l'elenco finale dei TODO.

**Regole di lavoro:**

- Commit piccoli, in italiano, uno per unità logica di lavoro.
- Se un'informazione manca, chiedi o marcala TODO. Non colmare i vuoti a intuito.
- Non aggiungere dipendenze non elencate al §2 senza dirmelo prima.
- Prima di dichiarare finita una milestone, rileggi il risultato contro questo brief e dimmi
  cosa hai deciso diversamente e perché.
- Alla fine, consegna in un unico messaggio: **l'elenco completo dei TODO** (informazioni da
  raccogliere, immagini da fornire, dati da confermare) e i **passi manuali** che restano a me
  (DNS, dominio, access key del form, chiave analytics).