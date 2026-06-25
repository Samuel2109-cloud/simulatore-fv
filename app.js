/* ============================
   SIMULAZIONE FOTOVOLTAICO
============================ */

function calcolaSimulazione() {

    // INPUT
    const consumoCliente = parseFloat(document.getElementById("consumoCliente").value);
    const produzioneStimata = parseFloat(document.getElementById("produzioneStimata").value);
    const costoEnergia = parseFloat(document.getElementById("costoEnergia").value);
    const autoconsumoPerc = parseFloat(document.getElementById("autoconsumoPerc").value) / 100;
    const prezzoRID = parseFloat(document.getElementById("prezzoRID").value);
    const degrado = parseFloat(document.getElementById("degrado").value) / 100;
    const inflazioneEnergia = parseFloat(document.getElementById("inflazioneEnergia").value) / 100;

    // PRODUZIONE
    const produzione = produzioneStimata;

    // AUTOCONSUMO
    const autocKw = produzione * autoconsumoPerc;

    // IMMISSIONE
    const immissione = produzione - autocKw;

    // RISPARMIO
    const risparmio = autocKw * costoEnergia;

    // RID
    const rid = immissione * prezzoRID;

    // RENDITA ANNUA
    const renditaAnnua = risparmio + rid;

    // DETRAZIONE FISCALE (50%)
    const detrazione = renditaAnnua * 0.5;

    // RENDITA 25 ANNI (con degrado e inflazione)
    let cumulato25 = 0;
    let produzioneAnno = produzione;
    let costoEnergiaAnno = costoEnergia;

    for (let anno = 1; anno <= 25; anno++) {
        let prodEff = produzioneAnno;
        let autocEff = prodEff * autocconsumoPerc;
        let immEff = prodEff - autocEff;

        let risp = autocEff * costoEnergiaAnno;
        let guad = immEff * prezzoRID;

        cumulato25 += (risp + guad);

        produzioneAnno *= (1 - degrado);
        costoEnergiaAnno *= (1 + inflazioneEnergia);
    }

    // OUTPUT
    document.getElementById("produzione").textContent = produzione.toFixed(0);
    document.getElementById("autocKw").textContent = autocKw.toFixed(0);
    document.getElementById("immissione").textContent = immissione.toFixed(0);
    document.getElementById("risparmio").textContent = risparmio.toFixed(2);
    document.getElementById("rid").textContent = rid.toFixed(2);
    document.getElementById("renditaAnnua").textContent = renditaAnnua.toFixed(2);
    document.getElementById("detrazione").textContent = detrazione.toFixed(2);
    document.getElementById("rendita25").textContent = cumulato25.toFixed(2);

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


function aggiornaPreventivo() {

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
    document.getElementById("mediaPerc").textContent = (sommaPerc / righe.length).toFixed(1) + "%";
}

/* CREA UNA RIGA INIZIALE */
creaRiga();
