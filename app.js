/* ============================================================
   SLIDER AUTOCONSUMO (solo aggiornamento testo)
============================================================ */
const autocSlider = document.getElementById("autoconsumoPerc");
const autocVal = document.getElementById("autoconsumoVal");

autocSlider.addEventListener("input", () => {
    autocVal.textContent = autocSlider.value + "%";
});


/* ============================================================
   SIMULAZIONE (SEMPLICE, COME RICHIESTO)
   Nessun output grafico → solo conferma
============================================================ */
document.getElementById("btnCalcola").addEventListener("click", () => {
    alert("Simulazione avviata.");
});


/* ============================================================
   PREVENTIVO — FUNZIONAMENTO COMPLETO
   - Q.tà = input number
   - Prezzo RS = slider
   - Prezzo concorrenza = RS + 15%
   - Risparmio % e € calcolati automaticamente
============================================================ */

function aggiornaPreventivo() {

    const righe = document.querySelectorAll("#preventivo tbody tr");

    let totaleRS = 0;
    let totaleConc = 0;
    let totaleEuro = 0;
    let sommaPerc = 0;

    righe.forEach(riga => {

        const qty = parseFloat(riga.querySelector(".qty").value) || 0;
        const slider = parseFloat(riga.querySelector(".slider").value) || 0;

        // Mostra valore slider
        riga.querySelector(".sliderVal").textContent = slider + " €";

        // Calcoli
        const prezzoRS = qty * slider;
        const prezzoConc = prezzoRS * 1.15;
        const risparmioEuro = prezzoConc - prezzoRS;
        const risparmioPerc = prezzoConc > 0 ? (risparmioEuro / prezzoConc) * 100 : 0;

        // Output riga
        riga.querySelector(".conc").textContent = prezzoConc.toFixed(2);
        riga.querySelector(".euro").textContent = risparmioEuro.toFixed(2);
        riga.querySelector(".perc").textContent = risparmioPerc.toFixed(1) + "%";

        // Totali
        totaleRS += prezzoRS;
        totaleConc += prezzoConc;
        totaleEuro += risparmioEuro;
        sommaPerc += risparmioPerc;
    });

    // Output totali
    document.getElementById("totaleRS").textContent = totaleRS.toFixed(2);
    document.getElementById("totaleConc").textContent = totaleConc.toFixed(2);
    document.getElementById("totaleEuro").textContent = totaleEuro.toFixed(2);
    document.getElementById("mediaPerc").textContent = (sommaPerc / righe.length).toFixed(1) + "%";
}

// Attiva aggiornamento dinamico
document.querySelectorAll(".slider").forEach(slider => {
    slider.addEventListener("input", aggiornaPreventivo);
});
document.querySelectorAll(".qty").forEach(qty => {
    qty.addEventListener("input", aggiornaPreventivo);
});

// Calcolo iniziale
aggiornaPreventivo();


/* ============================================================
   TABELLA RENDIMENTO 10 ANNI — STATICA
   Nessun JS richiesto
============================================================ */
// Vuota di proposito

