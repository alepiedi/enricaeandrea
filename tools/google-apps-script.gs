/**
 * RSVP di Enrica & Andrea → Foglio Google (+ email agli sposi a ogni risposta)
 *
 * Installazione:
 *  1. Crea un nuovo Foglio Google (es. "RSVP Enrica & Andrea").
 *  2. Menu Estensioni → Apps Script: cancella il codice di esempio, incolla tutto
 *     questo file e salva (icona del dischetto).
 *  3. Scrivi qui sotto, in EMAIL_SPOSI, gli indirizzi a cui mandare l'avviso.
 *  4. In alto scegli la funzione "setup" e premi Esegui: crea le schede
 *     "Risposte" e "Riepilogo" e chiede le autorizzazioni (foglio + email).
 *  5. Pulsante "Esegui il deployment" → "Nuovo deployment" → tipo "App web".
 *     - Esegui come: Me
 *     - Chi ha accesso: Chiunque
 *  6. Copia l'URL che termina con /exec: va in assets/js/config.js → rsvp.endpoint
 *
 * Se modifichi lo script dopo il deployment: "Gestisci deployment" → matita →
 * Versione: "Nuova versione" → Esegui il deployment (l'URL resta lo stesso).
 */

// Chi riceve un'email a ogni risposta. Lascia [] per non mandare email.
const EMAIL_SPOSI = ['indirizzo-enrica@esempio.it', 'indirizzo-andrea@esempio.it'];

const SCHEDA_RISPOSTE = 'Risposte';
const SCHEDA_RIEPILOGO = 'Riepilogo';
const COLONNE = ['inviato', 'partecipa', 'nome', 'contatto', 'allergie', 'messaggio'];
const INTESTAZIONI = ['Inviato il', 'Partecipa', 'Nome e cognome', 'Email o telefono', 'Allergie / intolleranze', 'Messaggio per gli sposi'];

/** Da eseguire una volta a mano: prepara le schede e chiede le autorizzazioni. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  preparaRisposte_(ss);
  preparaRiepilogo_(ss);
}

/** Riceve le risposte dal sito. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let p = {};
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = preparaRisposte_(ss);
    if (!ss.getSheetByName(SCHEDA_RIEPILOGO)) preparaRiepilogo_(ss);

    p = (e && e.parameter) || {};
    if (p._gotcha) return json_({ ok: true }); // trappola anti-spam
    // l'ora di invio la mette il foglio (vera data, ordinabile); il resto arriva dal sito
    sheet.appendRow(COLONNE.map((c) => (c === 'inviato' ? new Date() : testo_(p[c]))));
  } finally {
    lock.releaseLock();
  }

  try {
    avvisaSposi_(p);
  } catch (err) {
    console.error('Email non inviata: ' + err); // la risposta resta comunque salvata
  }
  return json_({ ok: true });
}

/** Aprendo l'URL /exec nel browser si vede se lo script è attivo. */
function doGet() {
  return ContentService.createTextOutput('RSVP di Enrica & Andrea: attivo ✔');
}

/* ----------------------------------------------------------------------- */

function preparaRisposte_(ss) {
  let sheet = ss.getSheetByName(SCHEDA_RISPOSTE);
  if (!sheet) {
    const prima = ss.getSheets()[0];
    // riusa il primo foglio se è ancora vuoto ("Foglio1")
    sheet = prima.getLastRow() === 0 && !ss.getSheetByName(SCHEDA_RIEPILOGO) ? prima.setName(SCHEDA_RISPOSTE) : ss.insertSheet(SCHEDA_RISPOSTE);
  }
  if (sheet.getLastRow() > 0 && sheet.getRange(1, INTESTAZIONI.length).getValue() === '') {
    sheet.getRange(1, 1, 1, INTESTAZIONI.length).setValues([INTESTAZIONI]).setFontWeight('bold').setBackground('#e6edf4');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(INTESTAZIONI);
    sheet.getRange(1, 1, 1, INTESTAZIONI.length).setFontWeight('bold').setBackground('#e6edf4');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
    [150, 90, 200, 200, 220, 320].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  }
  return sheet;
}

function preparaRiepilogo_(ss) {
  let sh = ss.getSheetByName(SCHEDA_RIEPILOGO);
  if (sh) return sh;
  sh = ss.insertSheet(SCHEDA_RIEPILOGO, 0);
  const R = `'${SCHEDA_RISPOSTE}'!`;
  sh.getRange('A1').setValue('Riepilogo RSVP · Enrica & Andrea').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2').setValue('Si aggiorna da solo. Se qualcuno risponde due volte compare due volte: vale la risposta più recente.')
    .setFontColor('#69727f').setFontStyle('italic');

  sh.getRange('A4:B7').setValues([
    ['Risposte ricevute', `=COUNTA(${R}B2:B)`],
    ['Ci saranno', `=COUNTIF(${R}B2:B,"Sì")`],
    ['Non potranno', `=COUNTIF(${R}B2:B,"No")`],
    ['Ultima risposta', `=IFERROR(MAX(${R}A2:A),"")`],
  ]);
  sh.getRange('A4:A7').setFontWeight('bold');
  sh.getRange('B7').setNumberFormat('dd/mm/yyyy hh:mm');
  sh.getRange('B5').setFontColor('#3d4f66').setFontWeight('bold');

  sh.getRange('A9').setValue('Chi ci sarà').setFontWeight('bold');
  sh.getRange('A10').setFormula(`=IFERROR(SORT(UNIQUE(FILTER(${R}C2:C,${R}B2:B="Sì"))),"—")`);

  sh.getRange('C9').setValue('Allergie e intolleranze').setFontWeight('bold');
  sh.getRange('C10').setFormula(`=IFERROR(FILTER({${R}C2:C,${R}E2:E},${R}E2:E<>"",${R}B2:B="Sì"),"Nessuna segnalata")`);

  sh.getRange('F9').setValue('Non potranno').setFontWeight('bold');
  sh.getRange('F10').setFormula(`=IFERROR(SORT(UNIQUE(FILTER(${R}C2:C,${R}B2:B="No"))),"—")`);

  [200, 80, 200, 260, 30, 200].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(0);
  return sh;
}

function avvisaSposi_(p) {
  const destinatari = EMAIL_SPOSI.filter((x) => x && !x.includes('esempio'));
  if (!destinatari.length) return;
  const si = p.partecipa === 'Sì';
  const righe = [
    `${p.nome || 'Qualcuno'} ha risposto: ${si ? 'CI SARÀ 🎉' : 'non potrà esserci'}`,
    '',
    `Contatto: ${p.contatto || '-'}`,
    si ? `Allergie / intolleranze: ${p.allergie || 'nessuna'}` : null,
    p.messaggio ? `\nMessaggio per voi:\n"${p.messaggio}"` : null,
    '',
    `Tutte le risposte: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
  ].filter((r) => r !== null);
  MailApp.sendEmail({
    to: destinatari.join(','),
    subject: `RSVP: ${p.nome || 'nuova risposta'} — ${si ? 'Ci sarà!' : 'Non potrà'}`,
    body: righe.join('\n'),
    name: 'RSVP Enrica & Andrea',
  });
}

/** Testo sicuro per una cella: evita che "=..." venga interpretato come formula. */
function testo_(v) {
  const s = String(v == null ? '' : v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
