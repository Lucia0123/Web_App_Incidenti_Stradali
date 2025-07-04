document.getElementById("lista").addEventListener("click", async function(event){
  // Verifica se l'elemento cliccato è un <li>
  if (event.target && event.target.nodeName === 'LI') {
    // seleziono il nome della regione cliccata, da usare poi nel path per il fetch
    const regione = event.target.getAttribute('id');
    // modifico il contenuto del titolo in modo che rifletti il nome della regione selezionata
    document.getElementById("regione").textContent = "Hai cliccato su: " + event.target.textContent;

    const response = await fetch(`/regioni/${regione}`); // attendo che venga fornita la tabella corrispondente
    const tabellaHtml = await response.text();
    document.getElementById('placeholderTabella').innerHTML = tabellaHtml;
    document.getElementById("contenutoDellaRegione").style.visibility = 'visible';
    document.getElementById("nav2").style.visibility = 'visible';
  }
});

document.getElementById("logout").addEventListener("click", async function(event){
  window.location.href = '/logout';
  window.location.href = '/home';
});

document.getElementById("aggiungi").addEventListener("click", async function(event){
  window.location.href = '/admin/aggiungi';
});

document.getElementById("elimina").addEventListener("click", async function(event){
  window.location.href = '/admin/elimina';
});

document.getElementById("modifica").addEventListener("click", async function(event){
  window.location.href = '/admin/modifica';
});