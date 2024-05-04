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

// Objeto para almacenar las URLs de manera dinámica
const urlsDatabase = {};

// Función para agregar una URL al objeto de base de datos
function agregarURL(originalUrl) {
    const shortUrl = Object.keys(urlsDatabase).length + 1; // Generar un nuevo short_url
    urlsDatabase[shortUrl] = originalUrl; // Asignar la originalUrl al short_url generado
    return shortUrl; // Devolver el short_url generado
}

// Función para obtener la originalUrl a partir de un short_url
function obtenerOriginalUrl(shortUrl) {
    return urlsDatabase[shortUrl]; // Devolver la originalUrl correspondiente al short_url dado
}

app.get('/api/shorturl/:short_url', function(req, res) {
  // Obtener el short_url de los parámetros de la ruta
  const shortUrl = req.params.short_url;

  // Verificar si el short_url existe en la base de datos
  if (urlsDatabase.hasOwnProperty(shortUrl)) {
    // Si el short_url existe, redirigir al usuario a la URL original
    url_redirect = obtenerOriginalUrl(shortUrl)
    res.redirect(url_redirect);
  } else {
    // Si el short_url no existe, devolver un mensaje de error
    res.status(404).json({ error: 'Short URL not found' });
  }
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  url_body = req.body.url
  console.log("URL: ", url_body)
  is_valid = validarURL(url_body)
  if (is_valid){
    const shortUrl = agregarURL(url_body);
    console.log(urlsDatabase)
    result = {
      original_url: url_body,
      short_url: shortUrl
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
