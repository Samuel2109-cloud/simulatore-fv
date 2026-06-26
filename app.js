/* ============================
   PRODUZIONE PER CONFIGURAZIONE (kWh/anno)
============================ */
const produzioneMap = {
    "3kwp_no":   3900,
    "3kwp_si":   3900,
    "4.5kwp_no": 5850,
    "4.5kwp_si": 5850,
    "6kwp_no":   7800,
    "6kwp_si":   7800,
    "9kwp_no":   11700,
    "9kwp_si":   11700
};

/* ============================
   SLIDER AUTOCONSUMO
============================ */
const autocSlider = document.getElementById("autoconsumoPerc");
const autocVal = document.getElementById("autoconsumoVal");

autocSlider.addEventListener("input", () => {
    autocVal.textContent = autocSlider.value + "%";
});

/* ============================
   CALCOLO SIMULAZIONE
============================ */
document.getElementById("btnCalcola").addEventListener("click", () => {
    const costoEnergia = parseFloat(document.getElementById("costoEnergia").value);
    const prezzoRID    = parseFloat(document.getElementById("prezzoRID").value);
    const autocPerc    = parseFloat(document.getElementById("autoconsumoPerc").value) / 100;
    const config       = document.getElementById("configImpianto").value;

    const produzione   = produzioneMap[config] || 3900;
    const autoconsumo  = produzione * autocPerc;
    const immissione   = produzione - autoconsumo;

    const risparmio    = autoconsumo * costoEnergia;
    const rid          = immissione * prezzoRID;
    const renditaAnnua = risparmio + rid;
    const detrazione   = renditaAnnua * 0.5;
    const rendita25    = renditaAnnua * 25;

    // Risultati
    document.getElementById("produzione").textContent   = produzione.toFixed(0);
    document.getElementById("autoconsumo").textContent  = autoconsumo.toFixed(0);
    document.getElementById("riduzione").textContent    = autoconsumo.toFixed(0);
    document.getElementById("immissione").textContent   = immissione.toFixed(0);
    document.getElementById("risparmio").textContent    = risparmio.toFixed(2);
    document.getElementById("rid").textContent          = rid.toFixed(2);
    document.getElementById("renditaAnnua").textContent = renditaAnnua.toFixed(2);
    document.getElementById("detrazione").textContent   = detrazione.toFixed(2);
    document.getElementById("rendita25").textContent    = rendita25.toFixed(2);

    generaTabellaRendimento10(renditaAnnua);
});

/* ============================
   PREVENTIVO — Prezzo concorrenza = Prezzo RS + 15%
============================ */
function aggiornaPreventivo() {
    const righe = document.querySelectorAll("#preventivo tbody tr");
    let totaleRS = 0, totaleConc = 0, totaleEuro = 0, sommaPerc = 0;

    righe.forEach(riga => {
        const qty    = parseFloat(riga.querySelector(".qty").value) || 0;
        const slider = parseFloat(riga.querySelector(".slider").value) || 0;

        riga.querySelector(".sliderVal").textContent = slider.toLocaleString("it-IT") + " €";

        const prezzoRS      = qty * slider;
        const prezzoConc    = prezzoRS * 1.15;
        const risparmioEuro = prezzoConc - prezzoRS;
        const risparmioPerc = prezzoConc > 0 ? (risparmioEuro / prezzoConc) * 100 : 0;

        riga.querySelector(".conc").textContent = prezzoConc.toFixed(2);
        riga.querySelector(".euro").textContent = risparmioEuro.toFixed(2);
        riga.querySelector(".perc").textContent = risparmioPerc.toFixed(1) + "%";

        totaleRS   += prezzoRS;
        totaleConc += prezzoConc;
        totaleEuro += risparmioEuro;
        sommaPerc  += risparmioPerc;
    });

    document.getElementById("totaleRS").textContent   = totaleRS.toFixed(2);
    document.getElementById("totaleConc").textContent = totaleConc.toFixed(2);
    document.getElementById("totaleEuro").textContent = totaleEuro.toFixed(2);
    document.getElementById("mediaPerc").textContent  = (sommaPerc / righe.length).toFixed(1) + "%";
}

document.querySelectorAll(".slider").forEach(s => s.addEventListener("input", aggiornaPreventivo));
document.querySelectorAll(".qty").forEach(q => q.addEventListener("input", aggiornaPreventivo));
aggiornaPreventivo();

/* ============================
   TABELLA RENDIMENTO 10 ANNI
============================ */
function generaTabellaRendimento10(renditaAnnua) {
    const tbody = document.querySelector("#rendimento10 tbody");
    tbody.innerHTML = "";

    let cumulato      = 0;
    let efficienza    = 1.0;
    let valoreEnergia = parseFloat(document.getElementById("costoEnergia").value);
    let totaleTot     = 0;

    for (let anno = 1; anno <= 10; anno++) {
        const rendAnnua       = renditaAnnua * efficienza;
        const risparmioAutoc  = rendAnnua * 0.7;
        const guadagnoRete    = rendAnnua * 0.3;
        cumulato += rendAnnua;
        totaleTot = cumulato;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${anno}</td>
            <td>${(efficienza * 100).toFixed(1)}%</td>
            <td>${valoreEnergia.toFixed(2)} €</td>
            <td>${risparmioAutoc.toFixed(2)} €</td>
            <td>${guadagnoRete.toFixed(2)} €</td>
            <td>${rendAnnua.toFixed(2)} €</td>
            <td>${cumulato.toFixed(2)} €</td>
        `;
        tbody.appendChild(tr);

        efficienza    *= 0.993;  // degrado 0.7% annuo
        valoreEnergia *= 1.03;   // inflazione energia 3%
    }

    // Aggiorna footer
    document.getElementById("totaleTotale").textContent  = totaleTot.toFixed(2) + " €";
    document.getElementById("totaleCumulato").textContent = totaleTot.toFixed(2) + " €";
}
