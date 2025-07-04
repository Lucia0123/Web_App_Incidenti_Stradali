document.getElementById('modificaLuogoForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previene il comportamento predefinito del form (ricaricamento della pagina)
    const regione = document.getElementById('regioni').value;
    const provincia = document.getElementById('provincia').value;
    const strada = document.getElementById('nomeStrada').value;
    const incidentiNegliAnni = new Array(15);
    for(var i = 2004, j = 2004; i <= 2018; i++){
      incidentiNegliAnni[i - j] = document.getElementById(i.toString()).value; // salvo i valori per anno in ordine crescente
    }

    const response = await fetch('/admin/modificaluogo', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({regione, provincia, strada, incidentiNegliAnni})
    });

    if (response.ok) {
        alert('Luogo modificato con successo!');
        window.location.href = '/admin';
    } else {
        alert('Errore nella modifica del luogo.');
    }
});