const ws = new WebSocket('ws://localhost:8000');

ws.onopen = function() { 
  let obj = {};
  obj.type = "add-sue-client";
  ws.send(JSON.stringify(obj));

  window.currentLayers = {
    "ownerSensors": true,
    "critPriorityEventRange": true,
    "highPriorityEventRange": true,
    "medPriorityEventRange": true,
    "lowPriorityEventRange": true,
    "sensorCameraRange": false,
    "sensorMicrophoneRange": false,
    "sensorHumanRange": false,
    "sensorUKRange": true,
    "sensorUSRange": true,
    "sensorCamera": false,
    "sensorMicrophone": false,
    "sensorHuman": false,
    "sensorUK": true,
    "sensorUS": true,
    "critPriorityEvent": true,
    "highPriorityEvent": true,
    "medPriorityEvent": true,
    "lowPriorityEvent": true,
    "complexEvent": true
  }

  clearMap();
  initializeLayers();
  initiateTimeRefresh();
};

ws.onmessage = function(e) {
  let error = false;

  try {
    parsedMessage = JSON.parse(e.data);
  } catch {
    error = true;
  }

  if (!error) {
    if (parsedMessage.type != null && parsedMessage.type == "update") { 
      updateMapMarkers(parsedMessage);
    } else if (parsedMessage.type != null && parsedMessage.type == "delete") {
      deleteMapMarkers(parsedMessage);
    }
  }
};