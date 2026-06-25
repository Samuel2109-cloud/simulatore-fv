/* ============================================
   AGGIORNAMENTO AUTOCONSUMO SLIDER
============================================ */
const autocSlider = document.getElementById("autoconsumoPerc");
const autocVal = document.getElementById("autoconsumoVal");

autocSlider.addEventListener("input", () => {
    autocVal.textContent = autocSlider.value + "%";
});


/* ============================================
   SIMULAZIONE FOTOVOLTAICO
============================================ */
function calcolaSimulazione() {

    const config = document.getElementById("configImpianto").value;

    // Produzione base per configurazione
    let produzioneBase = (config === "3kwp") ? 3900 : 7800;

    const consumoCliente = parseFloat(document.getElementById("consumoCliente").value);
    const costoEnergia = parseFloat(document.getElementById("costoEnergia").value);
    const prezzoRID = parseFloat(document.getElementById("prezzoRID").value);
    const autocPerc = parseFloat(document.getElementById("autoconsumoPerc").value) / 100;

    // Calcoli principali
    const produzione = produzioneBase;
    const autocKw = produzione * autocPerc;
    const immissione = produzione - autocKw;
    const riduzione = autocKw;

    const risparmio = autocKw * costoEnergia;
    const rid = immissione * prezzoRID;

    const renditaAnnua = risparmio + rid;
    const detrazione = renditaAnnua * 0.50;

    // Output
    document.getElementById("produzione").textContent = produzione.toFixed(0);
    document.getElementById("autocKw").textContent = autocKw.toFixed(0);
    document.getElementById("riduzione").textContent = riduzione.toFixed(0);
    document.getElementById("immissione").textContent = immissione.toFixed(0);
    document.getElementById("risparmio").textContent = risparmio.toFixed(2);
    document.getElementById("rid").textContent = rid.toFixed(2);
    document.getElementById("renditaAnnua").textContent = renditaAnnua.toFixed(2);
    document.getElementById("detrazione").textContent = detrazione.toFixed(2);

    generaTabellaRendimento10(produzione, autocPerc, costoEnergia, prezzoRID);
}

document.getElementById("btnCalcola").addEventListener("click", calcolaSimulazione);


/* ============================================
   PREVENTIVO — RIGHE FISSE
============================================ */
function aggiornaPreventivo() {

    const righe = document.querySelectorAll("#preventivo tbody tr");

    let totaleRS = 0;
    let totaleConc = 0;
    let totaleEuro = 0;
    let mediaPerc = 0;

    righe.forEach(riga => {
        const rs = parseFloat(riga.querySelector(".rs").textContent);
        const conc = parseFloat(riga.querySelector(".conc").textContent);
        const euro = conc - rs;
        const perc = (euro / conc) * 100;

        riga.querySelector(".euro").textContent = euro.toFixed(0);
        riga.querySelector(".perc").textContent = perc.toFixed(0) + "%";

        totaleRS += rs;
        totaleConc += conc;
        totaleEuro += euro;
        mediaPerc += perc;
    });

    document.getElementById("totaleRS").textContent = totaleRS.toFixed(2);
    document.getElementById("totaleConc").textContent = totaleConc.toFixed(2);
    document.getElementById("totaleEuro").textContent = totaleEuro.toFixed(2);
    document.getElementById("mediaPerc").textContent = (mediaPerc / righe.length).toFixed(0) + "%";
}

aggiornaPreventivo();


/* ============================================
   TABELLA RENDIMENTO 10 ANNI
============================================ */
function generaTabellaRendimento10(produzione, autocPerc, costoEnergia, prezzoRID) {

    const tbody = document.getElementById("rendimentoBody");
    tbody.innerHTML = "";

    let efficienza = 1.00;     // 100% anno 1
    let valoreEnergia = costoEnergia;
    let cumulato = 0;

    for (let anno = 1; anno <= 10; anno++) {

        const prodEff = produzione * efficienza;
        const autocEff = prodEff * autocPerc;
        const immEff = prodEff - autocEff;

        const risparmio = autocEff * valoreEnergia;
        const guadagno = immEff * prezzoRID;

        const totale = risparmio + guadagno;
        cumulato += totale;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${anno}</td>
            <td>${(efficienza * 100).toFixed(1)}%</td>
            <td>${valoreEnergia.toFixed(3)}</td>
            <td>${risparmio.toFixed(2)}</td>
            <td>${guadagno.toFixed(2)}</td>
            <td>${totale.toFixed(2)}</td>
            <td>${cumulato.toFixed(2)}</td>
        `;

        tbody.appendChild(tr);

        // Degrado pannelli 0.7% annuo
        efficienza *= 0.993;

        // Inflazione energia 3% annuo
        valoreEnergia *= 1.03;
    }
}
