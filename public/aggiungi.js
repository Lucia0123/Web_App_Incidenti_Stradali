document.getElementById('aggiungiLuogoForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // "sovrascrivo" l'azione predefinita del form
    const regione = document.getElementById('regioni').value;
    const provincia = document.getElementById('provincia').value;
    const strada = document.getElementById('nomeStrada').value;
    var incidentiNegliAnni = new Array(15);
    for(var i = 2004, j = 2004; i <= 2018; i++){
        incidentiNegliAnni[i - j] = document.getElementById(i.toString()).value; // salvo i valori per anno in ordine crescente
    }

    const response = await fetch('/admin/aggiungiluogo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ regione, provincia, strada, incidentiNegliAnni }) // mando i dati in json
    });

    if (response.ok) {
        alert('Luogo aggiunto con successo!');
        window.location.href = '/admin';
    } else {
        alert('Errore: il luogo non è stato aggiunto!');
    }
});