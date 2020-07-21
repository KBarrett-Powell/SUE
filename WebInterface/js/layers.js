function initializeLayers() {
    removeAllLayers();
    
    window.critPriorityEventRange.addTo(window.leafletmap);
    window.highPriorityEventRange.addTo(window.leafletmap);
    window.medPriorityEventRange.addTo(window.leafletmap);
    window.lowPriorityEventRange.addTo(window.leafletmap);

    window.sensorCameraRange.addTo(window.leafletmap);
    window.sensorMicrophoneRange.addTo(window.leafletmap);
    window.sensorHumanRange.addTo(window.leafletmap);

    window.sensorCamera.addTo(window.leafletmap);
    window.sensorMicrophone.addTo(window.leafletmap);
    window.sensorHuman.addTo(window.leafletmap);

    window.critPriorityEvent.addTo(window.leafletmap);
    window.highPriorityEvent.addTo(window.leafletmap);
    window.medPriorityEvent.addTo(window.leafletmap);
    window.lowPriorityEvent.addTo(window.leafletmap);

    window.complexEvent.addTo(window.leafletmap);
};

function alterLayers(dict) {
    removeAllLayers();
    
    for (let i in dict) {
        if (i != "ownerSensors" && dict[i] === true) {
            window[i].addTo(window.leafletmap);
        }
    }; 
};

async function isInLayer(id, layer) {
    let data = await layer.getLayers();

    for ( let i in data ) {
        let properties = JSON.parse(data[i].options.properties);
            
        if (properties.eventID != null && properties.eventID == id) {
            return data[i];
        } else if (properties.sensorID != null && properties.sensorType != null && properties.sensorID == id) {
            return data[i];
        } else if (properties.complexID != null && properties.complexID == id) {
            return data[i];
        }
    };
};

function removeAllLayers() {
    window.leafletmap.removeLayer(window.sensorCamera);
    window.leafletmap.removeLayer(window.sensorMicrophone);
    window.leafletmap.removeLayer(window.sensorHuman);

    window.leafletmap.removeLayer(window.sensorCameraRange);
    window.leafletmap.removeLayer(window.sensorMicrophoneRange);
    window.leafletmap.removeLayer(window.sensorHumanRange);

    window.leafletmap.removeLayer(window.sensorUK);
    window.leafletmap.removeLayer(window.sensorUS);

    window.leafletmap.removeLayer(window.sensorUKRange);
    window.leafletmap.removeLayer(window.sensorUSRange);

    window.leafletmap.removeLayer(window.critPriorityEvent);
    window.leafletmap.removeLayer(window.highPriorityEvent);
    window.leafletmap.removeLayer(window.medPriorityEvent);
    window.leafletmap.removeLayer(window.lowPriorityEvent);

    window.leafletmap.removeLayer(window.critPriorityEventRange);
    window.leafletmap.removeLayer(window.highPriorityEventRange);
    window.leafletmap.removeLayer(window.medPriorityEventRange);
    window.leafletmap.removeLayer(window.lowPriorityEventRange);

    window.leafletmap.removeLayer(window.complexEvent);
};

function removeSensorLayers() {
    window.leafletmap.removeLayer(window.sensorCamera);
    window.leafletmap.removeLayer(window.sensorMicrophone);
    window.leafletmap.removeLayer(window.sensorHuman);

    window.leafletmap.removeLayer(window.sensorCameraRange);
    window.leafletmap.removeLayer(window.sensorMicrophoneRange);
    window.leafletmap.removeLayer(window.sensorHumanRange);

    window.leafletmap.removeLayer(window.sensorUK);
    window.leafletmap.removeLayer(window.sensorUS);

    window.leafletmap.removeLayer(window.sensorUKRange);
    window.leafletmap.removeLayer(window.sensorUSRange);
};

function toggleLayer(layer) {
    if (window.leafletmap.hasLayer(layer)) {
        layer.removeFrom(window.leafletmap);
        layer.addTo(window.leafletmap);
    }
};

function clearMap() {

    const details = document.getElementById("detailspanel");

    if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        clearDetailsMedia();
    }

    window.sensorCamera.clearLayers();
    window.sensorMicrophone.clearLayers();
    window.sensorHuman.clearLayers();

    window.sensorCameraRange.clearLayers();
    window.sensorMicrophoneRange.clearLayers();
    window.sensorHumanRange.clearLayers();

    window.sensorUK.clearLayers();
    window.sensorUS.clearLayers();

    window.sensorUKRange.clearLayers();
    window.sensorUSRange.clearLayers();

    window.critPriorityEvent.clearLayers();
    window.highPriorityEvent.clearLayers();
    window.medPriorityEvent.clearLayers();
    window.lowPriorityEvent.clearLayers();

    window.critPriorityEventRange.clearLayers();
    window.highPriorityEventRange.clearLayers();
    window.medPriorityEventRange.clearLayers();
    window.lowPriorityEventRange.clearLayers();

    window.complexEvent.clearLayers();
};

function showOnlyEvents(lowPri, medPri, highPri, critPri) {
    removeAllLayers();

    if (lowPri) { 
        window.lowPriorityEvent.addTo(window.leafletmap);
        window.lowPriorityEventRange.addTo(window.leafletmap);
    }
    if (medPri) { 
        window.medPriorityEvent.addTo(window.leafletmap);
        window.medPriorityEventRange.addTo(window.leafletmap);
    }
    if (highPri) { 
        window.highPriorityEvent.addTo(window.leafletmap);
        window.highPriorityEventRange.addTo(window.leafletmap);
    }
    if (critPri) { 
        window.critPriorityEvent.addTo(window.leafletmap);
        window.critPriorityEventRange.addTo(window.leafletmap);
    }
};

function refreshComplex() {
    window.complexEvent.clearLayers();
};