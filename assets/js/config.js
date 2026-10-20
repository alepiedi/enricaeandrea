/* ==========================================================================
   CONFIGURAZIONE DEL SITO
   Modifica solo questo file per cambiare nomi, data, luogo, cani, foto e RSVP.
   ========================================================================== */
window.WEDDING = {
  lei: 'Enrica',
  lui: 'Andrea',

  // Data del matrimonio (anno-mese-giorno)
  data: '2027-09-11',
  // Orario della cerimonia, es. '16:30'. Vuoto = non viene mostrato
  // (e in calendario l'evento dura tutto il giorno).
  orario: '',
  durataOre: 10, // durata dell'evento in calendario, solo se c'è l'orario

  luogo: {
    nome: 'Scuderie San Giorgio',
    breve: 'Scuderie San Giorgio', // quello che compare sulla medaglietta
    citta: 'Roma',
    indirizzo: 'Via di Baccanello, Roma',
    descrizione: 'Un’antica masseria tra il verde di Roma nord, a due passi dal Parco di Veio.',
    maps: 'https://www.google.com/maps/search/?api=1&query=Scuderie+San+Giorgio+Via+di+Baccanello+Roma',
  },

  // I due cani portafedi.
  // foto: se la lasciate vuota compare il disegno, colorato con i colori qui sotto.
  // orecchie: 'giu' (a penzoloni) oppure 'su' (a punta)
  cani: [
    {
      nome: 'Pepe', // ← nome del primo cane
      foto: '',     // es. 'assets/img/cani/pepe.jpg'
      porta: 'la fede di Enrica',
      segni: 'Orecchie da ascoltatore professionista',
      talento: 'Riporta tutto. Anche quello che non doveva.',
      colori: { pelo: '#c99c6b', muso: '#f4e7d3', orecchie: '#9a6d44', macchia: '' },
      orecchie: 'giu',
    },
    {
      nome: 'Luna', // ← nome del secondo cane
      foto: '',     // es. 'assets/img/cani/luna.jpg'
      porta: 'la fede di Andrea',
      segni: 'Sguardo che ottiene qualsiasi cosa',
      talento: 'Dormire sul divano nel posto più comodo',
      colori: { pelo: '#f1ebe1', muso: '#ffffff', orecchie: '#d8c3a2', macchia: '#d8c3a2' },
      orecchie: 'su',
    },
  ],

  rsvp: {
    entro: '', // data limite per rispondere, es. '2027-06-30'. Vuoto = nessuna scadenza
    // Dove arrivano le risposte (vedi README):
    //  - URL Formspree, es. 'https://formspree.io/f/abcdwxyz'
    //  - oppure URL di uno script Google (risposte in un Foglio Google)
    endpoint: '',
    // Se endpoint è vuoto, la risposta viene preparata come email a questo indirizzo
    email: '',
  },

  // Caccia agli ossi: i cani ne hanno nascosti tre nel sito
  ossi: {
    messaggio: 'Bau bau, bau! (Traduzione: ci hai scoperti. Quei tre ossi erano la nostra scorta segreta per il giorno del matrimonio.)',
    premio: 'Al ricevimento cerca Enrica e Andrea e di’ la parola d’ordine «Bau»: c’è un brindisi speciale per te.',
  },

  // Foto appese al nastro (consigliato: 6–8 foto verticali, ~1000px di lato lungo)
  foto: [
    { src: 'assets/img/photos/01.jpg', didascalia: 'Dove tutto è cominciato' },
    { src: 'assets/img/photos/02.jpg', didascalia: 'Il primo viaggio' },
    { src: 'assets/img/photos/03.jpg', didascalia: 'E poi arrivò Pepe' },
    { src: 'assets/img/photos/04.jpg', didascalia: 'E poi anche Luna' },
    { src: 'assets/img/photos/05.jpg', didascalia: 'Casa nostra' },
    { src: 'assets/img/photos/06.jpg', didascalia: 'Il sì' },
  ],
};
