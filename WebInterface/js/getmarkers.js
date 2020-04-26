const sensorsurl = "http://localhost:8000/sensors";
const eventsurl = "http://localhost:8000/events";
const complexurl = "http://localhost:8000/complex";

const sensoralist = document.getElementById("sensoralist");
const sensorclist = document.getElementById("sensorclist");
const sensormlist = document.getElementById("sensormlist");
const sensorplist = document.getElementById("sensorplist");
const eventalist = document.getElementById("eventalist");
const eventplist = document.getElementById("eventplist");
const eventvlist = document.getElementById("eventvlist");
const eventllist = document.getElementById("eventllist");
const complexalist = document.getElementById("complexalist");

const slstbadge = document.getElementById("slst-badge");
const salstbadge = document.getElementById("salst-badge");
const sclstbadge = document.getElementById("sclst-badge");
const smlstbadge = document.getElementById("smlst-badge");
const splstbadge = document.getElementById("splst-badge");

const elstbadge = document.getElementById("elst-badge");
const ealstbadge = document.getElementById("ealst-badge");
const eplstbadge = document.getElementById("eplst-badge");
const evlstbadge = document.getElementById("evlst-badge");
const ellstbadge = document.getElementById("ellst-badge");

const clstbadge = document.getElementById("clst-badge");
const calstbadge = document.getElementById("calst-badge");

window.sensorCamera = L.layerGroup();
window.sensorMicrophone = L.layerGroup();
window.sensorPerson = L.layerGroup();
window.sensorCameraRange = L.layerGroup();
window.sensorMicrophoneRange = L.layerGroup();
window.sensorPersonRange = L.layerGroup();

window.eventPerson = L.layerGroup();
window.eventVehicle = L.layerGroup();
window.eventPlanned = L.layerGroup();

window.personEventRange = L.layerGroup();
window.vehicleEventRange = L.layerGroup();
window.plannedEventRange = L.layerGroup();

window.complexEvent = L.layerGroup();

window.id = "";

window.prvClickedMarker = null;

// Define blue marker
const markerNormal = L.icon({
    iconUrl: 'images/marker-icon.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define camera icon
const cameraIcon = L.icon({
    iconUrl: 'images/grey_camera_marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 40],
    popupAnchor:  [1, -34] 
});

// Define microphone icon
const microphoneIcon = L.icon({
    iconUrl: 'images/grey_microphone_marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 40],
    popupAnchor:  [1, -34] 
});

// Define person icon
const personIcon = L.icon({
    iconUrl: 'images/grey_person_marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 40],
    popupAnchor:  [1, -34] 
});

// Define green marker
const markerGreen = L.icon({
    iconUrl: 'images/marker-green.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define yellow marker
const markerYellow = L.icon({
    iconUrl: 'images/marker-yellow.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define yellow marker
const markerOrange = L.icon({
    iconUrl: 'images/marker-orange.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define red marker
const markerRed = L.icon({
    iconUrl: 'images/marker-red.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define red marker
const markerComplex = L.icon({
    iconUrl: 'images/marker-complex.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define selected marker
const selectedMarker = L.icon({
    iconUrl: 'images/marker-green.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [32, 53],
    shadowSize:   [53, 53],
    iconAnchor:   [15, 53],
    shadowAnchor: [17, 53],
    popupAnchor:  [1, -34] 
});

// Define blue marker large
const markerLarge = selectedMarker;

// Define camera icon large
const cameraIconLarge = selectedMarker;

// Define microphone icon large
const microphoneIconLarge = selectedMarker;

// Define person icon large
const personIconLarge = selectedMarker;

// Define green marker large
const markerGreenLarge = selectedMarker;

// Define yellow marker large
const markerYellowLarge = selectedMarker;

// Define orange marker large
const markerOrangeLarge = selectedMarker;

// Define red marker large
const markerRedLarge = selectedMarker;

// Define complex marker large
const markerComplexLarge = selectedMarker;

// Add marker function
function addMarker(json, iconimg) {
    let type = json.geometry.type;
    let coordinates = json.geometry.coordinates;

    if (type === "Point" && iconimg != null) {
        let sensormarker = L.marker(coordinates, {icon: iconimg, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        
        if (json.properties.sensorType === "Camera") {
            sensormarker.addTo(window.sensorCamera);
            L.semiCircle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.6, weight: 0, gradient: true}).setDirection(json.properties.direction, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.5, weight: 0, gradient: true}).setDirection(json.properties.direction, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.4, weight: 0, gradient: true}).setDirection(json.properties.direction, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.3, weight: 0, gradient: true}).setDirection(json.properties.direction, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true}).setDirection(json.properties.direction, 90).addTo(window.sensorCameraRange);
        
        } else {
            let fullrange1 = L.circle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.6, weight: 0, gradient: true});
            let fullrange2 = L.circle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.5, weight: 0, gradient: true});
            let fullrange3 = L.circle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.4, weight: 0, gradient: true});
            let fullrange4 = L.circle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.3, weight: 0, gradient: true});
            let fullrange5 = L.circle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true});

            if (json.properties.sensorType === "Microphone") {
                sensormarker.addTo(window.sensorMicrophone);
                fullrange1.addTo(window.sensorMicrophoneRange);
                fullrange2.addTo(window.sensorMicrophoneRange);
                fullrange3.addTo(window.sensorMicrophoneRange);
                fullrange4.addTo(window.sensorMicrophoneRange);
                fullrange5.addTo(window.sensorMicrophoneRange);
        
            } else {
                sensormarker.addTo(window.sensorPerson);
                fullrange1.addTo(window.sensorPersonRange);
                fullrange2.addTo(window.sensorPersonRange);
                fullrange3.addTo(window.sensorPersonRange);
                fullrange4.addTo(window.sensorPersonRange);
                fullrange5.addTo(window.sensorPersonRange);
            }
        }
    
    } else {
        let radius = window.complexDist;

        let eventmarker = "";
        let rangemarker = "";

        if (json.properties.color === null) {

            eventmarker = L.marker(coordinates, {icon: markerNormal, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
            rangemarker = L.circle(coordinates, {radius: radius, fillOpacity: 0.4, weight: 1, gradient: true});

        } else if (json.properties.color === "yellow") {
            eventmarker = L.marker(coordinates, {icon: markerYellow, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
            rangemarker = L.circle(coordinates, {radius: radius, fillColor: "#ffff4d", color: "#ffff4d", fillOpacity: 0.4, weight: 1, gradient: true});
        
        } else if (json.properties.color === "orange") {
            eventmarker = L.marker(coordinates, {icon: markerOrange, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
            rangemarker = L.circle(coordinates, {radius: radius, fillColor: "#ff6600", color: "#ff6600", fillOpacity: 0.4, weight: 1, gradient: true});
        
        } else if (json.properties.color === "red") {
            eventmarker = L.marker(coordinates, {icon: markerRed, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
            rangemarker = L.circle(coordinates, {radius: radius, fillColor: "#ff0000", color: "#ff0000", fillOpacity: 0.4, weight: 1, gradient: true});

        }
        
        if (json.properties.eventType === "Person") {
            eventmarker.addTo(window.eventPerson);
            rangemarker.addTo(window.personEventRange);
        } else if (json.properties.eventType === "Vehicle") {
            eventmarker.addTo(window.eventVehicle);
            rangemarker.addTo(window.vehicleEventRange);
        } else {
            eventmarker.addTo(window.eventPlanned);
            rangemarker.addTo(window.plannedEventRange);
        }
    }
}

// Add marker function
function addListItem(json, type, specificType) {

    let name = json.properties.name;
    let span = document.createElement('span');
    let button = document.createElement('button');
    button.onclick = function(){toggleDetailsFromPage(this)};
    button.id = JSON.stringify(json);
    let listitem = document.createElement('div');
    listitem.classList = "list-group-item listitem";
    span.appendChild(document.createTextNode(name));
    button.appendChild(span);
    listitem.appendChild(button);

    let span2 = document.createElement('span');
    let button2 = document.createElement('button');
    button2.onclick = function(){toggleDetailsFromPage(this)};
    button2.id = JSON.stringify(json);
    let listitem2 = document.createElement('div');
    listitem2.classList = "list-group-item listitem";
    span2.appendChild(document.createTextNode(name));
    button2.appendChild(span2);
    listitem2.appendChild(button2);

    if (type === "sensor") {
        if (specificType === "Camera") {
            sensorclist.appendChild(listitem);
            sclstbadge.innerHTML = (parseInt(sclstbadge.innerHTML) + 1).toString();
        } else if (specificType === "Microphone") {
            sensormlist.appendChild(listitem);
            smlstbadge.innerHTML = (parseInt(smlstbadge.innerHTML) + 1).toString();
        } else {
            sensorplist.appendChild(listitem);
            splstbadge.innerHTML = (parseInt(splstbadge.innerHTML) + 1).toString();
        }

        sensoralist.appendChild(listitem2);
        salstbadge.innerHTML = (parseInt(salstbadge.innerHTML) + 1).toString();
        slstbadge.innerHTML = (parseInt(slstbadge.innerHTML) + 1).toString();

    } else if (type === "event") {
        if (specificType === "Person") {
            eventplist.appendChild(listitem);
            eplstbadge.innerHTML = (parseInt(eplstbadge.innerHTML) + 1).toString();
        } else if (specificType === "Vehicle") {
            eventvlist.appendChild(listitem);
            evlstbadge.innerHTML = (parseInt(evlstbadge.innerHTML) + 1).toString();
        } else {
            eventllist.appendChild(listitem);
            ellstbadge.innerHTML = (parseInt(ellstbadge.innerHTML) + 1).toString();
        }

        eventalist.appendChild(listitem2);
        ealstbadge.innerHTML = (parseInt(ealstbadge.innerHTML) + 1).toString();
        elstbadge.innerHTML = (parseInt(elstbadge.innerHTML) + 1).toString();

    } else {
        complexalist.appendChild(listitem);
        calstbadge.innerHTML = (parseInt(calstbadge.innerHTML) + 1).toString();
        clstbadge.innerHTML = (parseInt(clstbadge.innerHTML) + 1).toString();
    }
}

// Get sensor markers
function getSensorMarkers(callback) {
    const sensorurlwithtime = sensorsurl + "?iso=" + window.datetime.toISOString();
    $.getJSON(sensorurlwithtime, function(data) {
        callback(data.sensors);
    });
}

// Get event markers
function getEventMarkers(callback) {
    const eventurlwithtime = eventsurl + "?iso=" + window.datetime.toISOString();
    $.getJSON(eventurlwithtime, function(data) {
        callback(data.events);
    });
}

// Get complex event polygons
function getComplexEvents(callback) {
    const complexurlwithtime = complexurl + "?iso=" + window.datetime.toISOString();
    $.getJSON(complexurlwithtime, function(data) {
        callback(data.connections);
    });
}

// Get sensor markers
function getAllSensorMarkers(callback) {
    $.getJSON(sensorsurl, function(data) {
        callback(data.sensors);
    });
}

// Get event markers
function getAllEventMarkers(callback) {
    $.getJSON(eventsurl, function(data) {
        callback(data.events);
    });
}

// Get complex event polygons
function getAllComplexEvents(callback) {
    $.getJSON(complexurl, function(data) {
        callback(data.connections);
    });
}

// Get events by id
function getEventMarkersByID(callback) {
    const eventsurlwithid = eventsurl + "/" + window.id;
    $.getJSON(eventsurlwithid, function(data) {
        callback(data);
    });
}