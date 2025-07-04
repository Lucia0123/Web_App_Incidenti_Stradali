const fs = require('fs'); // modulo che serve per manipolare il file incidenti.json
const csvtojson = require('csvtojson'); // per convertire incidenti.csv in .json
const express = require("express");
const path = require("path");
const app = express();
const user = { id: 1, username: 'user1', password: 'password1', loggato: false };

// Configura Express per gestire file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Middleware per il parsing del corpo della richiesta
app.use(express.json());

// ---------- Uso dell'interfaccia grafica in Glitch ----------
// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('src', __dirname);

// trasformazione dei dati da .csv a .json in una nuova copia di lavoro (incidenti.json)
csvtojson()
  .fromFile('incidenti.csv')
  .then((jsonObj) => {
    fs.writeFile('incidenti.json', JSON.stringify(jsonObj), (err) => {
      if (err) {
        console.error('Errore durante la scrittura del file JSON', err);
      } else {
        console.log('Conversione completata. File JSON creato: incidenti.json');
      }
    });
  })
  .catch((err) => {
    console.error('Errore durante la conversione da CSV a JSON', err);
  });

  app.get('/home', (req, res) => {
    user.loggato = false;
    res.render(__dirname + '/src/pages/home.html'); // fa il rendering di home.html
  });

  app.get('/login', (req, res) => {
    res.render(__dirname + '/src/pages/login.html');
  });

  // funzione per verificare le credenziali inserite dall'utente
  function authenticateUser(username, password) {
    if (user.username === username && user.password === password){
      return true;
    }
    return false;
  }

  app.post('/auth/login', (req, res) => {
    const dati = req.body;
    const autenticazioneRiuscita = authenticateUser(dati.username, dati.password);

    if (!autenticazioneRiuscita) {
      return res.status(401).json({ error: 'Autenticazione fallita' });
    }

    // Se l'utente si è autenticato correttamente
    console.log("autenticazione riuscita!");
    user.loggato = true;
    res.type('text/plain').status(200).send("Autenticazione riuscita");
  });

  // pagina riservata all'utente autenticato
  app.get('/admin', (req, res) => {
    if(user.loggato == true){
      res.render(__dirname + '/src/pages/admin.html');
    }
  });

  app.get('/admin/aggiungi', (req, res) => {
    if(user.loggato == true){
      res.render(__dirname + '/src/pages/aggiungi.html');
    }
  });

  app.get('/admin/elimina', (req, res) => {
    if(user.loggato == true){
      res.render(__dirname + '/src/pages/rimuovi.html');
    }
  });

  app.get('/admin/modifica', (req, res) => {
    if(user.loggato == true){
      res.render(__dirname + '/src/pages/modifica.html');
    }
  });

  app.post('/admin/aggiungiluogo', (req, res) => {
    var regioneDellaProvinciaSelezionata = '';
    var daInserire = ''; // oggetto da inserire
    const dati = req.body;
    // validazione degli input:
    fs.readFile('gi_province.json', 'utf-8', (err, data) => {  // nella variabile data viene memorizzato il contenuto di incidenti.json sottoforma di stringa
      if (err) { // gestisco un possibile errore nella lettura
          return res.type('text/plain').status(500).send('Errore nella lettura dei dati!');
      }
      if(user.loggato == false){
          return res.type('text/plain').status(401).send('Non autorizzato ad eseguire questa operazione');
      }
      else{
        // validazione della provincia
        var infoProvince = JSON.parse(data);
        var controllo = 0;
        infoProvince.forEach(provincia => {
          if(provincia.denominazione_provincia == dati.provincia){
            // se esiste una provincia che si chiama come quella inserita dall'utente, incremento controllo
            controllo++;
            regioneDellaProvinciaSelezionata = provincia.REGIONE;
          }
        });
        if((controllo == 0) || (regioneDellaProvinciaSelezionata != dati.regione)){
          // ricavo la regione inserita e la confronto con la regione in cui si trova la provincia inserita
          // se la provincia non è valida:
          return res.type('text/plain').status(400).send('La provincia digitata non esiste!');
        }
        // input validati, proseguo aggiungendo il dato dell'utente a incidenti.json
        daInserire = {  // creo oggetto da inserire
          "2004": dati.incidentiNegliAnni[0],
          "2005": dati.incidentiNegliAnni[1],
          "2006": dati.incidentiNegliAnni[2],
          "2007": dati.incidentiNegliAnni[3],
          "2008": dati.incidentiNegliAnni[4],
          "2009": dati.incidentiNegliAnni[5],
          "2010": dati.incidentiNegliAnni[6],
          "2011": dati.incidentiNegliAnni[7],
          "2012": dati.incidentiNegliAnni[8],
          "2013": dati.incidentiNegliAnni[9],
          "2014": dati.incidentiNegliAnni[10],
          "2015": dati.incidentiNegliAnni[11],
          "2016": dati.incidentiNegliAnni[12],
          "2017": dati.incidentiNegliAnni[13],
          "2018": dati.incidentiNegliAnni[14],
          "_id": "-",
          "cReg": "-",
          "REGIONE": dati.regione,
          "cProv": "-",
          "PROVINCIA": dati.provincia,
          "CODICE": "-",
          "NOME STRADA": dati.strada,
          "ESTESA": "-",
          "incid/km 2018": "-"
        }
      // inserimento
      fs.readFile('incidenti.json', 'utf-8', (err, data) => {
        if (err) {
          return res.type('text/plain').status(500).send('Errore nella lettura dei dati!');
        }
        const incidenti = JSON.parse(data);
        incidenti.push(daInserire);
        fs.writeFile('incidenti.json', JSON.stringify(incidenti), (err) => {
        if (err) {
          return res.status(500).send('Errore durante la scrittura dei dati!');
        }
        res.type('text/plain').status(200).send('Luogo inserito');       
        });   
      });
    }
  });
});

app.put('/admin/modificaluogo', (req, res) => {
    var regioneDellaProvinciaSelezionata = '';
    var dati = req.body;
    // validazione degli input:
    fs.readFile('gi_province.json', 'utf-8', (err, data) => {  // nella variabile data viene memorizzato il contenuto di incidenti.json sottoforma di stringa
      if (err) { // gestisco un possibile errore nella lettura
          return res.type('text/plain').status(500).send('Errore nella lettura dei dati!');
      }
      if(user.loggato == false){
          return res.type('text/plain').status(401).send('Non autorizzato ad eseguire questa operazione');
      }
      else{
        // validazione della provincia
        var infoProvince = JSON.parse(data);
        var controllo = 0;
        infoProvince.forEach(provincia => {
          if(provincia.denominazione_provincia == dati.provincia){
            // se esiste una provincia che si chiama come quella inserita dall'utente, incremento controllo
            controllo++;
            regioneDellaProvinciaSelezionata = provincia.REGIONE;
          }
        });
        if((controllo == 0) || (regioneDellaProvinciaSelezionata != dati.regione)){
          // ricavo il codice della regione inserita e lo confronto con quello della regione in cui si trova la provincia
          // se la provincia non è valida
          return res.type('text/plain').status(400).send('La provincia digitata non esiste!');
        }

      // cerco l'elemento da modificare
      fs.readFile('incidenti.json', 'utf-8', (err, data) => {
        if (err) {
          return res.type('text/plain').status(500).send('Errore nella lettura dei dati!');
        }
        
        const incidenti = JSON.parse(data);
        var nuovoArray = [];
        incidenti.forEach(luogo => {
          // confronto gli attributi dell'oggetto che sto esaminando con quelli dell'oggetto da modificare
          // uso replace per non tenere conto gli spazi durante il confronto fra strade e province
          if(luogo["NOME STRADA"].replace(/\s+/g, '') != dati.strada.replace(/\s+/g, '') || luogo.PROVINCIA.replace(/\s+/g, '') != dati.provincia.replace(/\s+/g, '') || luogo.REGIONE != dati.regione){
            nuovoArray.push(luogo);
          }
          else{
            console.log(luogo);
            luogo["2004"] = dati.incidentiNegliAnni[0];
            luogo["2005"] = dati.incidentiNegliAnni[1];
            luogo["2006"] = dati.incidentiNegliAnni[2];
            luogo["2007"] = dati.incidentiNegliAnni[3];
            luogo["2008"] = dati.incidentiNegliAnni[4];
            luogo["2009"] = dati.incidentiNegliAnni[5];
            luogo["2010"] = dati.incidentiNegliAnni[6];
            luogo["2011"] = dati.incidentiNegliAnni[7];
            luogo["2012"] = dati.incidentiNegliAnni[8];
            luogo["2013"] = dati.incidentiNegliAnni[9];
            luogo["2014"] = dati.incidentiNegliAnni[10];
            luogo["2015"] = dati.incidentiNegliAnni[11];
            luogo["2016"] = dati.incidentiNegliAnni[12];
            luogo["2017"] = dati.incidentiNegliAnni[13];
            luogo["2018"] = dati.incidentiNegliAnni[14];
            console.log(luogo);
            nuovoArray.push(luogo); // pusho il luogo modificato
          }
        })
        
        fs.writeFile('incidenti.json', JSON.stringify(nuovoArray, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Errore durante la scrittura dei dati!');
        }
        res.type('text/plain').status(200).send('Luogo modificato');       
        });   
      });
    }
  });
});

app.delete('/admin/rimuoviluogo', (req, res) => {
    var regioneDellaProvinciaSelezionata = '';
    var daRimuovere = '';
    const dati = req.body;
    // validazione degli input:
    fs.readFile('gi_province.json', 'utf-8', (err, data) => {  // nella variabile data viene memorizzato il contenuto di incidenti.json sottoforma di stringa
      if (err) { // gestisco un possibile errore nella lettura
          return res.type('text/plain').status(500).send('Errore nella lettura dei dati!');
      }
      if(user.loggato == false){
          return res.type('text/plain').status(401).send('Non autorizzato ad eseguire questa operazione');
      }
      else{
        // validazione della provincia
        var infoProvince = JSON.parse(data);
        var controllo = 0;
        infoProvince.forEach(provincia => {
          if(provincia.denominazione_provincia == dati.provincia){
            // se esiste una provincia che si chiama come quella inserita dall'utente, incremento controllo
            controllo++;
            regioneDellaProvinciaSelezionata = provincia.REGIONE;
          }
        });
        if((controllo == 0) || (regioneDellaProvinciaSelezionata != dati.regione)){
          // ricavo il codice della regione inserita e lo confronto con quello della regione in cui si trova la provincia
          // se la provincia non è valida
          return res.type('text/plain').status(400).send('La provincia digitata non esiste!');
        }

      // cerco l'elemento da rimuovere
      fs.readFile('incidenti.json', 'utf-8', (err, data) => {
        if (err) {
          return res.type('text/plain').status(500).send('Errore nella lettura dei dati!');
        }
        
        const incidenti = JSON.parse(data);
        var nuovoArray = [];
        incidenti.forEach(luogo => {
          // confronto gli attributi dell'oggetto che sto esaminando con quelli dell'oggetto da eliminare
          // uso replace per non tenere conto gli spazi durante il confronto fra strade e province
          if(luogo["NOME STRADA"].replace(/\s+/g, '') != dati.strada.replace(/\s+/g, '') || luogo.PROVINCIA.replace(/\s+/g, '') != dati.provincia.replace(/\s+/g, '') || luogo.REGIONE != dati.regione){
            nuovoArray.push(luogo);
          }
        })
        
        fs.writeFile('incidenti.json', JSON.stringify(nuovoArray, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Errore durante la scrittura dei dati!');
        }
        res.type('text/plain').status(200).send('Luogo rimosso');       
        });   
      });
    }
  });
});

  app.get('/logout', function(req, res){
    user.loggato = false;
    res.status(200).send("Logout effettuato"); 
  });

  // richiesta get con passaggio del parametro regione tramite path
  app.get('/regioni/:regione', function(req, res){
    var righe = '';
    fs.readFile('incidenti.json', 'utf-8', (err, data) => {  // nella variabile data viene memorizzato il contenuto di incidenti.json sottoforma di stringa
      if (err) { // gestisco un possibile errore nella lettura
          return res.status(500).send('Errore nella lettura dei dati!');
      }
      else{
        // ricavo la regione richiesta
        const regioneRichiesta = req.params.regione;
        // inizio ad analizzare il file json
        const luoghiDiIncidente = JSON.parse(data);
        luoghiDiIncidente.forEach(luogo => {
          // memorizzo tutti gli incidenti avvenuti nella regione richiesta in una tabella html
          // replace serve a rimuovere tutti gli spazi dalla stringa esaminata
          var regioneEsaminata = luogo.REGIONE.toLowerCase().replace(/\s+/g, '');
          if(regioneEsaminata == regioneRichiesta){
            // calcolo la media di incidenti capitati in quel luogo negli anni 2004-2018
            var numeroIncidenti = 0;
            var anniConIncidenti = 0;
            for(var i = 2004; i <= 2018; i++){
              // controllo se il dato è effettivamente numerico
              if(!isNaN(luogo[i])){
                // se i è un numero lo includo nel calcolo della media
                numeroIncidenti += Number(luogo[i]);
                anniConIncidenti++;
              }
            }
            var media = Math.round(numeroIncidenti / anniConIncidenti); // media arrotondata degli incidenti in un anno
            righe += `
                <tr>
                    <td>${luogo.PROVINCIA}</td>
                    <td>${numeroIncidenti}</td>
                    <td>${media}</td>
                    <td>${luogo["NOME STRADA"]}</td>
                </tr>
            `;
          }
        });
        const tabellaHtml = `
          <table>
              <tr>
                  <th>Provincia</th>
                  <th>Numero totale di incidenti</th>
                  <th>Media di incidenti all'anno</th>
                  <th>Nome strada</th>
              </tr>
              ${righe}
          </table>`;
        res.type('text/html').send(tabellaHtml);
      }
    });
  });

// Makes the server listen for connections on port
const server = app.listen(process.env.PORT, function () {
  console.log("Listening for connections on port " + process.env.PORT);
});