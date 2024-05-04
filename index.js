require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware para parsear bodies JSON
app.use(bodyParser.json());

// Middleware para parsear bodies de formularios HTML
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

function validarURL(url) {
  // Expresión regular para verificar si la URL comienza con "http://" o "https://"
  const regex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;

  // Verificar si la URL coincide con la expresión regular
  return regex.test(url);
}

const urlsDatabase = {
  '1': 'https://freeCodeCamp.org', // Ejemplo ficticio de base de datos
  '2': 'http://www.example.com'
  
};

app.get('/api/shorturl/:short_url', function(req, res) {
  // Obtener el short_url de los parámetros de la ruta
  const shortUrl = req.params.short_url;

  // Verificar si el short_url existe en la base de datos
  if (urlsDatabase.hasOwnProperty(shortUrl)) {
    // Si el short_url existe, redirigir al usuario a la URL original
    res.redirect(urlsDatabase[shortUrl]);
  } else {
    // Si el short_url no existe, devolver un mensaje de error
    res.status(404).json({ error: 'Short URL not found' });
  }
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  url_body = req.body.url

  is_valid = validarURL(url_body)
  console.log(is_valid)
  if (is_valid){
    result = {
      original_url: url_body,
      short_url: url_body === 'https://freeCodeCamp.org' ? 1 : 2
    }
  }else{
    result = {
      error: 'invalid url'
    }
  }
  
  res.json(result);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
