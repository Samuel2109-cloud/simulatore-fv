/* ============================================================
   SIMULAZIONE FOTOVOLTAICO
============================================================ */

document.getElementById("btn-avvia").addEventListener("click", () => {
    aggiornaSimulazione();
    generaRendimento25Anni();
});

/* --- Calcolo simulazione FV --- */
function aggiornaSimulazione() {

    const consumi = +document.getElementById("inp-consumi").value;
    const prezzoConsumo = +document.getElementById("inp-prezzo-consumo").value;
    const prezzoVendita = +document.getElementById("inp-prezzo-vendita").value;

    const autoconsumoPerc = +document.getElementById("autoconsumo").value;
    const produzioneAnnua = +document.getElementById("produzione").value;

    const inflazione = +document.getElementById("inflazione").value / 100;
    const degrado = 0.0005; // 0,05%

    /* --- Produzione --- */
    let produzione = produzioneAnnua;
    let autoconsumo = produzione * (autoconsumoPerc / 100);
    let immissione = produzione - autoconsumo;

    /* --- Risparmi --- */
    const risparmioBolletta = autoconsumo * prezzoConsumo;
    const guadagnoRID = immissione * prezzoVendita;
    const rendimentoTotale = risparmioBolletta + guadagnoRID;

    /* --- Ammortamento --- */
    const investimento = window._totaleRS || 1;
    const ammortamento = investimento / rendimentoTotale;

    /* --- Output --- */
    document.getElementById("out-produzione").textContent = produzione.toFixed(0);
    document.getElementById("out-autoconsumo").textContent = autoconsumo.toFixed(0);
    document.getElementById("out-immissione").textContent = immissione.toFixed(0);
    document.getElementById("out-risp-bolletta").textContent = risparmioBolletta.toFixed(0);
    document.getElementById("out-rid").textContent = guadagnoRID.toFixed(0);
    document.getElementById("out-rend-annuo").textContent = rendimentoTotale.toFixed(0);
    document.getElementById("out-ammortamento").textContent = ammortamento.toFixed(1);

    /* --- Salvataggio per tabella 25 anni --- */
    window._baseAutoconsumo = autoconsumo;
    window._baseImmissione = immissione;
    window._baseCostoEnergia = prezzoConsumo;
    window._basePrezzoRID = prezzoVendita;
    window._baseInflazione = inflazione;
    window._baseDegrado = degrado;
}


/* ============================================================
   PREVENTIVO RINASCIMENTO SOLARE
============================================================ */

function aggiornaPreventivo() {

    const voci = [
        "moduli", "inverter", "strutture",
        "accumulo", "quadri", "progettazione", "manodopera"
    ];

    let totRS = 0;
    let totConc = 0;

    voci.forEach(v => {
        const q = +document.getElementById("q_" + v).value;
        const p = +document.getElementById("p_" + v).value;

        /* Aggiorna valore numerico accanto allo slider */
        document.getElementById("v_" + v).textContent = p.toFixed(0);

        const conc = p * 1.15;
        const rispEuro = (conc - p) * q;
        const rispPerc = ((conc - p) / conc) * 100;

        document.getElementById("c_" + v).textContent = conc.toFixed(0);
        document.getElementById("r_" + v + "_perc").textContent = rispPerc.toFixed(1) + "%";
        document.getElementById("r_" + v + "_euro").textContent = rispEuro.toFixed(0);

        totRS += p * q;
        totConc += conc * q;
    });

    const totRispEuro = totConc - totRS;
    const totRispPerc = (totRispEuro / totConc) * 100;

    document.getElementById("tot_rinascimento").textContent = totRS.toFixed(0);
    document.getElementById("tot_concorrenza").textContent = totConc.toFixed(0);
    document.getElementById("tot_risparmio_perc").textContent = totRispPerc.toFixed(1) + "%";
    document.getElementById("tot_risparmio_euro").textContent = totRispEuro.toFixed(0);

    window._totaleRS = totRS;
}

/* Attiva aggiornamento dinamico */
document.querySelectorAll("#tab-preventivo input").forEach(el => {
    el.addEventListener("input", aggiornaPreventivo);
});

aggiornaPreventivo();


/* ============================================================
   RENDIMENTO ECONOMICO 25 ANNI
============================================================ */

function generaRendimento25Anni() {

    const tbody = document.getElementById("tab-rendimento-body");
    tbody.innerHTML = "";

    const baseAuto = window._baseAutoconsumo || 0;
    const baseImm = window._baseImmissione || 0;
    const costoEnergia = window._baseCostoEnergia || 0;
    const prezzoRID = window._basePrezzoRID || 0;
    const inflazione = window._baseInflazione || 0;
    const degrado = window._baseDegrado || 0;

    let cumulato = 0;

    for (let anno = 1; anno <= 25; anno++) {

        const efficienza = Math.pow(1 - degrado, anno - 1);
        const valoreEnergia = costoEnergia * Math.pow(1 + inflazione, anno - 1);

        const rispAuto = baseAuto * efficienza * valoreEnergia;
        const guadRete = baseImm * efficienza * prezzoRID;
        const totale = rispAuto + guadRete;

        cumulato += totale;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${anno}</td>
            <td>${(efficienza * 100).toFixed(1)}%</td>
            <td>${valoreEnergia.toFixed(3)}</td>
            <td>${rispAuto.toFixed(0)}</td>
            <td>${guadRete.toFixed(0)}</td>
            <td>${totale.toFixed(0)}</td>
            <td>${cumulato.toFixed(0)}</td>
        `;
        tbody.appendChild(tr);
    }
}
