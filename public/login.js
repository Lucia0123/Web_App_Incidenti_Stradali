document.getElementById('form').addEventListener('submit', async function(event){
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
  });

  if (response.ok) {
    // reindirizzamento alla pagina per l'admin
    window.location.href = '/admin';
  } else {
    console.error('Errore di autenticazione:');
    alert('Autenticazione fallita. Controlla le tue credenziali.');
  }
});