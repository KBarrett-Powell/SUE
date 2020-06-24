const sensorsurl = "http://localhost:8000/sensors";
const eventsurl = "http://localhost:8000/events";
const complexurl = "http://localhost:8000/complex";

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
    iconUrl: 'images/camera-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define microphone icon
const microphoneIcon = L.icon({
    iconUrl: 'images/microphone-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define human icon
const humanIcon = L.icon({
    iconUrl: 'images/human-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define blue marker
const blueIcon = L.icon({
    iconUrl: 'images/blue-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define yellow marker
const yellowIcon = L.icon({
    iconUrl: 'images/yellow-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48]  
});

// Define orange marker
const orangeIcon = L.icon({
    iconUrl: 'images/orange-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48]  
});

// Define red marker
const redIcon = L.icon({
    iconUrl: 'images/red-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define complex marker
const complexIcon = L.icon({
    iconUrl: 'images/complex-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48]  
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
        sensormarker.bindPopup(json.properties.sensorName);

        if (json.properties.sensorType === "Camera") {
            sensormarker.addTo(window.sensorCamera);
            L.semiCircle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.6, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.5, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.4, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.3, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90).addTo(window.sensorCameraRange);
            L.semiCircle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90).addTo(window.sensorCameraRange);
        
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
        let mainradius = window.complexDist;
        //let radius = json.properties.uncertainty;

        let iconChoice = null;
        let colourChoice = "";

        if (json.properties.priority == 4) {
            iconChoice = blueIcon;
            colourChoice = "#76caec";

        } else if (json.properties.priority == 3) {
            iconChoice = yellowIcon;
            colourChoice = "#fedd80";
        
        } else if (json.properties.priority == 2) {
            iconChoice = orangeIcon;
            colourChoice = "#fea080";
        
        } else if (json.properties.priority == 1) {
            iconChoice = redIcon;
            colourChoice = "#fe7f7f";
        }

        let eventmarker = L.marker(coordinates, {icon: iconChoice, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        //let range1 = L.circle(coordinates, {radius: mainradius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.3, weight: 0.3, gradient: true});
        // let range1 = L.circle(coordinates, {radius: mainradius/3, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.3, weight: 0.2, gradient: true});
        // let range2 = L.circle(coordinates, {radius: mainradius*2/3, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.2, weight: 0.4, gradient: true});
        // let range3 = L.circle(coordinates, {radius: mainradius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.2, weight: 0.6, gradient: true});
        let range1 = L.circle(coordinates, {radius: mainradius*2/5, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.6, weight: 3, gradient: true});
        let range2 = L.circle(coordinates, {radius: mainradius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.4, weight: 3, gradient: true});

        eventmarker.bindPopup(json.properties.eventName)
        
        if (json.properties.eventType == "Person") {
            eventmarker.addTo(window.eventPerson);
            range1.addTo(window.personEventRange);
            range2.addTo(window.personEventRange);
            //range3.addTo(window.personEventRange);

        } else if (json.properties.eventType == "Vehicle") {
            eventmarker.addTo(window.eventVehicle);
            range1.addTo(window.vehicleEventRange);
            range2.addTo(window.vehicleEventRange);
            //range3.addTo(window.vehicleEventRange);

        } else {
            eventmarker.addTo(window.eventPlanned);
            range1.addTo(window.plannedEventRange);
            range2.addTo(window.plannedEventRange);
            //range3.addTo(window.plannedEventRange);
        }
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

// Get sensors by id
function getSensorMarkersByID(callback) {
    const sensorsurlwithid = sensorsurl + "/" + window.id;
    $.getJSON(sensorsurlwithid, function(data) {
        callback(data);
    });
}

// Get events by id
function getEventMarkersByID(callback) {
    const eventsurlwithid = eventsurl + "/" + window.id;
    $.getJSON(eventsurlwithid, function(data) {
        callback(data);
    });
}
