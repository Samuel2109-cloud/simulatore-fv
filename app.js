/* ============================
   AUTOCONSUMO RANGE
============================ */

document.getElementById("autoconsumo").addEventListener("input", function(){
  document.getElementById("autoconsumoVal").textContent = this.value + "%";
});

/* ============================
   SIMULAZIONE
============================ */

function calcolaSimulazione(){

  const giornoNotte = document.getElementById("giornoNotte").value;
  const kwp = parseInt(document.getElementById("configurazione").value);
  const consumi = parseFloat(document.getElementById("consumi").value);
  const prezzoConsumo = parseFloat(document.getElementById("prezzoConsumo").value);
  const prezzoVendita = parseFloat(document.getElementById("prezzoVendita").value);
  const autocPerc = parseFloat(document.getElementById("autoconsumo").value)/100;

  // Produzione base
  const produzioneBase = giornoNotte === "giorno" ? 1300 : 0;
  const produzione = produzioneBase * kwp;

  // Autoconsumo
  const autocKw = produzione * autocPerc;

  // Immissione
  const immissione = produzione - autocKw;

  // Riduzione kWh
  const riduzione = autocKw;

  // Risparmio €
  const risparmio = autocKw * prezzoConsumo;

  // RID €
  const rid = immissione * prezzoVendita;

  // Rendita annua
  const renditaAnnua = risparmio + rid;

  // Detrazione fiscale
  const detrazione = renditaAnnua * 0.5;

  // OUTPUT
  document.getElementById("produzione").textContent = produzione.toFixed(0);
  document.getElementById("autocKw").textContent = autocKw.toFixed(0);
  document.getElementById("riduzione").textContent = riduzione.toFixed(0);
  document.getElementById("immissione").textContent = immissione.toFixed(0);
  document.getElementById("risparmio").textContent = risparmio.toFixed(2);
  document.getElementById("rid").textContent = rid.toFixed(2);
  document.getElementById("renditaAnnua").textContent = renditaAnnua.toFixed(2);
  document.getElementById("detrazione").textContent = detrazione.toFixed(2);
}

document.getElementById("btnCalcola").addEventListener("click", calcolaSimulazione);

/* ============================
   PREVENTIVO
============================ */

function aggiornaPreventivo(){

  const righe = document.querySelectorAll("#preventivo tbody tr");

  let totaleRS = 0;
  let totaleConc = 0;
  let totaleEuro = 0;
  let sommaPerc = 0;

  righe.forEach(riga => {

    const qty = parseFloat(riga.querySelector(".qty").value);
    const slider = parseFloat(riga.querySelector(".slider").value);

    const prezzoRS = qty * slider;
    const prezzoConc = prezzoRS * 1.15;
    const risparmioEuro = prezzoConc - prezzoRS;
    const risparmioPerc = (risparmioEuro / prezzoConc) * 100;

    riga.querySelector(".conc").textContent = prezzoConc.toFixed(2);
    riga.querySelector(".perc").textContent = risparmioPerc.toFixed(1) + "%";
    riga.querySelector(".euro").textContent = risparmioEuro.toFixed(2);

    totaleRS += prezzoRS;
    totaleConc += prezzoConc;
    totaleEuro += risparmioEuro;
    sommaPerc += risparmioPerc;
  });

  document.getElementById("totaleRS").textContent = totaleRS.toFixed(2);
  document.getElementById("totaleConc").textContent = totaleConc.toFixed(2);
  document.getElementById("totaleEuro").textContent = totaleEuro.toFixed(2);
  document.getElementById("mediaPerc").textContent = (sommaPerc/righe.length).toFixed(1) + "%";
}

document.querySelectorAll(".slider").forEach(sl => sl.addEventListener("input", aggiornaPreventivo));
document.querySelectorAll(".qty").forEach(q => q.addEventListener("input", aggiornaPreventivo));

aggiornaPreventivo();
