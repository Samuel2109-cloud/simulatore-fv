function calcola() {

    // INPUT
    let potenza = parseFloat(document.getElementById("potenza").value);
    let produzione = parseFloat(document.getElementById("produzione").value);
    let autoconsumoPerc = parseFloat(document.getElementById("autoconsumo").value) / 100;
    let prezzoEnergia = parseFloat(document.getElementById("prezzo").value);

    let prezzoNostro = parseFloat(document.getElementById("prezzoNostro").value);
    let prezzoConc = parseFloat(document.getElementById("prezzoConcorrenza").value);

    // PRODUZIONE
    let produzioneAnnua = potenza * produzione;
    let autoconsumo = produzioneAnnua * autoconsumoPerc;
    let immRete = produzioneAnnua - autoconsumo;

    // RISPARMIO
    let risparmioAnn = autoconsumo * prezzoEnergia;

    // OUTPUT RISULTATI
    document.getElementById("prodAnnua").innerText = produzioneAnnua.toFixed(0) + " kWh";
    document.getElementById("autoConsumo").innerText = autoconsumo.toFixed(0) + " kWh";
    document.getElementById("immRete").innerText = immRete.toFixed(0) + " kWh";
    document.getElementById("risparmioAnn").innerText = risparmioAnn.toFixed(2) + " €";

    // PREVENTIVO
    let risparmioTot = prezzoConc - prezzoNostro;
    let percRisparmio = (risparmioTot / prezzoConc) * 100;

    document.getElementById("totNostro").innerText = prezzoNostro.toFixed(2) + " €";
    document.getElementById("totConc").innerText = prezzoConc.toFixed(2) + " €";
    document.getElementById("risparmioTot").innerText = risparmioTot.toFixed(2) + " €";
    document.getElementById("percRisparmio").innerText = percRisparmio.toFixed(1) + "%";

    // TABELLA RENDIMENTO 10 ANNI
    generaTabellaRendimento(produzioneAnnua, autoconsumo, immRete, prezzoEnergia);
}

function generaTabellaRendimento(prodAnnua, autoconsumo, immRete, prezzoEnergia) {

    let corpo = document.getElementById("rendimentoBody");
    corpo.innerHTML = "";

    let cumulato = 0;
    let prezzoEnergiaAnno = prezzoEnergia;

    for (let anno = 1; anno <= 10; anno++) {

        let efficienza = 100 - (anno - 1) * 0.5; // degrado 0.5% annuo
        let produzioneEff = prodAnnua * (efficienza / 100);

        let autoconsumoEff = produzioneEff * (autoconsumo / prodAnnua);
        let immReteEff = produzioneEff - autoconsumoEff;

        let risparmio = autoconsumoEff * prezzoEnergiaAnno;
        let guadagno = immReteEff * 0.12; // valore medio SSP

        let totale = risparmio + guadagno;
        cumulato += totale;

        let riga = `
            <tr>
                <td>${anno}</td>
                <td>${efficienza.toFixed(1)}%</td>
                <td>${prezzoEnergiaAnno.toFixed(3)} €</td>
                <td>${risparmio.toFixed(2)} €</td>
                <td>${guadagno.toFixed(2)} €</td>
                <td>${totale.toFixed(2)} €</td>
                <td>${cumulato.toFixed(2)} €</td>
            </tr>
        `;

        corpo.innerHTML += riga;

        prezzoEnergiaAnno *= 1.03; // aumento 3% annuo
    }

    document.getElementById("totale10anni").innerText = cumulato.toFixed(2) + " €";
}

function resetForm() {
    document.getElementById("potenza").value = 6;
    document.getElementById("produzione").value = 1350;
    document.getElementById("autoconsumo").value = 40;
    document.getElementById("prezzo").value = 0.28;
    document.getElementById("prezzoConcorrenza").value = 14500;
    document.getElementById("prezzoNostro").value = 11800;

    document.getElementById("prodAnnua").innerText = "0 kWh";
    document.getElementById("autoConsumo").innerText = "0 kWh";
    document.getElementById("immRete").innerText = "0 kWh";
    document.getElementById("risparmioAnn").innerText = "0 €";

    document.getElementById("totNostro").innerText = "0 €";
    document.getElementById("totConc").innerText = "0 €";
    document.getElementById("risparmioTot").innerText = "0 €";
    document.getElementById("percRisparmio").innerText = "0%";

    document.getElementById("rendimentoBody").innerHTML = "";
    document.getElementById("totale10anni").innerText = "0 €";
}
