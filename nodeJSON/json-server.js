const SocketServer = require('ws').Server;

const fsp = require('fs').promises;
const mime = require('mime-types');

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
  
    let parsedMessage;
    let error = false;

    try {
      parsedMessage = JSON.parse(message);
    } catch {
      wsClient.send("Invalid Message - not JSON");
      error = true;
    }

    if (!error) {
      console.log('received: %s', parsedMessage.type);

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

        let postResponse = {};
          
        if (parsedMessage.events != null) {
          let response = await events.postEvent(parsedMessage.events);

          let eventLst = [];
          for ( let i in response ) {
            let updatedIDs = await getUpdatedID(response[i]);

            for ( let j in updatedIDs ) {
              eventLst.push({"eventID": updatedIDs[j]});
            }
            
            sendAll(SUEClients, response[i]);
          }
          postResponse.events = eventLst;
        } 

        if (parsedMessage.sensors != null) {
          let response = await sensors.postSensor(parsedMessage.sensors);

          let sensorLst = [];
          for ( let i in response ) {
            let updatedIDs = await getUpdatedID(response[i]);

            for ( let j in updatedIDs ) {
              sensorLst.push({"sensorID": updatedIDs[j]});
            }
            
            sendAll(SUEClients, response[i]);
          }
          postResponse.sensors = sensorLst;
        } 
        
        if (parsedMessage.complex != null) {
          let response = await complex.postComplex(parsedMessage.complex);

          let complexLst = [];
          for ( let i in response ) {
            let updatedIDs = await getUpdatedID(response[i]);

            for ( let j in updatedIDs ) {
              complexLst.push({"complexID": updatedIDs[j]});
            }
            
            sendAll(SUEClients, response[i]);
          }
          postResponse.complex = complexLst;
        }

        if ( Object.keys(postResponse).length > 0 ) {
          wsClient.send(JSON.stringify({"POST - success": postResponse}));
        } else {
          wsClient.send(JSON.stringify({"POST - fail": "No Items Returned"}));
        }
        
      } else if (parsedMessage.type.toLowerCase() == "get") {

        let getResponse = {};

        if (parsedMessage.events != null) {
          let response = await events.getEvents(parsedMessage.events);
          let allObjects = await getUpdatedObjects(JSON.parse(response));
          getResponse.events = allObjects;
        } 

        if (parsedMessage.sensors != null) {
          let response = await sensors.getSensors(parsedMessage.sensors);
          let allObjects = await getUpdatedObjects(JSON.parse(response));
          getResponse.sensors = allObjects;
        } 
        
        if (parsedMessage.complex != null) {
          let response = await complex.getComplex(parsedMessage.complex);
          let allObjects = await getUpdatedObjects(JSON.parse(response));
          getResponse.complex = allObjects;
        }

        if (Object.keys(getResponse).length > 0) {
          wsClient.send(JSON.stringify({"GET - success": getResponse}));
        } else {
          wsClient.send(JSON.stringify({"GET - fail": "No Items Returned"}));
        }

      } else if (parsedMessage.type.toLowerCase() == "delete") {

        let deleteResponse = {};
          
        if (parsedMessage.events != null) {
          let response = await events.deleteEvent(parsedMessage.events, true);
          
          sendAll(SUEClients, response);

          let eventLst = [];
          let updatedIDs = await getUpdatedID(response);

          for ( let i in updatedIDs ) {
            eventLst.push({"eventID": updatedIDs[i]});
          }
        
          deleteResponse.events = eventLst;
        } 

        if (parsedMessage.sensors != null) {
          let response = await sensors.deleteSensor(parsedMessage.sensors, true);
          
          sendAll(SUEClients, response);

          let sensorLst = [];
          let updatedIDs = getUpdatedID(response);
          
          for ( let i in updatedIDs ) {
            sensorLst.push({"sensorID": updatedIDs[i]});
          }

          deleteResponse.sensors = sensorLst;
        } 

        if (parsedMessage.complex != null) {
          let response = await complex.deleteComplex(parsedMessage.complex);
          
          sendAll(SUEClients, response);

          let complexLst = [];
          let updatedIDs = getUpdatedID(response);

          for ( let i in updatedIDs ) {
            complexLst.push({"complexID": updatedIDs[i]});
          }

          deleteResponse.complex = complexLst;
        }

        if ( Object.keys(deleteResponse).length > 0 ) {
          wsClient.send(JSON.stringify({"DELETE - success": deleteResponse}));
        } else {
          wsClient.send(JSON.stringify({"DELETE - fail": "No Items Deleted"}));
        }
      } else if (parsedMessage.type.toLowerCase() == "file-upload") {

        if (parsedMessage.files != null) {

          for ( let i in parsedMessage.files) {

            let file = parsedMessage.files[i];

            base64ToFile(file.name, file.data);

            wsClient.send(JSON.stringify({"file-upload": "Successful"}));

          }  
        } 
      }  else if (parsedMessage.type.toLowerCase() == "file-download") {

        if (parsedMessage.files != null) {

          for ( let i in parsedMessage.files) {

            let file = parsedMessage.files[i];
            let base64File = await fileToBase64(file.name);
            let type = mime.lookup('./media/' + file.name);

            let response = {
              "type":"file-download",
              "files": [
                { 
                  "name": file.name,
                  "type": type,
                  "data": base64File
                }
              ]
            }

            wsClient.send(JSON.stringify(response));

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

async function fileToBase64(filename) {
  let data = await fsp.readFile('./media/' + filename, {encoding: 'base64'});
  return data;
};

function base64ToFile(name, b64) {
  fsp.writeFile("./media/" + name, b64, 'base64', function(err) {
    console.log(err);
  });
};

function getUpdatedID(response) {
  let ids = [];

  for ( let i in response.sensorUK ) {
    ids.push(response.sensorUK[i].sensorID);
  }
  for ( let i in response.sensorUS ) {
    ids.push(response.sensorUS[i].sensorID);
  }
  for ( let i in response.critPriorityEvent ) {
    ids.push(response.critPriorityEvent[i].eventID);
  }
  for ( let i in response.highPriorityEvent ) {
    ids.push(response.highPriorityEvent[i].eventID);
  }
  for ( let i in response.medPriorityEvent ) {
    ids.push(response.medPriorityEvent[i].eventID);
  }
  for ( let i in response.lowPriorityEvent ) {
    ids.push(response.lowPriorityEvent[i].eventID);
  }
  for ( let i in response.complexEvent ) {
    ids.push(response.complexEvent[i].complexID);
  }

  return ids;
};

function getUpdatedObjects(response) {
  let objects = [];

  for ( let i in response.sensorUK ) {
    objects.push(response.sensorUK[i]);
  }
  for ( let i in response.sensorUS ) {
    objects.push(response.sensorUS[i]);
  }
  for ( let i in response.critPriorityEvent ) {
    objects.push(response.critPriorityEvent[i]);
  }
  for ( let i in response.highPriorityEvent ) {
    objects.push(response.highPriorityEvent[i]);
  }
  for ( let i in response.medPriorityEvent ) {
    objects.push(response.medPriorityEvent[i]);
  }
  for ( let i in response.lowPriorityEvent ) {
    objects.push(response.lowPriorityEvent[i]);
  }
  for ( let i in response.complexEvent ) {
    objects.push(response.complexEvent[i]);
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
