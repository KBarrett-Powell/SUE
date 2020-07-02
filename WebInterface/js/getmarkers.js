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
        updateByLayer(request.sensorCamera[i], "sensorCamera", "Sensor");
    }

    for (let i in request.sensorMicrophone) {
        updateByLayer(request.sensorMicrophone[i], "sensorMicrophone", "Sensor");
    }

    for (let i in request.sensorHuman) {
        updateByLayer(request.sensorHuman[i], "sensorHuman", "Sensor");
    }

    for (let i in request.sensorUK) {
        updateByLayer(request.sensorUK[i], "sensorUK", "Sensor");
    }

    for (let i in request.sensorUS) {
        updateByLayer(request.sensorUS[i], "sensorUS", "Sensor");
    }
    
    for (let i in request.critPriorityEvent) {
        updateByLayer(request.critPriorityEvent[i], "critPriorityEvent", "Event");
    }

    for (let i in request.highPriorityEvent) {
        updateByLayer(request.highPriorityEvent[i], "highPriorityEvent", "Event");
    }

    for (let i in request.medPriorityEvent) {
        updateByLayer(request.medPriorityEvent[i], "medPriorityEvent", "Event");
    }

    for (let i in request.lowPriorityEvent) {
        updateByLayer(request.lowPriorityEvent[i], "lowPriorityEvent", "Event");
    }

    for (let i in request.complexEvent) {
        updateByLayer(request.complexEvent[i], "complexEvent", "Complex");
    }
}

async function updateByLayer(req, win, type) {
    let updated = false;

    await window[win].eachLayer( async function (layer) {
        let properties = JSON.parse(layer.options.properties);

        if (properties != null && properties.eventID != null && properties.eventID == req.properties.eventID) {
            layer.setPopupContent(req.properties.eventName);
            layer.options.properties, newIcon = JSON.stringify(await updateProperties(properties, req.properties, type));
            if (newIcon == null) { layer.setIcon(newIcon); }
            updated = true;
        }
    });

    if (!updated) {
        console.log("adding new marker");
        addMarker(req, null);
    }
}

function updateProperties(marker, update, type) {
    newIcon = null;

    if (type == "Event") {
        if (update.geometry.coordinates != null) {
            marker.geometry.coordinates = update.geometry.coordinates;
        }
        if (update.properties.eventName != null) {
            marker.properties.eventName = update.properties.eventName;
        }
        if (update.properties.eventType != null) {
            marker.properties.eventType = update.properties.eventType;
        }
        if (update.properties.description != null) {
            marker.properties.description = update.properties.description;
        }
        if (update.properties.sensorID != null) {
            marker.properties.sensorID = update.properties.sensorID;
        }
        if (update.properties.chartPoints != null) {
            marker.properties.chartPoints = update.properties.chartPoints;
        }
        if (update.properties.objDetVideo != null) {
            marker.properties.objDetVideo = update.properties.objDetVideo;
        }
        if (update.properties.saliencyVideo != null) {
            marker.properties.saliencyVideo = update.properties.saliencyVideo;
        }
        if (update.properties.priority != null) {
            marker.properties.priority = update.properties.priority;
            // add support for this
        }
        if (update.properties.datetime != null) {
            marker.properties.datetime = update.properties.datetime;
        }

        return marker, newIcon;

    } else if (type == "Sensor") {
        if (update.geometry.coordinates != null) {
            marker.geometry.coordinates = update.geometry.coordinates;
        }
        if (update.properties.sensorName != null) {
            marker.properties.sensorName = update.properties.sensorName;
        }
        if (update.properties.sensorType != null) {
            marker.properties.sensorType = update.properties.sensorType;
            newIcon = (marker.properties.sensorType == "Camera" ? cameraIcon : marker.properties.sensorType == "Microphone" ? microphoneIcon : humanIcon);
        }
        if (update.properties.video != null) {
            marker.properties.video = update.properties.video;
        }
        if (update.properties.audio != null) {
            marker.properties.audio = update.properties.audio;
        }
        if (update.properties.rangeDirection != null) {
            marker.properties.rangeDirection = update.properties.rangeDirection;
        }
        if (update.properties.owner != null) {
            marker.properties.owner = update.properties.owner;
            newIcon = (marker.properties.owner == "UK" ? ukMarker : usMarker);
        }

        return marker, newIcon;
    
    } else {
        if (update.properties.complexName != null) {
            marker.properties.complexName = update.properties.complexName;
        }
        if (update.properties.events != null) {
            marker.properties.events = update.properties.events;
        }
        if (update.properties.datetime != null) {
            marker.properties.datetime = update.properties.datetime;
        }

        return marker, newIcon;
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
