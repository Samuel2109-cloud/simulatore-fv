// ----------------------
// SIMULATORE FV
// ----------------------

document.getElementById("btn-avvia").addEventListener("click", () => {
    const d = {
        giorno: document.getElementById("sel-giorno").value,
        impianto: document.getElementById("sel-impianto").value,
        consumi: +document.getElementById("inp-consumi").value,
        prezzoConsumo: +document.getElementById("inp-prezzo-consumo").value,
        prezzoVendita: +document.getElementById("inp-prezzo-vendita").value
    };
    aggiornaSimulazioneFV(d);
});

document.getElementById("btn-reset").addEventListener("click", () => {
    document.querySelectorAll("#output-area span").forEach(el => el.textContent = "");
    document.querySelector("#batt-level").innerHTML = "";
    resetSoleLuna();
});

function aggiornaSimulazioneFV(d) {
    // Alternanza sole/luna
    if (d.giorno === "giorno") {
        document.getElementById("sun").style.opacity = "1";
        document.getElementById("moon").style.opacity = "0";
        document.getElementById("sky").style.background = "linear-gradient(#87CEEB, #ffffff)";
    } else {
        document.getElementById("sun").style.opacity = "0";
        document.getElementById("moon").style.opacity = "1";
        document.getElementById("sky").style.background = "linear-gradient(#0b1a3a, #1a2a4a)";
    }

    // Produzione/autoconsumo/immissione
    let produzione = 0, autoconsumo = 0, immissione = 0;
    switch (d.impianto) {
        case "3s": produzione = 4200; autoconsumo = 1600; immissione = 2600; break;
        case "3a": produzione = 4200; autoconsumo = 2600; immissione = 1000; break;
        case "4.5s": produzione = 6300; autoconsumo = 1200; immissione = 3900; break;
        case "4.5a": produzione = 6300; autoconsumo = 2400; immissione = 1500; break;
        case "6s": produzione = 8400; autoconsumo = 1600; immissione = 5200; break;
        case "6a": produzione = 8400; autoconsumo = 3200; immissione = 2000; break;
        case "9s": produzione = 11000; autoconsumo = 2100; immissione = 6800; break;
        case "9a": produzione = 11000; autoconsumo = 4200; immissione = 2600; break;
    }

    const risparmio = autoconsumo * d.prezzoConsumo;
    const rid = immissione * d.prezzoVendita;
    const renditaAnnua = risparmio + rid;
    const detrazione = renditaAnnua * 0.28;
    const rendita25 = (renditaAnnua + detrazione) * 25;

    animaNumero("prod", produzione);
    animaNumero("auto", autoconsumo);
    animaNumero("imm", immissione);

    animaNumero("risp", risparmio);
    animaNumero("rid", rid);
    animaNumero("rend-annua", renditaAnnua);
    animaNumero("detrazione", detrazione);
    animaNumero("rend-25", rendita25);

    const livello = d.impianto.includes("a") ? 80 : 10;
    document.querySelector("#batt-level").innerHTML =
        `<div style="width:${livello}%;height:100%;background:green;"></div>`;
}

function animaNumero(id, valore) {
    let el = document.getElementById(id);
    let start = 0;
    let end = valore;
    let durata = 1200;
    let step = 10;
    let incremento = (end - start) / (durata / step);

    let timer = setInterval(() => {
        start += incremento;
        if (start >= end) {
            start = end;
            clearInterval(timer);
        }
        el.textContent = Math.round(start);
    }, step);
}

function resetSoleLuna() {
    document.getElementById("sun").style.opacity = "1";
    document.getElementById("moon").style.opacity = "0";
    document.getElementById("sky").style.background = "linear-gradient(#87CEEB, #ffffff)";
}

// ----------------------
// PREVENTIVO & ANALISI RISPARMIO
// ----------------------

document.getElementById("btn-calcola").addEventListener("click", () => {
    calcolaPrimoAnno();
    calcolaPreventivo();
    calcolaRendimento10Anni();
});

document.getElementById("btn-reset-preventivo").addEventListener("click", () => {
    document.querySelectorAll("#dati-energetici input").forEach(i => i.value = i.defaultValue || "");
    document.querySelectorAll("#risultati-primo-anno span").forEach(s => s.textContent = "");
    document.querySelectorAll("#tab-preventivo-body .diff, #tab-preventivo-body .margine").forEach(td => td.textContent = "");
    document.getElementById("tot-nostro").textContent = "";
    document.getElementById("tot-concorrenza").textContent = "";
    document.getElementById("tot-diff").textContent = "";
    document.getElementById("tot-margine").textContent = "";
    document.getElementById("tab-rendimento-body").innerHTML = "";
    document.getElementById("totale-10-anni").textContent = "";
});

function calcolaPrimoAnno() {
    const consumoAnn = +document.getElementById("consumo-annuo").value || 0;
    const produzioneAnn = +document.getElementById("produzione-annua").value || 0;
    const costoEnergia = +document.getElementById("costo-energia").value || 0;
    const quotaAutoconsumoPerc = +document.getElementById("quota-autoconsumo").value || 0;
    const prezzoRID = +document.getElementById("prezzo-rid").value || 0;

    const quotaAutoconsumo = quotaAutoconsumoPerc / 100;

    const autoconsumoKWh = Math.min(produzioneAnn, consumoAnn) * quotaAutoconsumo;
    const immissioneKWh = Math.max(produzioneAnn - autoconsumoKWh, 0);

    const risparmioDiretto = autoconsumoKWh * costoEnergia;
    const guadagnoRID = immissioneKWh * prezzoRID;
    const beneficioTotale = risparmioDiretto + guadagnoRID;

    document.getElementById("risparmio-diretto").textContent = risparmioDiretto.toFixed(0);
    document.getElementById("guadagno-rid").textContent = guadagnoRID.toFixed(0);
    document.getElementById("beneficio-totale").textContent = beneficioTotale.toFixed(0);

    window._baseAutoconsumoKWh = autoconsumoKWh;
    window._baseImmissioneKWh = immissioneKWh;
    window._baseCostoEnergia = costoEnergia;
    window._basePrezzoRID = prezzoRID;
}

function calcolaPreventivo() {
    const rows = document.querySelectorAll("#tab-preventivo-body tr");
    let totNostro = 0;
    let totConc = 0;

    rows.forEach(row => {
        const nostroInput = row.querySelector(".nostro");
        const concInput = row.querySelector(".concorrenza");
        const diffCell = row.querySelector(".diff");
        const margineCell = row.querySelector(".margine");

        const nostro = +nostroInput.value || 0;
        const conc = +concInput.value || 0;

        const diff = conc - nostro;
        const margine = conc > 0 ? (diff / conc) * 100 : 0;

        diffCell.textContent = diff.toFixed(0);
        margineCell.textContent = margine.toFixed(1) + " %";

        totNostro += nostro;
        totConc += conc;
    });

    const totDiff = totConc - totNostro;
    const totMargine = totConc > 0 ? (totDiff / totConc) * 100 : 0;

    document.getElementById("tot-nostro").textContent = totNostro.toFixed(0);
    document.getElementById("tot-concorrenza").textContent = totConc.toFixed(0);
    document.getElementById("tot-diff").textContent = totDiff.toFixed(0);
    document.getElementById("tot-margine").textContent = totMargine.toFixed(1) + " %";
}

function calcolaRendimento10Anni() {
    const degrado = +document.getElementById("degrado").value || 0;
    const inflazione = +document.getElementById("inflazione").value || 0;

    const baseAutoconsumoKWh = window._baseAutoconsumoKWh || 0;
    const baseImmissioneKWh = window._baseImmissioneKWh || 0;
    const baseCostoEnergia = window._baseCostoEnergia || 0;
    const basePrezzoRID = window._basePrezzoRID || 0;

    const tbody = document.getElementById("tab-rendimento-body");
    tbody.innerHTML = "";

    let cumulato = 0;

    for (let anno = 1; anno <= 10; anno++) {
        const efficienza = Math.pow(1 - degrado, anno - 1);
        const valoreEnergia = baseCostoEnergia * Math.pow(1 + inflazione, anno - 1);

        const rispAutoconsumo = baseAutoconsumoKWh * efficienza * valoreEnergia;
        const guadagnoRete = baseImmissioneKWh * efficienza * basePrezzoRID;
        const rendimentoTotale = rispAutoconsumo + guadagnoRete;

        cumulato += rendimentoTotale;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${anno}</td>
          <td>${(efficienza * 100).toFixed(1)}%</td>
          <td>${valoreEnergia.toFixed(3)}</td>
          <td>${rispAutoconsumo.toFixed(0)}</td>
          <td>${guadagnoRete.toFixed(0)}</td>
          <td>${rendimentoTotale.toFixed(0)}</td>
          <td>${cumulato.toFixed(0)}</td>
        `;
        tbody.appendChild(tr);
    }

    document.getElementById("totale-10-anni").textContent = cumulato.toFixed(0) + " €";
}

document.querySelectorAll("#tab-preventivo-body input").forEach(inp => {
    inp.addEventListener("input", calcolaPreventivo);
});
