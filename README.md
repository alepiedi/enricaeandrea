# Enrica & Andrea — Save the Date · *Il nastro azzurro*

Sito save-the-date per il matrimonio di Enrica e Andrea: **sabato 11 settembre 2027, Scuderie San Giorgio (Roma)**.

Un **nastro azzurro** attraversa tutto il sito mentre scorri, con una **fede d'oro** che ci scivola sopra. Alla fine il nastro arriva ai due cani, i portafedi: la fede si posa nella scatolina accanto all'altra e il nastro si divide fino ai loro collari.

Palette "Dusty Blue": dusty blue, avorio, powder blue, champagne, slate blue (più l'eucalipto come accento).

| # | Momento | Cosa succede |
|---|---------|--------------|
| 0 | **Le porte della scuderia** | Due ante con le croci bianche, legate da un nastro con il fiocco. Si *tiene premuto* il fiocco per scioglierlo: intanto due nasi curiosi spuntano tra le ante, poi le porte si aprono |
| 1 | **Nomi** | Il nastro parte da Enrica, fa un giro attorno alla "&" e scende verso Andrea. La fede inizia a scorrere |
| 2 | **I portafedi** | Le schede dei due cani, con la coccarda da concorso. Gli occhi seguono il dito (o il mouse); toccandoli abbaiano, scodinzolano e tirano fuori la lingua |
| 3 | **Appesi a un nastro** | Le foto sono polaroid legate al nastro con un fiocchetto: dondolano quando scorri e si *sviluppano* piano |
| 4 | **Il riporto** | Data e luogo non sono scritti: si lancia la pallina e i cani la riportano con una medaglietta in bocca (giorno, mese, dove). Al terzo lancio corrono tutti e due. Poi compaiono data, indirizzo e link a Maps |
| 5 | **Countdown** | Resta sfocato finché i cani non hanno riportato la data. Mostra anche l'attesa "in tempo-cane" (×7) e i pulsanti per il calendario |
| 6 | **RSVP** | All'invio si appunta una coccarda "Risposta ricevuta", la lettera si piega e un cane passa a prenderla in bocca e scappa via |
| 7 | **Finale** | La fede arriva nella scatolina di velluto, il nastro raggiunge i collari dei cani, che scodinzolano. Pulsante per lanciare i petali scuotendo il telefono |

In più: i cani hanno nascosto **tre ossi** nel sito (dietro una foto, nel prato del riporto e dietro la lettera): chi li trova tutti sblocca un messaggio segreto.

Niente framework e niente build: HTML, CSS e JavaScript puri. Funziona anche con `prefers-reduced-motion` e da tastiera.

---

## ✏️ Personalizzare

**Si modifica solo `assets/js/config.js`**:

- `data` → data del matrimonio; `orario` → ora della cerimonia (vuoto = non mostrato)
- `luogo` → nome, indirizzo, descrizione e link Maps della location
- `cani` → Giotto (labrador) e Penelope (amstaff): nome, razza, cosa porta, segni particolari, talento. `ritratto` è il disegno nella scheda, `foto` la foto vera che compare quando li si tocca; `colori` e `orecchie` servono per i cani disegnati nel riporto, nel finale e nel messaggio segreto
- `rsvp.entro` → data limite per rispondere (vuoto = "Fatecelo sapere appena potete")
- `foto` → elenco foto e didascalie
- `ossi` → messaggio segreto e premio per chi trova i tre ossi

## 📷 Dove mettere le foto

**Foto della coppia** (la sezione *La nostra storia*): stanno in **`assets/img/photos/`**, ridimensionate a 1000 px sul lato lungo. Per aggiungerne una, mettetela nella cartella (JPG, max ~300 KB) e aggiungete una riga all'elenco `foto` in `config.js`, es. `{ src: 'assets/img/photos/14-nuova.jpg', didascalia: 'La didascalia' }`. L'ordine dell'elenco è l'ordine sul nastro.

**Cani**: in **`assets/img/cani/`** ci sono i ritratti disegnati (`*-ritratto.png`, con lo sfondo trasparente) e le foto vere ritagliate quadrate (`*-foto.jpg`).

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
