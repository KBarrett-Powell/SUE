const ws = new WebSocket('ws://localhost:8000');

ws.onopen = function() { 
    var obj = new Object();
    obj.type = "add-sue-client";
    ws.send(JSON.stringify(obj));
};

ws.onmessage = function(e) {
    let error = false;

    try {
      parsedMessage = JSON.parse(e.data);
    } catch {
      console.log("Received: '" + e.data + "'");
      error = true;
    }

    if (!error) {
        if (parsedMessage.type != null && parsedMessage.type == "update") { 
            updateMapMarkers(parsedMessage);
        }
    }
};