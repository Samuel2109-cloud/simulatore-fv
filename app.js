/* ============================
   SEZIONE SIMULAZIONE
============================ */

function calcolaSimulazione() {
  const giornoNotte = document.getElementById("giornoNotte").value;
  const configurazione = parseInt(document.getElementById("configurazione").value);
  const consumi = parseFloat(document.getElementById("consumi").value);
  const prezzoConsumo = parseFloat(document.getElementById("prezzoConsumo").value);
  const prezzoVendita = parseFloat(document.getElementById("prezzoVendita").value);

  // Produzione base per kWp
  let produzioneBase = giornoNotte === "giorno" ? 1300 : 0;

  // Produzione totale
  const produzione = produzioneBase * configurazione;

  // Autoconsumo (70% giorno, 20% notte)
  const autocPerc = giornoNotte === "giorno" ? 0.7 : 0.2;
  const autoconsumo = produzione * autocPerc;

  // Immissione
  const immissione = produzione - autoconsumo;

  // Risparmio diretto
  const risparmio = autoconsumo * prezzoConsumo;

  // RID
  const rid = immissione * prezzoVendita;

  // Rendita annua
  const renditaAnnua = risparmio + rid;

  // Detrazione fiscale 50%
  const detrazione = renditaAnnua * 0.5;

  // Rendita 25 anni
  const rendita25 = renditaAnnua * 25;

  // Output
  document.getElementById("produzione").textContent = produzione.toFixed(0);
  document.getElementById("autoconsumo").textContent = autoconsumo.toFixed(0);
  document.getElementById("immissione").textContent = immissione.toFixed(0);
  document.getElementById("risparmio").textContent = risparmio.toFixed(2);
  document.getElementById("rid").textContent = rid.toFixed(2);
  document.getElementById("renditaAnnua").textContent = renditaAnnua.toFixed(2);
  document.getElementById("detrazione").textContent = detrazione.toFixed(2);
  document.getElementById("rendita25").textContent = rendita25.toFixed(2);
}

document.getElementById("btnCalcola").addEventListener("click", calcolaSimulazione);

document.getElementById("btnReset").addEventListener("click", () => {
  document.getElementById("giornoNotte").value = "giorno";
  document.getElementById("configurazione").value = "3";
  document.getElementById("consumi").value = 4000;
  document.getElementById("prezzoConsumo").value = 0.25;
  document.getElementById("prezzoVendita").value = 0.10;

  document.querySelectorAll(".risultati span").forEach(s => s.textContent = "");
});

/* ============================
   SEZIONE PREVENTIVO
============================ */

function aggiornaPreventivo() {
  const righe = document.querySelectorAll("#preventivo tbody tr");

  let totaleRS = 0;
  let totaleConc = 0;
  let totaleEuro = 0;
  let sommaPerc = 0;

  righe.forEach(riga => {
    const qty = parseFloat(riga.querySelector(".qty").value);
    const slider = parseFloat(riga.querySelector(".slider").value);

    // Prezzo RS
    const prezzoRS = qty * slider;

    // Prezzo concorrenza = +15%
    const prezzoConc = prezzoRS * 1.15;

    // Risparmio €
    const risparmioEuro = prezzoConc - prezzoRS;

    // Risparmio %
    const risparmioPerc = (risparmioEuro / prezzoConc) * 100;

    // Output riga
    riga.querySelector(".conc").textContent = prezzoConc.toFixed(2);
    riga.querySelector(".perc").textContent = risparmioPerc.toFixed(1) + "%";
    riga.querySelector(".euro").textContent = risparmioEuro.toFixed(2);

    // Totali
    totaleRS += prezzoRS;
    totaleConc += prezzoConc;
    totaleEuro += risparmioEuro;
    sommaPerc += risparmioPerc;
  });

  // Media % risparmio
  const mediaPerc = sommaPerc / righe.length;

  // Output totali
  document.getElementById("totaleRS").textContent = totaleRS.toFixed(2);
  document.getElementById("totaleConc").textContent = totaleConc.toFixed(2);
  document.getElementById("totaleEuro").textContent = totaleEuro.toFixed(2);
  document.getElementById("mediaPerc").textContent = mediaPerc.toFixed(1) + "%";
}

// Eventi su slider e quantità
document.querySelectorAll(".slider").forEach(sl => {
  sl.addEventListener("input", aggiornaPreventivo);
});

document.querySelectorAll(".qty").forEach(q => {
  q.addEventListener("input", aggiornaPreventivo);
});

// Calcolo iniziale
aggiornaPreventivo();
