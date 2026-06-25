document.getElementById("btn-avvia").addEventListener("click", () => {
    const d = {
        giorno: document.getElementById("sel-giorno").value,
        impianto: document.getElementById("sel-impianto").value,
        consumi: +document.getElementById("inp-consumi").value,
        prezzoConsumo: +document.getElementById("inp-prezzo-consumo").value,
        prezzoVendita: +document.getElementById("inp-prezzo-vendita").value,
        risparmio: +document.getElementById("inp-risparmio").value
    };
    aggiornaSimulazione(d);
});

document.getElementById("btn-reset").addEventListener("click", () => {
    document.querySelectorAll("#output-area span").forEach(el => el.textContent = "");
    document.querySelector("#batt-level").innerHTML = "";
    resetSoleLuna();
});

function aggiornaSimulazione(d) {
    // --- Alternanza sole/luna ---
    if (d.giorno === "giorno") {
        document.getElementById("sun").style.opacity = "1";
        document.getElementById("moon").style.opacity = "0";
        document.getElementById("sky").style.background = "linear-gradient(#87CEEB, #ffffff)";
    } else {
        document.getElementById("sun").style.opacity = "0";
        document.getElementById("moon").style.opacity = "1";
        document.getElementById("sky").style.background = "linear-gradient(#0b1a3a, #1a2a4a)";
    }

    // --- Calcolo produzione/autoconsumo/immissione ---
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

    // --- Calcoli automatici ---
    const rid = immissione * d.prezzoVendita;
    const renditaAnnua = d.risparmio + rid;
    const detrazione = renditaAnnua * 0.28;
    const rendita25 = (renditaAnnua + detrazione) * 25;

    // --- Aggiorna risultati ---
    animaNumero("prod", produzione);
    animaNumero("auto", autoconsumo);
    animaNumero("imm", immissione);
