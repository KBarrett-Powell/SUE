const SocketServer = require('ws').Server;

const express = require('express');
const path = require('path');

const app = express();

const router = express.Router();
const port = 8000;

const sensors = require('./js/getSensors.js');
const events = require('./js/getEvents.js');
const complex = require('./js/getComplex.js');
const video = require('./js/getVideo.js');
const audio = require('./js/getAudio.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:8082');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.use('/json', express.static(__dirname + '/json'));
router.use('/media', express.static(__dirname + '/media'));

router.use('/sensors', sensors.router);
router.use('/events', events.router);
router.use('/complex', complex.router);
router.use('/video', video.router);
router.use('/audio', audio.router);

router.get('/status', function(req, res) {
  res.json({ status: 'App is running!' });
});

app.use("/", router);
app.use(express.static('static'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/json-server.html'));
});

const server = app.listen(port, function () {
  console.log('Node.js static server listening on port: ' + port + ", with websockets listener")
});

let SUEClients = [];

const wsServer = new SocketServer({ server });

wsServer.on('connection', function (wsClient) {
  console.log('connected');
  console.log('SUE clients: ', SUEClients.length);

  wsClient.on('message', function (message) {
    console.log('received: %s', message);

    let parsedMessage
    let error = false;

    try {
      parsedMessage = JSON.parse(message);
    } catch {
      wsClient.send("Invalid Message - not JSON");
      error = true;
    }

    if (!error) {
      if (parsedMessage.type.toLowerCase() == "add-sue-client") {
        SUEClients.push(wsClient);
                
      } else if (parsedMessage.type.toLowerCase() == "post") {
          
        if (parsedMessage.events != null) {
          events.postEvent(parsedMessage.events);
          wsClient.send("POST command successfully implemented");
          
        } else if (parsedMessage.sensors != null) {
          sensors.postSensor(parsedMessage.sensors);
          wsClient.send("POST command successfully implemented");

        } else {
          complex.postComplex(parsedMessage.complex);
          wsClient.send("POST command successfully implemented");

        }

        // for(let client of wsServer.clients) {
        //   client.send(parsedMessage);
        // }
        
      } else if (parsedMessage.type.toLowerCase() == "get") {
        if (parsedMessage.events != null) {
          let response = events.getEvent(parsedMessage.events);
          wsClient.send(response);
          
        } else if (parsedMessage.sensors != null) {
          let response = sensors.getSensor(parsedMessage.sensors);
          wsClient.send(response);

        } else if (parsedMessage.complex != null) {
          let response = complex.getComplex(parsedMessage.complex);
          wsClient.send(response);

        } else {
          let sensors = sensors.getSensor(null);
          let events = events.getEvent(null);
          let complex = complex.getComplex(null);
          wsClient.send("GET command successfully implemented");
        }
        
      } else if (parsedMessage.type.toLowerCase() == "delete") {
        if (parsedMessage.events != null) {
          events.deleteEvent(parsedMessage.events);
          wsClient.send("DELETE command successfully implemented");
          
        } else if (parsedMessage.sensors != null) {
          sensors.deleteSensor(parsedMessage.sensors);
          wsClient.send("DELETE command successfully implemented");

        } else {
          complex.deleteComplex(parsedMessage.complex);
          wsClient.send("DELETE command successfully implemented");

        }

        // for(let client of wsServer.clients) {
        //   client.send(parsedMessage);
        // }
      }
    }
  });

  wsClient.on('close', function () {
    if ( SUEClients.includes(wsClient) ) {
      console.log("removing SUE client");
      SUEClients.filter(client => client !== wsClient);

    }
    console.log('closed');
    console.log('SUE clients: ', SUEClients.length);
  });
});