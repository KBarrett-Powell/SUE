window.accessibility = false; 

function toggleAccessibility(on) {
    if (on) {
        window.accessibility = true; 
        window.critPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbRedIcon);
        });
        window.highPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbOrangeIcon);
        });
        window.medPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbYellowIcon);
        });
        window.lowPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbBlueIcon);
        });

        window.critPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#EC6C71', color: '#EC6C71'});
        });
        window.highPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FE9D85', color: '#FE9D85'});
        });
        window.medPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#70D4E5', color: '#70D4E5'});
        });
        window.lowPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#6CA5D6', color: '#6CA5D6'});
        });

    } else {
        window.accessibility = false; 
        window.critPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(redIcon);
        });
        window.highPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(orangeIcon);
        });
        window.medPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(yellowIcon);
        });
        window.lowPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(blueIcon);
        });

        window.critPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FE7F7F', color: '#FE7F7F'});
        });
        window.highPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FEA080', color: '#FEA080'});
        });
        window.medPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FEDD80', color: '#FEDD80'});
        });
        window.lowPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#76CAEC', color: '#76CAEC'});
        });

    }
};

function toggleOwnerView(on) {
    removeSensorLayers();
    
    if (on) {
        window.sensorUK.addTo(window.leafletmap);
        window.sensorUS.addTo(window.leafletmap);

        window.sensorUKRange.addTo(window.leafletmap);
        window.sensorUSRange.addTo(window.leafletmap);

    } else {
        window.sensorCamera.addTo(window.leafletmap);
        window.sensorMicrophone.addTo(window.leafletmap);
        window.sensorHuman.addTo(window.leafletmap);

        window.sensorCameraRange.addTo(window.leafletmap);
        window.sensorMicrophoneRange.addTo(window.leafletmap);
        window.sensorHumanRange.addTo(window.leafletmap);
    }
}

function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};