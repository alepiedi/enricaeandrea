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
  // ritratto: disegno del cane (PNG con lo sfondo trasparente) per la scheda
  // foto: foto vera, compare quando si tocca il cane nella scheda
  // colori e orecchie ('giu' o 'su'): per il cane disegnato nel riporto, nel finale e nel messaggio segreto
  cani: [
    {
      nome: 'Giotto',
      razza: 'Labrador',
      ritratto: 'assets/img/cani/giotto-ritratto.png',
      foto: 'assets/img/cani/giotto-foto.jpg',
      porta: 'la fede di Enrica',
      segni: 'Coda che non si ferma mai',
      talento: 'Trovare qualcosa da mangiare ovunque, anche dove non c’è',
      colori: { pelo: '#e8cd9a', muso: '#f6e9cf', orecchie: '#d6b276', macchia: '' },
      orecchie: 'giu',
    },
    {
      nome: 'Penelope',
      razza: 'Amstaff',
      ritratto: 'assets/img/cani/penelope-ritratto.png',
      foto: 'assets/img/cani/penelope-foto.jpg',
      porta: 'la fede di Andrea',
      segni: 'Bianca e grigia, con un cuore enorme',
      talento: 'Chiedere coccole. E ottenerle, sempre',
      colori: { pelo: '#6d717c', muso: '#ffffff', orecchie: '#5b5f6a', macchia: '' },
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
    { src: 'assets/img/photos/01-prima-foto-2012.jpg', didascalia: 'La nostra prima foto insieme, nel lontano 2012' },
    { src: 'assets/img/photos/02-al-mare.jpg', didascalia: 'Baci salati' },
    { src: 'assets/img/photos/03-al-lago.jpg', didascalia: 'Gite fuori porta' },
    { src: 'assets/img/photos/04-stessa-fede.jpg', didascalia: 'La stessa fede (giallorossa)' },
    { src: 'assets/img/photos/05-sottacqua.jpg', didascalia: 'Insieme, anche sott’acqua' },
    { src: 'assets/img/photos/06-viaggio-piu-bello.jpg', didascalia: 'Il viaggio più bello fino ad ora' },
    { src: 'assets/img/photos/07-vista-mare.jpg', didascalia: 'Sempre più in alto' },
    { src: 'assets/img/photos/08-posto-del-cuore.jpg', didascalia: 'Il posto del cuore' },
    { src: 'assets/img/photos/09-posto-del-cuore-tramonto.jpg', didascalia: 'Il posto del cuore, al tramonto' },
    { src: 'assets/img/photos/10-tutti-e-quattro.jpg', didascalia: 'In viaggio, tutti e quattro' },
    { src: 'assets/img/photos/11-in-tiro.jpg', didascalia: 'Già pronti per il grande giorno' },
    { src: 'assets/img/photos/12-mani-e-zampe.jpg', didascalia: 'Mani e zampe' },
    { src: 'assets/img/photos/13-la-proposta.jpg', didascalia: 'La proposta' },
  ],
};
