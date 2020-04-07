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
    let layerdict = JSON.parse(dict);
    removeAllLayers();

    for (let i in layerdict) {
        if (layerdict[i] === true) {
            window[i].addTo(window.leafletmap);
        }
    } 
}

function removeAllLayers() {
    window.leafletmap.removeLayer(window.sensorCamera);
    window.leafletmap.removeLayer(window.sensorPerson);
    window.leafletmap.removeLayer(window.sensorCameraRange);
    window.leafletmap.removeLayer(window.sensorPersonRange);

    window.leafletmap.removeLayer(window.eventPerson);
    window.leafletmap.removeLayer(window.eventVehicle);
    window.leafletmap.removeLayer(window.eventPlanned);

    window.leafletmap.removeLayer(window.personEventRange);
    window.leafletmap.removeLayer(window.vehicleEventRange);
    window.leafletmap.removeLayer(window.plannedEventRange);

    window.leafletmap.removeLayer(window.complexEvent);
}

function clearMap() {

    const details = document.getElementById("detailspanel");
    const id = document.getElementById("detailsID");
    const name = document.getElementById("detailsName");
    const block = document.getElementById("detailsText");

    const videodesc = document.getElementById("videoDesc");
    const video = document.getElementById("videoPlayer");
    const vsource = document.getElementById("videoSource");

    if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        id.innerHTML = "";
        name.innerHTML = "";
        block.innerHTML = "";
        videodesc.innerHTML = "";
        vsource.setAttribute('src', '');
        video.load();
    }

    window.sensorCamera.clearLayers();
    window.sensorPerson.clearLayers();
    window.sensorCameraRange.clearLayers();
    window.sensorPersonRange.clearLayers();

    window.eventPerson.clearLayers();
    window.eventVehicle.clearLayers();
    window.eventPlanned.clearLayers();

    window.personEventRange.clearLayers();
    window.vehicleEventRange.clearLayers();
    window.plannedEventRange.clearLayers();

    window.complexEvent.clearLayers();

    slstbadge.innerHTML = "0";
    salstbadge.innerHTML = "0";
    sclstbadge.innerHTML = "0";
    splstbadge.innerHTML = "0";

    elstbadge.innerHTML = "0";
    ealstbadge.innerHTML = "0";
    eplstbadge.innerHTML = "0";
    evlstbadge.innerHTML = "0";
    ellstbadge.innerHTML = "0";

    clstbadge.innerHTML = "0";
    calstbadge.innerHTML = "0";

    sensoralist.innerHTML = "";
    sensorclist.innerHTML = "";
    sensorplist.innerHTML = "";

    eventalist.innerHTML = "";
    eventplist.innerHTML = "";
    eventvlist.innerHTML = "";
    eventllist.innerHTML = "";

    complexalist.innerHTML = "";
}

function refreshComplex() {
    window.complexEvent.clearLayers();

    clstbadge.innerHTML = "0";
    calstbadge.innerHTML = "0";

    complexalist.innerHTML = "";
}