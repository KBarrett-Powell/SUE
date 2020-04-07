const http = require('http');

const express = require('express');
const app = express();

const sensors = require('./js/getSensors.js');
const events = require('./js/getEvents.js');
const complex = require('./js/getComplex.js');
const video = require('./js/getVideo.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

app.use('/json', express.static(__dirname + '/json'));
app.use('/media', express.static(__dirname + '/media'));

app.use('/sensors', sensors);
app.use('/events', events);
app.use('/complex', complex);
app.use('/video', video);

const server = http.createServer(app);
const port = 8000;

server.listen(port);

console.debug('Server listening on port ' + port);
