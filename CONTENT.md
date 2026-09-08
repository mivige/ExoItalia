# Guida ai contenuti — Exo Italia

Questa guida è per chi aggiorna il sito **senza toccare codice**, dal
browser. Non serve installare niente: si modifica tutto direttamente su
GitHub, dal sito github.com.

Regola d'oro, da tenere a mente sempre: **se sbagli qualcosa, il sito
online non si rompe.** Il sito pubblico resta quello di prima finché la
modifica non supera un controllo automatico. Vedi il punto 5 per i
dettagli.

---

## Prima di iniziare: come si modifica un file su GitHub

Ogni volta che questa guida dice "apri il file X", i passaggi sono
sempre questi:

1. Vai sul repository `github.com/mivige/ExoItalia` (chiedi il link se
   non ce l'hai salvato).
2. Con la barra di ricerca del repository, oppure navigando le cartelle,
   apri il file da modificare (es. `src/data/partners.yml`).
3. In alto a destra, sopra il contenuto del file, clicca l'icona a forma
   di matita ✏️ ("Edit this file"). Se non la vedi, prova prima ad
   accedere (login) con il tuo account GitHub.
4. Modifica il testo. Fai attenzione agli **spazi a inizio riga**: nei
   file `.yml` contano, e uno spazio in più o in meno può rompere il
   file (vedi punto 5).
5. Scorri in fondo alla pagina. In "Commit changes":
   - scrivi una breve descrizione di cosa hai cambiato (es. "aggiunto
     partner Foo Srl");
   - seleziona **"Create a new branch for this commit and start a pull
     request"** (non "Commit directly to the main branch");
   - clicca "Propose changes".
6. GitHub ti porta alla pagina per aprire una Pull Request. Clicca
   "Create pull request".
7. Aspetta 1-2 minuti: sotto la Pull Request compare l'esito del
   controllo automatico ("Verifica build (PR)"). Se è ✅ verde, clicca
   "Merge pull request" per pubblicare. Se è ❌ rosso, vedi il punto 5.

Passare da una Pull Request invece che modificare `main` direttamente è
quello che ti protegge: se il file è malformato, lo scopri **prima** che
vada online.

---

## 1. Aggiungere o rimuovere un partner

File: `src/data/partners.yml`.

Ogni partner è un blocco con uno slug (l'identificativo, es.
`ai-sparks`) seguito dai suoi dati, con la stessa indentazione degli
altri:

```yaml
nome-nuovo-partner:
  nome: "Nome Partner"
  url: "https://esempio.it"
  tipo: "partner" # partner | sostenitore | patrocinio
  logo: "/images/partners/nome-nuovo-partner.svg" # opzionale
```

- Lo slug (`nome-nuovo-partner`) dev'essere unico, tutto minuscolo, senza
  spazi (usa i trattini).
- `logo` è opzionale: se non lo scrivi, il sito mostra il nome del
  partner al posto del logo finché non arriva il file immagine (vedi la
  lista in fondo per formato e dimensioni).
- Per **rimuovere** un partner, cancella tutto il suo blocco (dallo slug
  fino all'ultima riga dei suoi dati, prima del prossimo slug).

## 2. Aggiungere una news

Le news compaiono in `/news` solo dopo che questa modifica è online.
**La prima news pubblicata fa comparire automaticamente la voce "News"
nel menu del sito** (prima resta nascosta apposta).

1. Vai nella cartella `src/content/news/`.
2. Crea un nuovo file (pulsante "Add file" → "Create new file" in alto a
   destra nella vista della cartella).
3. Nome del file: `AAAA-MM-GG-titolo-breve.md`, per esempio
   `2026-03-12-nuovo-progetto-latina.md`. La data all'inizio serve solo
   per ordinare i file, non è quella mostrata sul sito.
4. Contenuto del file:

```yaml
---
titolo: "Titolo della news"
data: 2026-03-12
sommario: "Una o due frasi di riassunto, massimo 200 caratteri: è quella che si vede nell'elenco."
sede: "latina" # latina | molise | nazionale
copertina: "/images/news/2026-03-12-nuovo-progetto-latina.jpg" # opzionale
copertinaAlt: "Descrizione dell'immagine per chi non la vede" # obbligatoria se c'è copertina
---

Il testo della news, in Markdown normale. Puoi usare **grassetto**,
*corsivo*, e titoli di sezione con `## Un titolo`.
```

- Se vuoi scrivere una bozza senza pubblicarla subito, aggiungi
  `bozza: true`: il sito la ignora finché non lo togli.
- Per caricare l'immagine di copertina: vai in `public/images/news/`,
  "Add file" → "Upload files", trascina la tua immagine (comprimila
  prima, vedi la lista in fondo), poi apri una Pull Request come sempre.
  Il nome del file caricato deve corrispondere a quello scritto in
  `copertina`.

## 3. Aggiornare i numeri della home

File: `src/data/stats.yml`. Cambia solo il valore dopo `valore:`, per
esempio:

```yaml
membri:
  ordine: 2
  valore: "150"          # <- cambia solo questo
  etichetta: "Membri della community"
```

Non toccare `ordine` (decide la posizione da sinistra a destra) né lo
slug (`membri`, `volontari`, ecc.).

## 4. Aggiornare una scheda sede

File: `src/content/sedi/latina.md` o `src/content/sedi/molise.md` (uno
per sede — per una nuova sede, copia uno di questi due file come base e
cambia lo slug/nome file).

La parte fra `---` e `---` in alto (il "frontmatter") sono i dati
strutturati; sotto è il testo libero della pagina, in Markdown.

Campi utili da aggiornare più spesso:
- `claim`: la frase breve sotto al nome (max 80 caratteri).
- `sommario`: 1-2 frasi, usata anche nell'anteprima Google.
- `stato`: `"attiva"` oppure `"in-avvio"`.
- `referenti`: elenco di persone, opzionale — se non c'è nessuno, si può
  omettere del tutto questo campo (la sezione sparisce dalla pagina, non
  resta un titolo vuoto):

```yaml
referenti:
  - nome: "Nome Cognome"
    ruolo: "Ruolo"
    linkedin: "https://www.linkedin.com/in/..." # opzionale
```

- Il testo sotto ai `---` è la parte narrativa della pagina: storia
  della sede, progetti, eventi. Si scrive come un documento normale, con
  `## Titolo` per le sezioni.

## 5. Se il deploy fallisce

Ogni Pull Request lancia automaticamente un controllo ("Verifica build
(PR)"). Se qualcosa nel file è scritto in modo scorretto — indentazione
YAML sbagliata, una virgoletta dimenticata, un campo obbligatorio mancante
— quel controllo diventa ❌ rosso, con un messaggio d'errore.

**Il sito pubblico non viene toccato finché il controllo non è verde e
qualcuno non fa "Merge".** Puoi prendere tempo, chiedere aiuto, o
correggere l'errore con calma.

Per vedere il dettaglio dell'errore: nella Pull Request, clicca sulla
voce ❌ "Verifica build (PR)" → "Details". Il messaggio più in basso
nell'output di solito indica il file e la riga del problema. Se non è
chiaro, incolla quel messaggio a chi segue la parte tecnica del sito.

La stessa schermata (tab **Actions** del repository) mostra anche la
cronologia di tutti i deploy passati, andati a buon fine o no.

## 6. Slot immagine — lista della spesa

Nessuna di queste immagini esiste ancora nel sito (sono tutte
placeholder grigi con etichetta). Formato consigliato: **JPG per foto,
SVG o PNG con sfondo trasparente per loghi**. Comprimi sempre prima di caricare (uno strumento gratuito comodo:
[squoosh.app](https://squoosh.app), tutto nel browser, non carica le tue
foto da nessuna parte) — punta a **stare sotto i 300 KB per foto**, i
loghi sono già piccoli di norma.

| Cosa | Cartella | Proporzioni | Note |
|---|---|---|---|
| Copertina sede | `public/images/sedi/` | 16:9 (es. 1600×900px) | Va ritagliata anche più quadrata nelle card della home/`/sedi`: evita testo o volti vicino ai bordi. |
| Copertina news | `public/images/news/` | 16:9 (es. 1600×900px) | Stessa cautela della copertina sede. |
| Foto membro consiglio direttivo | `public/images/team/` | 1:1 quadrata (min. 400×400px) | Volto centrato, sfondo semplice. |
| Logo partner | `public/images/partners/` | libera, orizzontale preferita | Preferibilmente SVG o PNG trasparente; se il logo a colori non regge bene in scala di grigi (effetto hover), avvisa chi segue il sito. |
| Immagine social di default (OG) | `public/images/og-default.png` | 1200×630px esatti | Già presente, generata dai colori del brand. Da rifare se cambia la palette. |

Il limite di peso di **tutto il repository** è di circa 1 GB (limite di
GitHub Pages): con foto comprimibili sotto i 300 KB l'una, c'è margine
per centinaia di immagini, ma comprimere resta comunque buona norma per
la velocità di caricamento del sito.
