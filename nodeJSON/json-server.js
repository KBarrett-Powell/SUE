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

wsServer.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

wsServer.on('connection', function (wsClient) {
  console.log('connected');

  wsClient.id = wsServer.getUniqueID();
  wsClient.sue = false;

  wsClient.on('message', async function (message) {
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
        wsClient.sue = true;
        SUEClients.push(wsClient);

        let eventlst = await events.getEvents(null);
        wsClient.send(eventlst);

        let sensorlst = await sensors.getSensors(null);
        wsClient.send(sensorlst);
        
        let complexlst = await complex.getComplex(null);
        wsClient.send(complexlst);
                
      } else if (parsedMessage.type.toLowerCase() == "post") {
          
        if (parsedMessage.events != null) {
          let update = await events.postEvent(parsedMessage.events);
          sendAll(SUEClients, update);
          wsClient.send(JSON.stringify(update));
        } 

        if (parsedMessage.sensors != null) {
          let update = await sensors.postSensor(parsedMessage.sensors);
          sendAll(SUEClients, update);
          wsClient.send(JSON.stringify(update));
        } 
        
        if (parsedMessage.complex != null) {
          let update = await complex.postComplex(parsedMessage.complex);
          sendAll(SUEClients, update);
          wsClient.send(JSON.stringify(update));
        }

      } else if (parsedMessage.type.toLowerCase() == "get") {

        if (parsedMessage.events != null) {
          let response = await events.getEvents(parsedMessage.events);
          wsClient.send(response);
        } 

        if (parsedMessage.sensors != null) {
          let response = await sensors.getSensors(parsedMessage.sensors);
          wsClient.send(response);
        } 
        
        if (parsedMessage.complex != null) {
          let response = await complex.getComplex(parsedMessage.complex);
          wsClient.send(response);
        }

      } else if (parsedMessage.type.toLowerCase() == "delete") {

        if (parsedMessage.events != null) {
          let response = await events.deleteEvent(parsedMessage.events);
          sendAll(SUEClients, response);
        } 
        
        if (parsedMessage.sensors != null) {
          let response = await sensors.deleteSensor(parsedMessage.sensors);
          sendAll(SUEClients, response);
        } 
        
        if (parsedMessage.complex != null) {
          let response = await complex.deleteComplex(parsedMessage.complex);
          sendAll(SUEClients, response);
        }
      }
    }
  });

  wsClient.on('close', function () {
    if ( wsClient.sue ) {
      var removeIndex = SUEClients.map(function(item) { return item.id; }).indexOf(wsClient.id);
      SUEClients.splice(removeIndex, 1);
    }
    console.log('closed');
  });
});

function sendAll( SUEClients, update ) {
  if (update != null) {
    for (var i = 0; i < SUEClients.length; i ++) {
        SUEClients[i].send(JSON.stringify(update));
    }
  }
}
