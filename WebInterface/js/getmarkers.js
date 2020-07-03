const sensorsurl = "http://localhost:8000/sensors";
const eventsurl = "http://localhost:8000/events";
const complexurl = "http://localhost:8000/complex";

window.sensorCamera = L.layerGroup();
window.sensorMicrophone = L.layerGroup();
window.sensorHuman = L.layerGroup();

window.sensorCameraRange = L.layerGroup();
window.sensorMicrophoneRange = L.layerGroup();
window.sensorHumanRange = L.layerGroup();

window.sensorUK = L.layerGroup();
window.sensorUS = L.layerGroup();

window.sensorUKRange = L.layerGroup();
window.sensorUSRange = L.layerGroup();

window.critPriorityEvent = L.layerGroup();
window.highPriorityEvent = L.layerGroup();
window.medPriorityEvent = L.layerGroup();
window.lowPriorityEvent = L.layerGroup();

window.critPriorityEventRange = L.layerGroup();
window.highPriorityEventRange = L.layerGroup();
window.medPriorityEventRange = L.layerGroup();
window.lowPriorityEventRange = L.layerGroup();

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

// Define UK icon
const ukMarker = L.icon({
    iconUrl: 'images/uk-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define US icon
const usMarker = L.icon({
    iconUrl: 'images/us-marker.png',
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

// Define cb blue marker
const cbBlueIcon = L.icon({
    iconUrl: 'images/cb-drkblue-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48] 
});

// Define cb yellow marker
const cbYellowIcon = L.icon({
    iconUrl: 'images/cb-lghtblue-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48]  
});

// Define cb orange marker
const cbOrangeIcon = L.icon({
    iconUrl: 'images/cb-orange-marker.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [35, 54],
    shadowSize:   [54, 54],
    iconAnchor:   [17, 53],
    popupAnchor:  [0, -48]  
});

// Define cb red marker
const cbRedIcon = L.icon({
    iconUrl: 'images/cb-red-marker.png',
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
        let range1 = null;
        let range2 = null;
        let range3 = null;
        let range4 = null;
        let range5 = null;

        sensormarker.bindPopup(json.properties.sensorName);

        if (json.properties.sensorType === "Camera") {
            range1 = L.semiCircle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.6, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90);
            range2 = L.semiCircle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.5, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90);
            range3 = L.semiCircle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.4, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90);
            range4 = L.semiCircle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.3, weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90);
            range5 = L.semiCircle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true}).setDirection(json.properties.rangeDirection, 90);
        
            sensormarker.addTo(window.sensorCamera);
            range1.addTo(window.sensorCameraRange);
            range2.addTo(window.sensorCameraRange);
            range3.addTo(window.sensorCameraRange);
            range4.addTo(window.sensorCameraRange);
            range5.addTo(window.sensorCameraRange);

        } else {
            range1 = L.circle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.6, weight: 0, gradient: true});
            range2 = L.circle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.5, weight: 0, gradient: true});
            range3 = L.circle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.4, weight: 0, gradient: true});
            range4 = L.circle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.3, weight: 0, gradient: true});
            range5 = L.circle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true});

            if (json.properties.sensorType === "Microphone") {
                sensormarker.addTo(window.sensorMicrophone);
                range1.addTo(window.sensorMicrophoneRange);
                range2.addTo(window.sensorMicrophoneRange);
                range3.addTo(window.sensorMicrophoneRange);
                range4.addTo(window.sensorMicrophoneRange);
                range5.addTo(window.sensorMicrophoneRange);
        
            } else {
                sensormarker.addTo(window.sensorHuman);
                range1.addTo(window.sensorHumanRange);
                range2.addTo(window.sensorHumanRange);
                range3.addTo(window.sensorHumanRange);
                range4.addTo(window.sensorHumanRange);
                range5.addTo(window.sensorHumanRange);
            }
        }

        if (json.properties.owner == "UK") {
            L.marker(coordinates, {icon: ukMarker, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorUK);
            range1.addTo(window.sensorUKRange);
            range2.addTo(window.sensorUKRange);
            range3.addTo(window.sensorUKRange);
            range4.addTo(window.sensorUKRange);
            range5.addTo(window.sensorUKRange);

        } else {
            L.marker(coordinates, {icon: usMarker, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorUS);
            range1.addTo(window.sensorUSRange);
            range2.addTo(window.sensorUSRange);
            range3.addTo(window.sensorUSRange);
            range4.addTo(window.sensorUSRange);
            range5.addTo(window.sensorUSRange);
        }
    
    } else {
        let mainradius = window.complexDist;
        //let radius = json.properties.uncertainty;

        let iconChoice = null;
        let colourChoice = "";

        if (json.properties.priority == 4) {
            iconChoice = (window.accessibility == false ? blueIcon : cbBlueIcon);
            colourChoice = (window.accessibility == false ? '#76CAEC' : '#6CA5D6');

        } else if (json.properties.priority == 3) {
            iconChoice = (window.accessibility == false ? yellowIcon : cbYellowIcon);
            colourChoice = (window.accessibility == false ? '#FEDD80' : '#70D4E5');
        
        } else if (json.properties.priority == 2) {
            iconChoice = (window.accessibility == false ? orangeIcon : cbOrangeIcon);
            colourChoice = (window.accessibility == false ? '#FEA080' : '#FE9D85');
        
        } else if (json.properties.priority == 1) {
            iconChoice = (window.accessibility == false ? redIcon : cbRedIcon);
            colourChoice = (window.accessibility == false ? '#FE7F7F' : '#EC6C71');
        }

        let eventmarker = L.marker(coordinates, {icon: iconChoice, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        //let range1 = L.circle(coordinates, {radius: mainradius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.3, weight: 0.3, gradient: true});
        // let range1 = L.circle(coordinates, {radius: mainradius/3, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.3, weight: 0.2, gradient: true});
        // let range2 = L.circle(coordinates, {radius: mainradius*2/3, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.2, weight: 0.4, gradient: true});
        // let range3 = L.circle(coordinates, {radius: mainradius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.2, weight: 0.6, gradient: true});
        let range1 = L.circle(coordinates, {radius: mainradius*2/5, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.6, weight: 3, gradient: true});
        let range2 = L.circle(coordinates, {radius: mainradius, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.4, weight: 3, gradient: true});

        eventmarker.bindPopup(json.properties.eventName)
        
        if (json.properties.priority == 4) {
            eventmarker.addTo(window.lowPriorityEvent);
            range1.addTo(window.lowPriorityEventRange);
            range2.addTo(window.lowPriorityEventRange);
            //range3.addTo(window.lowPriorityEventRange);

        } else if (json.properties.priority == 3) {
            eventmarker.addTo(window.medPriorityEvent);
            range1.addTo(window.medPriorityEventRange);
            range2.addTo(window.medPriorityEventRange);
            //range3.addTo(window.medPriorityEventRange);

        } else if (json.properties.priority == 2) {
            eventmarker.addTo(window.highPriorityEvent);
            range1.addTo(window.highPriorityEventRange);
            range2.addTo(window.highPriorityEventRange);
            //range3.addTo(window.highPriorityEventRange);

        } else {
            eventmarker.addTo(window.critPriorityEvent);
            range1.addTo(window.critPriorityEventRange);
            range2.addTo(window.critPriorityEventRange);
            //range3.addTo(window.critPriorityEventRange);
        }
    }
}

function updateMapMarkers(request) {

    for (let i in request.sensorCamera) {
        updateByLayer(request.sensorCamera[i], "sensorCamera", false);
    }

    for (let i in request.sensorMicrophone) {
        updateByLayer(request.sensorMicrophone[i], "sensorMicrophone", false);
    }

    for (let i in request.sensorHuman) {
        updateByLayer(request.sensorHuman[i], "sensorHuman", false);
    }

    for (let i in request.sensorUK) {
        updateByLayer(request.sensorUK[i], "sensorUK", true);
    }

    for (let i in request.sensorUS) {
        updateByLayer(request.sensorUS[i], "sensorUS", true);
    }
    
    for (let i in request.critPriorityEvent) {
        updateByLayer(request.critPriorityEvent[i], "critPriorityEvent", null);
    }

    for (let i in request.highPriorityEvent) {
        updateByLayer(request.highPriorityEvent[i], "highPriorityEvent", null);
    }

    for (let i in request.medPriorityEvent) {
        updateByLayer(request.medPriorityEvent[i], "medPriorityEvent", null);
    }

    for (let i in request.lowPriorityEvent) {
        updateByLayer(request.lowPriorityEvent[i], "lowPriorityEvent", null);
    }

    for (let i in request.complexEvent) {
        updateByLayer(request.complexEvent[i], "complexEvent", null);
    }
}

async function updateByLayer(req, win, sensorType) {
    
    let updated = await window[win].eachLayer( async function (layer) {

        let found = false;
        let properties = JSON.parse(layer.options.properties);
        
        let type = null;
        if (properties.eventID != null && properties.eventID == req.properties.eventID) {
            type = "Event";
        } else if (properties.sensorID != null && properties.sensorID == req.properties.sensorID) {
            type = "Sensor";
        } else if (properties.complexID != null && properties.complexID == req.properties.complexID) {
            type = "Complex";
        }

        if (properties != null && type != null) { 

            // updating properties
            layer.setPopupContent((type == "Event" ? req.properties.eventName : type == "Sensor" ? req.properties.sensorName : req.properties.complexName));
            let output = await updateProperties(properties, req.properties, type, sensorType);
            layer.options.properties = JSON.stringify(output.marker);

            // updating map marker information
            if (output.newIcon != null) { layer.setIcon(output.newIcon); }
            //console.log("layer coord: " + layer.getLatLng() + " - new coord: " + req.geometry.coordinates);
            //if (layer.getLatLng() != req.geometry.coordinates) { layer.setLatLng(req.geometry.coordinates); }
            //layer.setLatLng(newMarker.getLatLng());

            found = true;
        }

        return Promise.resolve(found);
    });

    if (!updated) {
        addMarker(req, null);
    }
}

async function updateProperties(marker, update, type, ownerSensor) {
    let newIcon = null;
    let jsonObj = {};

    if (type == "Event") {
        // if (marker.timeline == null || update.geometry.coordinates != marker.timeline[Object.keys(marker.timeline).length - 1]) {
        //     marker.timeline[currentTime] = update.geometry.coordinates;
        // }
        if (update.eventName != null) {
            marker.eventName = update.eventName;
        }
        if (update.eventType != null) {
            marker.eventType = update.eventType;
        }
        if (update.description != null) {
            marker.description = update.description;
        }
        if (update.sensorID != null) {
            marker.sensorID = update.sensorID;
        }
        if (update.chartPoints != null) {
            marker.chartPoints = update.chartPoints;
        }
        if (update.objDetVideo != null) {
            marker.objDetVideo = update.objDetVideo;
        }
        if (update.saliencyVideo != null) {
            marker.saliencyVideo = update.saliencyVideo;
        }
        if (update.priority != null) {
            marker.priority = update.priority;
            // add support for this
        }
        if (update.datetime != null) {
            marker.datetime = update.datetime;
        }

        jsonObj.marker = marker;
        jsonObj.newIcon = newIcon;

        return Promise.resolve(jsonObj);

    } else if (type == "Sensor") {
        // if (update.geometry.coordinates != null) {
        //     marker.geometry.coordinates = update.geometry.coordinates;
        // }
        if (update.sensorName != null) {
            marker.sensorName = update.sensorName;
        }
        if (update.sensorType != null) {
            marker.sensorType = update.sensorType;
            if (!ownerSensor) { newIcon = (marker.sensorType == "Camera" ? cameraIcon : marker.sensorType == "Microphone" ? microphoneIcon : humanIcon); }
        }
        if (update.video != null) {
            marker.video = update.video;
        }
        if (update.audio != null) {
            marker.audio = update.audio;
        }
        if (update.rangeDirection != null) {
            marker.rangeDirection = update.rangeDirection;
        }
        if (update.owner != null) {
            marker.owner = update.owner;
            if (ownerSensor) { newIcon = (marker.owner == "UK" ? ukMarker : usMarker); }
        }

        jsonObj.marker = marker;
        jsonObj.newIcon = newIcon;

        return Promise.resolve(jsonObj);
    
    } else {
        if (update.complexName != null) {
            marker.complexName = update.complexName;
        }
        if (update.events != null) {
            marker.events = update.events;
        }
        if (update.datetime != null) {
            marker.datetime = update.datetime;
        }

        jsonObj.marker = marker;
        jsonObj.newIcon = newIcon;

        return Promise.resolve(jsonObj);
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