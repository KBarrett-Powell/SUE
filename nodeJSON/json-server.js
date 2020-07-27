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

events.refreshEvents();
sensors.refreshSensors();
complex.refreshComplex();

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
          for ( let i in update ) {
            sendAll(SUEClients, update[i]);
          }

          let allUpdated = getUpdatedID(update);
          for ( let i in allUpdated ) {
            wsClient.send(JSON.stringify({"success": {"eventID": allUpdated[i]}}));
          }
        } 

        if (parsedMessage.sensors != null) {
          let update = await sensors.postSensor(parsedMessage.sensors);
          for ( let i in update ) {
            sendAll(SUEClients, update[i]);
          }

          let allUpdated = getUpdatedID(update);
          for ( let i in allUpdated ) {
            wsClient.send(JSON.stringify({"success": {"sensorID": allUpdated[i]}}));
          }
        } 
        
        if (parsedMessage.complex != null) {
          let update = await complex.postComplex(parsedMessage.complex);
          for ( let i in update ) {
            sendAll(SUEClients, update[i]);
          }

          let allUpdated = getUpdatedID(update);
          for ( let i in allUpdated ) {
            wsClient.send(JSON.stringify({"success": {"complexID": allUpdated[i]}}));
          }
        }

      } else if (parsedMessage.type.toLowerCase() == "get") {

        if (parsedMessage.events != null) {
          let response = await events.getEvents(parsedMessage.events);
          let allUpdated = getUpdatedObject(JSON.parse(response));
          wsClient.send(JSON.stringify({"success": {"events": allUpdated}}));
        } 

        if (parsedMessage.sensors != null) {
          let response = await sensors.getSensors(parsedMessage.sensors);
          let allUpdated = getUpdatedObject(JSON.parse(response));
          wsClient.send(JSON.stringify({"success": {"sensors": allUpdated}}));
        } 
        
        if (parsedMessage.complex != null) {
          let response = await complex.getComplex(parsedMessage.complex);
          let allUpdated = getUpdatedObject(JSON.parse(response));
          wsClient.send(JSON.stringify({"success": {"complexes": allUpdated}}));
        }

      } else if (parsedMessage.type.toLowerCase() == "delete") {

        if (parsedMessage.events != null) {
          let response = await events.deleteEvent(parsedMessage.events, true);
          sendAll(SUEClients, response);

          let allUpdated = getUpdatedID(response);
          for ( let i in allUpdated ) {
            wsClient.send(JSON.stringify({"success": {"eventID": allUpdated[i]}}));
          }
        } 
        
        if (parsedMessage.sensors != null) {
          let response = await sensors.deleteSensor(parsedMessage.sensors, true);
          sendAll(SUEClients, response);

          let allUpdated = getUpdatedID(response);
          for ( let i in allUpdated ) {
            wsClient.send(JSON.stringify({"success": {"sensorID": allUpdated[i]}}));
          }
        } 
        
        if (parsedMessage.complex != null) {
          let response = await complex.deleteComplex(parsedMessage.complex);
          sendAll(SUEClients, response);

          let allUpdated = getUpdatedID(response);
          for ( let i in allUpdated ) {
            wsClient.send(JSON.stringify({"success": {"complexID": allUpdated[i]}}));
          }
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

function getUpdatedID(response) {
  let ids = [];

  for ( let i in response.sensorUK ) {
    ids.push(response.sensorUK[i].properties.sensorID);
  }
  for ( let i in response.sensorUS ) {
    ids.push(response.sensorUS[i].properties.sensorID);
  }
  for ( let i in response.critPriorityEvent ) {
    ids.push(response.critPriorityEvent[i].properties.eventID);
  }
  for ( let i in response.highPriorityEvent ) {
    ids.push(response.highPriorityEvent[i].properties.eventID);
  }
  for ( let i in response.medPriorityEvent ) {
    ids.push(response.medPriorityEvent[i].properties.eventID);
  }
  for ( let i in response.lowPriorityEvent ) {
    ids.push(response.lowPriorityEvent[i].properties.eventID);
  }
  for ( let i in response.complexEvent ) {
    ids.push(response.complexEvent[i].properties.complexID);
  }

  return ids;
};

function getUpdatedObject(response) {
  let objects = [];

  for ( let i in response.sensorUK ) {
    objects.push(response.sensorUK[i].properties);
  }
  for ( let i in response.sensorUS ) {
    objects.push(response.sensorUS[i].properties);
  }
  for ( let i in response.critPriorityEvent ) {
    objects.push(response.critPriorityEvent[i].properties);
  }
  for ( let i in response.highPriorityEvent ) {
    objects.push(response.highPriorityEvent[i].properties);
  }
  for ( let i in response.medPriorityEvent ) {
    objects.push(response.medPriorityEvent[i].properties);
  }
  for ( let i in response.lowPriorityEvent ) {
    objects.push(response.lowPriorityEvent[i].properties);
  }
  for ( let i in response.complexEvent ) {
    objects.push(response.complexEvent[i].properties);
  }

  return objects;
};

function sendAll( SUEClients, update ) {
  if (update != null) {
    for (var i = 0; i < SUEClients.length; i ++) {
        SUEClients[i].send(JSON.stringify(update));
    }
  }
}; 
