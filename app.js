// Aggiorna valore percentuale del range
document.getElementById("autoconsumo").addEventListener("input", function () {
  document.getElementById("autoconsumoVal").textContent = this.value + "%";
});

// Funzione principale di simulazione
function calcolaSimulazione() {
  const consumi = parseFloat(document.getElementById("consumi").value);
  const prezzoConsumo = parseFloat(document.getElementById("prezzoConsumo").value);
  const prezzoVendita = parseFloat(document.getElementById("prezzoVendita").value);
  const autoconsumo = parseFloat(document.getElementById("autoconsumo").value) / 100;
  const produzione = parseFloat(document.getElementById("produzione").value);
  const inflazione = parseFloat(document.getElementById("inflazione").value) / 100;

  // Calcoli base
  const autoconsumoEnergia = produzione * autoconsumo;
  const immissioneRete = produzione - autoconsumoEnergia;

  const risparmioBolletta = autoconsumoEnergia * prezzoConsumo;
  const guadagnoRete = immissioneRete * prezzoVendita;
  const totaleAnnuale = risparmioBolletta + guadagnoRete;

  // Inserimento risultati
  document.getElementById("risparmioBolletta").value = risparmioBolletta.toFixed(2);
  document.getElementById("guadagnoRete").value = guadagnoRete.toFixed(2);
  document.getElementById("totaleAnnuale").value = totaleAnnuale.toFixed(2);

  // Tabella rendimento 10 anni
  generaTabella(autoconsumoEnergia, immissioneRete, prezzoConsumo, prezzoVendita, inflazione);
}

// Genera tabella rendimento economico
function generaTabella(autoconsumoEnergia, immissioneRete, prezzoConsumo, prezzoVendita, inflazione) {
  const tbody = document.querySelector("#tabellaRendimento tbody");
  tbody.innerHTML = "";

  let cumulato = 0;

  for (let anno = 1; anno <= 10; anno++) {
    const efficienza = 100 - (anno - 1) * 0.5;
    const valoreEnergia = prezzoConsumo * Math.pow(1 + inflazione, anno - 1);

    const risparmioAutoconsumo = autoconsumoEnergia * valoreEnergia;
    const guadagnoReteAnno = immissioneRete * prezzoVendita;
    const totaleAnno = risparmioAutoconsumo + guadagnoReteAnno;

    cumulato += totaleAnno;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${anno}</td>
      <td>${efficienza.toFixed(1)}%</td>
      <td>${valoreEnergia.toFixed(3)}</td>
      <td>${risparmioAutoconsumo.toFixed(2)}</td>
      <td>${guadagnoReteAnno.toFixed(2)}</td>
      <td>${totaleAnno.toFixed(2)}</td>
      <td>${cumulato.toFixed(2)}</td>
    `;

    tbody.appendChild(row);
  }
}

// Pulsante Avvia simulazione
document.getElementById("btnCalcola").addEventListener("click", calcolaSimulazione);

// Pulsante Reset
document.getElementById("btnReset").addEventListener("click", function () {
  document.getElementById("consumi").value = 4000;
  document.getElementById("prezzoConsumo").value = 0.25;
  document.getElementById("prezzoVendita").value = 0.10;
  document.getElementById("autoconsumo").value = 70;
  document.getElementById("autoconsumoVal").textContent = "70%";
  document.getElementById("produzione").value = 4800;
  document.getElementById("inflazione").value = 3;

  document.getElementById("risparmioBolletta").value = "";
  document.getElementById("guadagnoRete").value = "";
  document.getElementById("totaleAnnuale").value = "";

  document.querySelector("#tabellaRendimento tbody").innerHTML = "";
});

// Calcolo iniziale automatico
calcolaSimulazione();
