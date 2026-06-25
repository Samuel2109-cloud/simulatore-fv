// --- EVENTO AVVIO SIMULAZIONE ---
document.getElementById("btn-avvia").addEventListener("click", () => {

    const d = {
        giorno: document.getElementById("sel-giorno").value,
        impianto: document.getElementById("sel-impianto").value,
        consumi: +document.getElementById("inp-consumi").value,
        prezzoConsumo: +document.getElementById("inp-prezzo-consumo").value,
        prezzoVendita: +document.getElementById("inp-prezzo-vendita").value,
        risparmio: +document.getElementById("inp-risparmio").value,
        rimborso: +document.getElementById("inp-rimborso").value,
        renditaAnnua: +document.getElementById("inp-rendita-annua").value,
        detrazione: +document.getElementById("inp-detrazione").value,
        rendita25: +document.getElementById("inp-rendita-25").value
    };

    aggiornaSimulazione(d);
});


// --- EVENTO RESET ---
document.getElementById("btn-reset").addEventListener("click", () => {
    document.querySelectorAll("#output-area span").forEach(el => el.textContent = "");
    document.querySelector("#batt-level").innerHTML = "";
    resetSoleLuna();
});


// --- FUNZIONE PRINCIPALE ---
function aggiornaSimulazione(d) {

    // --- Alternanza sole/luna ---
    if (d.giorno === "giorno") {
        document.getElementById("sun").style.opacity = "1";
        document.getElementById("sun").style.left = "20px";

        document.getElementById("moon").style.opacity = "0";
        document.getElementById("moon").style.right = "-100px";

        document.getElementById("sky").style.background = "linear-gradient(#87CEEB, #ffffff)";
    } else {
        document.getElementById("sun").style.opacity = "0";
        document.getElementById("sun").style.left = "-100px";

        document.getElementById("moon").style.opacity = "1";
        document.getElementById("moon").style.right = "20px";

        document.getElementById("sky").style.background = "linear-gradient(#0b1a3a, #1a2a4a)";
    }


    // --- Calcolo produzione/autoconsumo/immissione in base al tipo impianto ---
    let produzione = 0;
    let autoconsumo = 0;
    let immissione = 0;

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


    // --- Aggiorna numeri animati ---
    animaNumero("prod", produzione);
    animaNumero("auto", autoconsumo);
    animaNumero("imm", immissione);

    animaNumero("risp", d.risparmio);
    animaNumero("ssp", d.rimborso);
    animaNumero("rend-annua", d.renditaAnnua);
    animaNumero("detrazione", d.detrazione);
    animaNumero("rend-25", d.rendita25);


    // --- Batteria (se impianto con accumulo) ---
    const livello = d.impianto.includes("a") ? 80 : 10;

    document.querySelector("#batt-level").innerHTML =
        `<div style="width:${livello}%;height:100%;background:green;"></div>`;
}


// --- FUNZIONE ANIMAZIONE NUMERI ---
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


// --- RESET SOLE/LUNA ---
function resetSoleLuna() {
    document.getElementById("sun").style.opacity = "1";
    document.getElementById("sun").style.left = "20px";

    document.getElementById("moon").style.opacity = "0";
    document.getElementById("moon").style.right = "-100px";

    document.getElementById("sky").style.background = "linear-gradient(#87CEEB, #ffffff)";
}
