# Enrica & Andrea — Save the Date · *Il nastro azzurro*

Sito save-the-date per il matrimonio di Enrica e Andrea: **sabato 11 settembre 2027, Scuderie San Giorgio (Roma)**.

Un **nastro di raso azzurro** attraversa tutto il sito mentre scorri, con una **fede d'oro** che ci scivola sopra. Alla fine il nastro arriva ai due cani portafedi, Giotto e Penelope: la fede si posa nella scatolina accanto all'altra e il nastro si divide fino a loro.

Lo stile segue la locandina scelta dalla sposa: carta avorio, blu notte, dettagli oro, raso azzurro, rametti d'ulivo con fiori bianchi, il cortile ad archi con i cipressi.

Palette "Dusty Blue": dusty blue, avorio, powder blue, champagne, slate blue, con l'oro e l'ulivo come accenti. Tutte le illustrazioni (porta, cortile, prato, ulivi, fiocchi) sono disegnate in SVG da `main.js`: niente immagini pesanti da scaricare.

| # | Momento | Cosa succede |
|---|---------|--------------|
| 0 | **La porta ad arco** | Porta avorio con la ghirlanda d'ulivo, legata da un nastro con il fiocco e un sigillo di ceralacca "AE". Si *tiene premuto* il sigillo: si spezza, il fiocco si scioglie e le ante si aprono |
| 1 | **Nomi** | Save the date, i nomi con la "&" dorata, il nastro con la fede, "Ogni grande storia ha il suo filo…", la data e il cortile ad archi con i cipressi |
| 2 | **I portafedi** | Le schede di Giotto e Penelope: foto in cornice dorata con ghirlanda e fiocco, coccarda 1° e 2°, cosa porteranno, segni particolari e superpotere. Toccandoli abbaiano e compare il loro ritratto disegnato |
| 3 | **La nostra storia** | Polaroid legate al nastro con fiocchi di raso e rametti fioriti: dondolano e si *sviluppano*. Su telefono sono una sotto l'altra e il nastro scende tra i fiocchi |
| 4 | **Lanciate la pallina** | Data e luogo sono su tre medagliette d'oro: si lancia la pallina (o si tocca una medaglietta) e i cani la riportano con la medaglietta in bocca. Poi compaiono data, luogo e link a Maps |
| 5 | **Countdown** | Resta sfocato finché i cani non hanno riportato la data. Mostra anche l'attesa "in tempo-cane" (×7) e i pulsanti per il calendario |
| 6 | **RSVP** | All'invio si imprime un sigillo di ceralacca "Risposta ricevuta", la lettera si piega e un cane la porta via |
| 7 | **Finale** | La fede arriva nella scatolina di velluto e il nastro raggiunge i ritratti dei cani. Pulsante per lanciare i petali scuotendo il telefono |

In più: i cani hanno nascosto **tre ossi** nel sito (dietro una foto, nel prato del riporto e dietro la lettera): chi li trova tutti sblocca un messaggio segreto.

Niente framework e niente build: HTML, CSS e JavaScript puri. Funziona anche con `prefers-reduced-motion` e da tastiera.

---

## ✏️ Personalizzare

**Si modifica solo `assets/js/config.js`**:

- `data` → data del matrimonio; `orario` → ora della cerimonia (vuoto = non mostrato)
- `luogo` → nome, indirizzo, descrizione e link Maps della location
- `cani` → Giotto (labrador) e Penelope (amstaff): nome, razza, cosa porta, segni particolari, superpotere. `foto` è il muso nella cornice dorata (schede, finale, messaggio segreto), `ritratto` il disegno che compare quando li si tocca; `colori` e `orecchie` servono per i cani disegnati che corrono nel riporto e portano la lettera
- `rsvp.entro` → data limite per rispondere (vuoto = "Fatecelo sapere appena potete")
- `foto` → elenco foto e didascalie
- `ossi` → messaggio segreto e premio per chi trova i tre ossi

## 📷 Dove mettere le foto

**Foto della coppia** (la sezione *La nostra storia*): stanno in **`assets/img/photos/`**, ridimensionate a 1000 px sul lato lungo. Per aggiungerne una, mettetela nella cartella (JPG, max ~300 KB) e aggiungete una riga all'elenco `foto` in `config.js`, es. `{ src: 'assets/img/photos/14-nuova.jpg', didascalia: 'La didascalia' }`. L'ordine dell'elenco è l'ordine sul nastro.

**Cani**: in **`assets/img/cani/`** ci sono le foto del muso ritagliate quadrate (`*-foto.jpg`, vanno nelle cornici dorate) e i ritratti disegnati (`*-ritratto.png`, con lo sfondo trasparente).

### Anteprima su WhatsApp
`assets/img/og-image.jpg` è l'immagine che appare quando si condivide il link. È collegata tramite l'URL completo in `index.html` (`og:image`). Se cambiate indirizzo del sito, aggiornate anche quello.

---

## 📬 Ricevere le risposte RSVP

Scegliete **una** delle due opzioni e incollate l'URL in `config.js → rsvp.endpoint`.

**A. Foglio Google (consigliato, gratis e senza limiti pratici)**
Seguite le istruzioni in cima a [`tools/google-apps-script.gs`](tools/google-apps-script.gs). Le risposte arrivano come righe di un Foglio Google, con un riepilogo e un'email agli sposi a ogni risposta.

**B. Formspree**
Registratevi su formspree.io, create un form e copiate l'URL (`https://formspree.io/f/xxxx`). Le risposte arrivano via email. Il piano gratuito ha un limite mensile.

Se `endpoint` è vuoto ma `rsvp.email` è compilato, il sito apre l'app di posta con la risposta già scritta. Se sono vuoti entrambi, la risposta **non viene inviata**: va bene solo per le prove.

---

## 🚀 Pubblicare (GitHub Pages)

1. Su GitHub: **Settings → Pages**
2. *Source*: "Deploy from a branch", scegliete il branch e la cartella `/ (root)`
3. Dopo circa un minuto il sito è online su **https://alepiedi.github.io/enricaeandrea/**

Potete collegare un dominio personalizzato (es. `enricaeandrea.it`) dalla stessa pagina.

## 💻 Provare in locale

```bash
python3 -m http.server 8000
# poi aprite http://localhost:8000
```

## Struttura

```
index.html                   struttura delle sezioni
assets/js/config.js          ← i dati da modificare
assets/js/main.js            nastro e fede, porte, cani, riporto, petali, RSVP…
assets/css/style.css         stile (palette Dusty Blue in cima al file)
assets/img/photos/           foto della coppia
assets/img/cani/             foto dei cani (facoltative)
assets/img/                  favicon, anteprima social
tools/google-apps-script.gs  raccolta RSVP su Foglio Google
```
