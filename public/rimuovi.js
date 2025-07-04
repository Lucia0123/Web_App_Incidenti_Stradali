document.getElementById('rimuoviLuogoForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previene il comportamento predefinito del form (ricaricamento della pagina)
    const regione = document.getElementById('regioni').value;
    const provincia = document.getElementById('provincia').value;
    const strada = document.getElementById('nomeStrada').value;

    const response = await fetch('/admin/rimuoviluogo', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({regione, provincia, strada})
    });

    if (response.ok) {
        alert('Luogo rimosso con successo!');
        window.location.href = '/admin';
    } else {
        alert('Errore nell\'eliminazione del luogo.');
    }
});