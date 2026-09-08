# Design plan — Exo Italia

M1. Scritto prima di toccare CSS o componenti. Contiene la palette, la
tipografia, il concept di layout con wireframe, i principi guida, e infine
una rilettura critica con quello che ho cambiato e perché.

---

## 1. Palette

Il logo (`public/images/logo_exo.png`) è un anello aperto con un nodo: un
gradiente che va da un verde chiaro (~in alto a sinistra) a un verde
profondo (a destra), un puntino pieno appoggiato sull'anello, "EXO" in nero
pieno e "ITALIA" spaziato sotto. Nessun arancio, nessun colore terzo: solo
i due estremi del verde, nero e bianco. La palette del brief è coerente con
questo — la confermo, con un correttivo sul contrasto (vedi §5.1).

| Token | Hex | Uso |
|---|---|---|
| `--color-verde` | `#0E3B31` | superfici scure, testo su carta, header/footer |
| `--color-carta` | `#FBFAF7` | sfondo pagina |
| `--color-segnale` | `#86BD60` | **unico** accento — CTA, link attivi, il nodo dell'hero |
| `--color-pietra` | `#C9C3B6` | bordi, divisori, stati disabilitati |
| `--color-nebbia` | `#EEEBE4` | sezioni alternate, sfondo card |

Contrasti verificati (WCAG 2.1, formula relative-luminance):

- `verde` su `carta`: **11.9:1** — AAA, uso libero per testo di qualsiasi corpo.
- `carta` su `verde`: **11.9:1** — AAA, uso libero (header/footer scuri).
- `verde` su `nebbia`: **10.5:1** — AAA.
- `segnale` su `carta`: **2.1:1** — **fallisce AA anche per testo grande.**
  Non usare `segnale` come colore di testo su `carta` o `nebbia`, mai. Va
  bene per bordi, icone, riempimenti decorativi, o per il nodo animato
  dell'hero (che non è testo).
- `segnale` su `verde`: **5.6:1** — passa AA per testo normale. Il verde
  scuro è l'unica superficie su cui il segnale può portare testo (es. un
  link evidenziato dentro un blocco scuro, o un badge "attiva" nelle sedi).

Uso dell'accento: **una sola cosa alla volta per sezione.** Se in una
pagina compare già su una CTA, non ricompare su un bordo decorativo nella
stessa sezione. Deve restare raro per restare un segnale.

---

## 2. Tipografia

- **Titoli — Bricolage Grotesque Variable.** Ha delle geometrie leggermente
  irregolari nelle giunzioni che le danno carattere senza scadere nel
  decorativo; regge bene sia i display size dell'hero sia gli h3 piccoli
  delle card, grazie agli assi variabili (peso e opsz).
- **Testo — Atkinson Hyperlegible.** Nata per la leggibilità (Braille
  Institute), lettere disambiguate (I / l / 1, O / 0). Coerente con una
  missione sociale che si rivolge anche a chi legge in condizioni non
  ideali — da telefono, genitori, funzionari pubblici che valutano un
  bilancio. Confermo la scelta del brief: non vedo un accoppiamento più
  giusto per questo contesto specifico.

Pesi: titoli usano la variabile su 480 (regular-ish, testo lungo come H2 di
sezione) e 650 (headline hero, H1 pagina). Testo usa 400 e 700 (Atkinson non
è variabile, solo questi due pesi + corsivo 400 sono disponibili via
fontsource).

### Scala

Scala dichiarata (non arbitraria nei componenti), rem-based, un solo salto
importante tra mobile e desktop sui ruoli display/h1:

| Ruolo | Mobile | Desktop | Font | Peso |
|---|---|---|---|---|
| `display` (hero) | 2.5rem / 1.1 | 4.5rem / 1.05 | titoli | 650 |
| `h1` | 2rem / 1.15 | 2.75rem / 1.15 | titoli | 650 |
| `h2` | 1.5rem / 1.2 | 2rem / 1.2 | titoli | 600 |
| `h3` | 1.25rem / 1.3 | 1.375rem / 1.3 | titoli | 600 |
| `body-lg` | 1.125rem / 1.6 | 1.25rem / 1.6 | testo | 400 |
| `body` | 1rem / 1.6 | 1rem / 1.6 | testo | 400 |
| `small` | 0.875rem / 1.5 | 0.875rem / 1.5 | testo | 400 |

Container di testo a **65ch** max-width (sotto gli 80 caratteri richiesti,
con margine per non essere al limite su font larghi come Atkinson).

---

## 3. Concept di layout

### 3.1 Principio guida dell'hero: l'inversione di rotta

Non foto a piena larghezza con titolo sopra (quello è Wix). Il logo
suggerisce già la metafora giusta: un **anello aperto con un nodo che lo
percorre** — un'orbita, un percorso che parte e può tornare. È esattamente
"l'esodo che si inverte in ritorno."

Trattamento: un arco sottile (lo stesso raggio/gesto del logo, non un
cerchio chiuso — un arco aperto, come un tratto di orbita) attraversa
l'hero da un bordo all'altro, dietro/accanto al testo. Un nodo pieno color
`segnale` parte da un'estremità dell'arco, lo percorre verso l'esterno e
poi curva indietro fino a fermarsi vicino al testo — un solo movimento,
orchestrato, ~2.5s, **al caricamento e una volta sola** (non in loop, non
legato allo scroll). È realizzato in CSS puro (`@keyframes` su un
`<path>`/nodo SVG), quindi non richiede JavaScript e il testo dell'headline
resta markup normale, leggibile e indicizzabile a JS disattivato. Con
`prefers-reduced-motion: reduce` il nodo si ferma nella posizione finale
senza animare.

Il titolo resta testo normale (niente parole colorate, niente corsivo
isolato): è l'arco a fare il lavoro visivo, non la tipografia deformata.

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Header: logo · Chi siamo · Attività · Sedi · (News) · Contatti]    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│     ╭──────╮                                                         │
│    ╱        ╲                        L'innovazione                  │
│   │      •┄┄┄┼┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄▶  contro l'esodo                 │
│    ╲        ╱                                                        │
│     ╰──────╯      Un'Italia in cui l'innovazione illumina ogni       │
│   (arco, sfondo)   luogo, fatta di territori che invitano a restare. │
│                                                                        │
│                    [Entra nella community]   Scopri chi siamo →      │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

Su mobile l'arco si comprime in un tratto verticale corto dietro al titolo,
non sparisce: resta un elemento di continuità col logo su ogni breakpoint.

### 3.2 Corpo pagina — evitare la griglia di card identiche

"Cosa facciamo" (home) e "Come lavoriamo" (chi siamo) sono **tre voci non
numerate e non in sequenza**: niente `01 / 02 / 03`, niente tre card
uguali con stessa ombra. Le tratto come una riga asimmetrica: un blocco più
largo (con un accenno di illustrazione o citazione), due più stretti,
separati da un filo (`border` sottile in `pietra`) invece che da ombre.

```
┌───────────────────────────┬─────────────────┬─────────────────┐
│ Exodus Community           │ Progetti nelle   │ Eventi           │
│ (blocco largo, 2 colonne)  │ scuole           │                  │
│                             │                  │                  │
│ Trasformiamo il brain-     │ Portiamo cultura │ Organizziamo     │
│ drain in brain-gain...     │ imprenditoriale  │ occasioni in cui │
│                             │ tra i banchi...  │ le visioni...    │
└───────────────────────────┴─────────────────┴─────────────────┘
```

### 3.3 Numeri (home)

Non tile identiche con icona sopra (altro cliché). Riga tipografica: numeri
grandi in `titoli`, etichetta piccola sotto in `testo`, allineati su una
riga con divisori verticali sottili (`pietra`), niente sfondo colorato per
tile.

```
   2021              150               30               600
   Anno di      Membri della      Volontari       Studenti
   fondazione     community                        raggiunti
```

### 3.4 Sedi, partner, team

- **Sedi**: due (poi più) card larghe orizzontali (non quadrate), foto/
  placeholder a sinistra, contenuto a destra — deve reggere anche con una
  card sola senza sembrare orfana (max-width contenuta, non full-bleed).
- **Partner**: griglia semplice di loghi, grayscale di base; niente card
  attorno ai loghi (sarebbe l'ennesima griglia di riquadri uguali) — solo i
  loghi su sfondo `nebbia`, spaziati, ciascuno linkato.
- **Team** (chi siamo): non la griglia di 14 foto senza nome del sito
  attuale. Lista a righe (non card a griglia): foto piccola, nome, ruolo e
  bio su un'unica riga larga che si impila su mobile — dà peso a chi sono,
  non le riduce a un'icona intercambiabile.

### 3.5 Pagina interna generica (sede, attività, trasparenza)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Header]                                                             │
├──────────────────────────────────────────────────────────────────────┤
│  Claim breve (h1)                                                     │
│  Sommario in body-lg, max 65ch                                        │
├──────────────────────────────────────────────────────────────────────┤
│  [Copertina o Placeholder, ratio dichiarato]                          │
├──────────────────────────────────────────────────────────────────────┤
│  Corpo markdown (65ch, testo)             │  Sidebar opzionale:       │
│                                             │  referenti / dati rapidi │
│                                             │  (si nasconde se assente)│
└──────────────────────────────────────────────────────────────────────┘
```

Sezioni con campi opzionali assenti (es. `referenti` su Molise) collassano
del tutto — niente titolo orfano sopra il vuoto.

---

## 4. Principi guida (specifici per questo progetto)

1. **L'arco è l'unico elemento grafico ricorrente**, non decorativo. Compare
   nell'hero (animato) e, in forma statica e minima, come separatore prima
   della CTA finale di ogni pagina lunga. Non lo uso come bullet, non lo
   metto su ogni card: se è ovunque perde significato quanto l'eyebrow che
   voglio evitare.
2. **Il verde scuro porta peso istituzionale, il verde chiaro porta
   attenzione — mai il contrario.** Sezioni scure (`verde` di sfondo) sono
   rare e segnano un cambio di registro (footer, CTA finale, badge "sede
   attiva"); il resto della pagina resta su `carta`/`nebbia`.
3. **Le persone hanno nome prima che la sezione abbia un'estetica.** Team e
   referenti di sede si presentano come elenco leggibile, non come mosaico
   di ritratti — coerente col fatto che il sito attuale li anonimizzava e
   il brief chiede esplicitamente il contrario.
4. **Un solo momento animato per pagina, mai in loop, sempre disattivabile.**
   Se una sezione "ha bisogno" di animazione per reggere, il problema è nel
   layout, non nell'animazione mancante.

---

## 5. Rilettura critica

Riletto il piano contro il brief (§5) chiedendomi: cosa qui sembrerebbe
prodotto per un no-profit qualsiasi?

### 5.1 Il colore "arancio" del brief non esiste nella palette dichiarata

Il brief include la frase *"l'arancio su carta non basta per testo
piccolo — usalo su fondo scuro o per superfici"* ma l'unico accento
definito nei token è `--color-segnale: #86bd60`, che è verde, non arancio
— quasi certamente un residuo di una bozza precedente della palette. Non
ho un arancio da validare: ho preso la sostanza dell'avvertimento (quel
tipo di accento chiaro fallisce il contrasto su fondo chiaro) e l'ho
verificata sul colore che esiste davvero — vedi la tabella in §1. Il
risultato pratico è lo stesso che il brief intendeva: l'accento chiaro
vive su fondo scuro o come superficie non testuale, mai come testo su
`carta`.

### 5.2 Il primo giro dell'hero era troppo "SaaS"

La prima versione che avevo in mente era un badge sfumato verde dietro al
titolo con un piccolo cerchio decorativo — l'ho scartata perché è
esattamente il tipo di "forma organica sfocata dietro il testo" che si
vede in ogni landing page generata. L'ho sostituita con l'arco che cito
esplicitamente nel logo esistente, con un movimento che *significa*
qualcosa (va fuori e torna) invece di essere puro riempimento.

### 5.3 "Cosa facciamo" rischiava di diventare tre card uguali

La tentazione naturale con tre voci di contenuto è tre colonne identiche.
L'ho rotta con un blocco che occupa più spazio (§3.2): non è decorazione,
riflette che Exodus Community è storicamente la prima e più strutturata
delle tre attività, quindi ha senso che occupi più peso visivo.

### 5.4 Cosa NON ho cambiato, e perché

Ho tenuto la palette a 5 token, non 6: un sesto colore (es. un verde
intermedio per stati hover) non serve finché non emerge un caso d'uso
concreto in fase di costruzione — se emergerà lo aggiungo lì, non ora per
simmetria con "4-6 colori" del brief.

---

## Prossimi passi

In attesa di conferma su questo piano prima di iniziare M2 (Header, Footer,
Home). Se approvato, il prossimo commit aggiorna `global.css` con la scala
tipografica e i pesi qui dichiarati (i colori sono già in `@theme` da M0).
