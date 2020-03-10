var http = require('http');
var cors = require('cors');

var express = require('express');
var app = express();

var sensors = require('./modules/getSensors.js');
var events = require('./modules/getEvents.js');
var complex = require('./modules/getComplex.js');
var video = require('./modules/getVideo.js');

app.use(express.json());

app.use('/sensors', sensors);
app.use('/events', events);
app.use('/complex', complex);
app.use('/video', video);

app.use(cors());

var server = http.createServer(app);
var port = 8000;

server.listen(port);

console.debug('Server listening on port ' + port);