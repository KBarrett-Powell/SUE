const ws = new WebSocket('ws://localhost:8000');

ws.onopen = function() { 
    ws.send('{ \'type\': \'add-sue-client\' }');
};

ws.onmessage = function(e) {
    console.log("Received: '" + e.data + "'");
};