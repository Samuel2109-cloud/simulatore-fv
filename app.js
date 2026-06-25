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

  // kWp presi direttamente dal value del select
  const kwp = parseFloat(document.getElementById("configurazione").value);

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

  generaTabellaRendimento(produzione, autocKw, immissione, prezzoConsumo);
}

document.getElementById("btnCalcola").addEventListener("click", calcolaSimulazione);

/* ============================
   PREVENTIVO
============================ */

function creaRiga() {
  const tbody = document.getElementById("preventivoBody");

  const tr = document.createElement("tr");

  tr.innerHTML = `
      <td><input type="text" class="voce" value="Voce"></td>
      <td><input type="number" class="qty" value="1"></td>
      <td>
          <input type="range" class="slider" min="100" max="5000" value="1000">
          <p class="sliderVal">1000 €</p>
      </td>
      <td class="conc">0</td>
      <td class="perc">0%</td>
      <td class="euro">0</td>
      <td><button class="remove btn-secondary">–</button></td>
  `;

  tbody.appendChild(tr);

  tr.querySelector(".slider").addEventListener("input", aggiornaPreventivo);
  tr.querySelector(".qty").addEventListener("input", aggiornaPreventivo);
  tr.querySelector(".remove").addEventListener("click", () => {
      tr.remove();
      aggiornaPreventivo();
  });

  aggiornaPreventivo();
}

document.getElementById("addRow").addEventListener("click", creaRiga);

function aggiornaPreventivo(){

  const righe = document.querySelectorAll("#preventivo tbody tr");

  let totaleRS = 0;
  let totaleConc = 0;
  let totaleEuro = 0;
  let sommaPerc = 0;

  righe.forEach(riga => {

    const qty = parseFloat(riga.querySelector(".qty").value);
    const slider = parseFloat(riga.querySelector(".slider").value);

    riga.querySelector(".sliderVal").textContent = slider + " €";

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

/* ============================
   RENDIMENTO 10 ANNI
============================ */

function generaTabellaRendimento(prodAnnua, autocKw, immRete, prezzoEnergia) {

  let corpo = document.getElementById("rendimentoBody");
  corpo.innerHTML = "";

  let cumulato = 0;
  let prezzoEnergiaAnno = prezzoEnergia;

  for (let anno = 1; anno <= 10; anno++) {

      let efficienza = 100 - (anno - 1) * 0.5;
      let produzioneEff = prodAnnua * (efficienza / 100);

      let autocEff = produzioneEff * (autocKw / prodAnnua);
      let immEff = produzioneEff - autocEff;

      let risparmio = autocEff * prezzoEnergiaAnno;
      let guadagno = immEff * 0.12;

      let totale = risparmio + guadagno;
      cumulato += totale;

      corpo.innerHTML += `
          <tr>
              <td>${anno}</td>
              <td>${efficienza.toFixed(1)}%</td>
              <td>${prezzoEnergiaAnno.toFixed(3)}</td>
              <td>${risparmio.toFixed(2)}</td>
              <td>${guadagno.toFixed(2)}</td>
              <td>${totale.toFixed(2)}</td>
              <td>${cumulato.toFixed(2)}</td>
          </tr>
      `;

      prezzoEnergiaAnno *= 1.03;
  }

  document.getElementById("totale10anni").textContent = cumulato.toFixed(2) + " €";
}

/* CREA UNA RIGA INIZIALE */
creaRiga();
