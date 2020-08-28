const ws = new WebSocket('ws://localhost:8000');

ws.onopen = function() { 
  let obj = {};
  obj.type = "add-sue-client";
  ws.send(JSON.stringify(obj));

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