function updateLayers() {
    removeAllLayers();

    for (let i = 1; i < 10; i++) {
        let string = "layer" + i;
        if ( document.getElementById(string).checked === true ) {
            let vari = document.getElementById(string).value;
            window[vari].addTo(window.leafletmap);
        }     
    }
}

function alterLayers(dict) {
    removeAllLayers();

    for (let i in dict) {
        if (dict[i] === true) {
            window[i].addTo(window.leafletmap);
        }
    } 
}

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
}

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
}

function clearMap() {

    const details = document.getElementById("detailspanel");

    if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        clearDetailsMedia()
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
}

function refreshComplex() {
    window.complexEvent.clearLayers();
}