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
window.sensorHuman = L.layerGroup();
window.sensorCameraRange = L.layerGroup();
window.sensorMicrophoneRange = L.layerGroup();
window.sensorHumanRange = L.layerGroup();

window.eventPerson = L.layerGroup();
window.eventVehicle = L.layerGroup();
window.eventPlanned = L.layerGroup();

window.personEventRange = L.layerGroup();
window.vehicleEventRange = L.layerGroup();
window.plannedEventRange = L.layerGroup();

window.complexEvent = L.layerGroup();

window.id = "";

window.prvClickedMarker = null;

// Define camera icon
const cameraIcon = L.icon({
    iconUrl: 'images/camera pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define microphone icon
const microphoneIcon = L.icon({
    iconUrl: 'images/microphone pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define human icon
const humanIcon = L.icon({
    iconUrl: 'images/human pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define blue marker
const blueIcon = L.icon({
    iconUrl: 'images/blue pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define green marker
const greenIcon = L.icon({
    iconUrl: 'images/marker-green.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define yellow marker
const yellowIcon = L.icon({
    iconUrl: 'images/yellow pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define orange marker
const orangeIcon = L.icon({
    iconUrl: 'images/orange pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define red marker
const redIcon = L.icon({
    iconUrl: 'images/red pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define complex marker
const complexIcon = L.icon({
    iconUrl: 'images/complex pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [28, 49],
    shadowSize:   [49, 49],
    iconAnchor:   [14, 48],
    popupAnchor:  [0, -42] 
});

// Define selected camera icon
const cameraSelectIcon = L.icon({
    iconUrl: 'images/camera select pin.svg',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [31, 52],
    shadowSize:   [52, 52],
    iconAnchor:   [15, 50],
    popupAnchor:  [0, -45] 
});

// Add marker function
function addMarker(json, iconimg) {
    let type = json.geometry.type;
    let coordinates = json.geometry.coordinates;

    if (type === "Point" && iconimg != null) {
        let sensormarker = L.marker(coordinates, {icon: iconimg, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        sensormarker.bindPopup(json.properties.name);

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
                sensormarker.addTo(window.sensorHuman);
                fullrange1.addTo(window.sensorHumanRange);
                fullrange2.addTo(window.sensorHumanRange);
                fullrange3.addTo(window.sensorHumanRange);
                fullrange4.addTo(window.sensorHumanRange);
                fullrange5.addTo(window.sensorHumanRange);
            }
        }
    
    } else {
        let radius = window.complexDist;

        let iconChoice = null;
        let colourChoice = "";

        if (json.properties.color === null) {
            iconChoice = blueIcon;
            colourChoice = "#3388ff";

        } else if (json.properties.color === "yellow") {
            iconChoice = yellowIcon;
            colourChoice = "#ffff4d";
        
        } else if (json.properties.color === "orange") {
            iconChoice = orangeIcon;
            colourChoice = "#ff6600";
        
        } else if (json.properties.color === "red") {
            iconChoice = redIcon;
            colourChoice = "#ff0000";
        }

        let eventmarker = L.marker(coordinates, {icon: iconChoice, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        let range1 = L.circle(coordinates, {radius: radius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.3, weight: 0.3, gradient: true});
        // let range1 = L.circle(coordinates, {radius: radius/3, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.1, weight: 0.3, gradient: true});
        // let range2 = L.circle(coordinates, {radius: (radius*2)/3, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.1, weight: 0.5, gradient: true});
        // let range3 = L.circle(coordinates, {radius: radius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.1, weight: 0.7, gradient: true});

        eventmarker.bindPopup(json.properties.name)
        
        if (json.properties.eventType === "Person") {
            eventmarker.addTo(window.eventPerson);
            range1.addTo(window.personEventRange);
            //range2.addTo(window.personEventRange);
            //range3.addTo(window.personEventRange);

        } else if (json.properties.eventType === "Vehicle") {
            eventmarker.addTo(window.eventVehicle);
            range1.addTo(window.vehicleEventRange);
            //range2.addTo(window.vehicleEventRange);
            //range3.addTo(window.vehicleEventRange);

        } else {
            eventmarker.addTo(window.eventPlanned);
            range1.addTo(window.plannedEventRange);
            //range2.addTo(window.plannedEventRange);
            //range3.addTo(window.plannedEventRange);
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
