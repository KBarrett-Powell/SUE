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

const eventRadius = 90;

const shadowUrl = "images/marker-shadow.png";
const iconSize = [35, 54];
const shadowSize = [54, 54];
const iconAnchor = [17, 53];
const popupAnchor = [0, -48];

// to remove
window.id = "";
window.prvClickedMarker = null;

// Define camera icon
const cameraIcon = L.icon({
    iconUrl: 'images/camera-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define microphone icon
const microphoneIcon = L.icon({
    iconUrl: 'images/microphone-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor  
});

// Define human icon
const humanIcon = L.icon({
    iconUrl: 'images/human-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor  
});

// Define UK icon
const ukMarker = L.icon({
    iconUrl: 'images/uk-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define US icon
const usMarker = L.icon({
    iconUrl: 'images/us-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define blue marker
const blueIcon = L.icon({
    iconUrl: 'images/blue-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define yellow marker
const yellowIcon = L.icon({
    iconUrl: 'images/yellow-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define orange marker
const orangeIcon = L.icon({
    iconUrl: 'images/orange-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define red marker
const redIcon = L.icon({
    iconUrl: 'images/red-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define cb blue marker
const cbBlueIcon = L.icon({
    iconUrl: 'images/cb-drkblue-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define cb yellow marker
const cbYellowIcon = L.icon({
    iconUrl: 'images/cb-lghtblue-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define cb orange marker
const cbOrangeIcon = L.icon({
    iconUrl: 'images/cb-orange-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor  
});

// Define cb red marker
const cbRedIcon = L.icon({
    iconUrl: 'images/cb-red-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor 
});

// Define complex marker
const complexIcon = L.icon({
    iconUrl: 'images/complex-marker.png',
    shadowUrl: shadowUrl,
    iconSize:     iconSize,
    shadowSize:   shadowSize,
    iconAnchor:   iconAnchor,
    popupAnchor:  popupAnchor  
});

// Add marker function
function addMarker(json, sensor) {
    let type = json.geometry.type;
    let coordinates = json.geometry.coordinates;

    if (type === "Point" && sensor) {
        let sensorMarker = null;
        let range1 = null;
        let range2 = null;
        let range3 = null;
        let range4 = null;
        let range5 = null;

        if (json.properties.sensorType === "Camera") {
            range1 = L.semiCircle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)}).setDirection(json.properties.rangeDirection, 90);
            range2 = L.semiCircle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)}).setDirection(json.properties.rangeDirection, 90);
            range3 = L.semiCircle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)}).setDirection(json.properties.rangeDirection, 90);
            range4 = L.semiCircle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)}).setDirection(json.properties.rangeDirection, 90);
            range5 = L.semiCircle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true, properties: JSON.stringify(json.properties)}).setDirection(json.properties.rangeDirection, 90);
        
            sensorMarker = L.marker(coordinates, {icon: cameraIcon, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorCamera);
            range1.addTo(window.sensorCameraRange);
            range2.addTo(window.sensorCameraRange);
            range3.addTo(window.sensorCameraRange);
            range4.addTo(window.sensorCameraRange);
            range5.addTo(window.sensorCameraRange);

            toggleLayer(window.sensorCamera);
            toggleLayer(window.sensorCameraRange)

        } else {
            range1 = L.circle(coordinates, {radius: 10, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)});
            range2 = L.circle(coordinates, {radius: 15, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)});
            range3 = L.circle(coordinates, {radius: 20, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)});
            range4 = L.circle(coordinates, {radius: 25, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)});
            range5 = L.circle(coordinates, {radius: 30, fillColor: '#999', weight: 0, gradient: true, properties: JSON.stringify(json.properties)});

            if (json.properties.sensorType === "Microphone") {

                sensorMarker = L.marker(coordinates, {icon: microphoneIcon, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorMicrophone);
                range1.addTo(window.sensorMicrophoneRange);
                range2.addTo(window.sensorMicrophoneRange);
                range3.addTo(window.sensorMicrophoneRange);
                range4.addTo(window.sensorMicrophoneRange);
                range5.addTo(window.sensorMicrophoneRange);

                toggleLayer(window.sensorMicrophone);
                toggleLayer(window.sensorMicrophoneRange)
        
            } else {

                sensorMarker = L.marker(coordinates, {icon: humanIcon, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorHuman);
                range1.addTo(window.sensorHumanRange);
                range2.addTo(window.sensorHumanRange);
                range3.addTo(window.sensorHumanRange);
                range4.addTo(window.sensorHumanRange);
                range5.addTo(window.sensorHumanRange);

                toggleLayer(window.sensorHuman);
                toggleLayer(window.sensorHumanRange)
            }
        }

        sensorMarker.bindPopup(json.properties.sensorName);

        if (json.properties.owner == "UK") {
            sensorMarker = L.marker(coordinates, {icon: ukMarker, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorUK);
            range1.addTo(window.sensorUKRange);
            range2.addTo(window.sensorUKRange);
            range3.addTo(window.sensorUKRange);
            range4.addTo(window.sensorUKRange);
            range5.addTo(window.sensorUKRange);

            toggleLayer(window.sensorUK);
            toggleLayer(window.sensorUKRange);

        } else {
            sensorMarker = L.marker(coordinates, {icon: usMarker, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorUS);
            range1.addTo(window.sensorUSRange);
            range2.addTo(window.sensorUSRange);
            range3.addTo(window.sensorUSRange);
            range4.addTo(window.sensorUSRange);
            range5.addTo(window.sensorUSRange);
        
            toggleLayer(window.sensorUS);
            toggleLayer(window.sensorUSRange);
        }

        sensorMarker.bindPopup(json.properties.sensorName);
    
    } else {
        let rangeRadius = [90, 80, 70, 60, 50, 40, 30];
        let rad = rangeRadius[Math.floor(Math.random() * rangeRadius.length)];

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
        let range1 = L.circle(coordinates, {radius: eventRadius*1/4, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.6, weight: 3, gradient: true, properties: JSON.stringify(json.properties)});
        let range2 = L.circle(coordinates, {radius: rad, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.4, weight: 3, gradient: true, properties: JSON.stringify(json.properties)});

        eventmarker.bindPopup(json.properties.eventName);
        
        if (json.properties.priority == 4) {
            eventmarker.addTo(window.lowPriorityEvent);
            range1.addTo(window.lowPriorityEventRange);
            range2.addTo(window.lowPriorityEventRange);

            toggleLayer(window.lowPriorityEvent);
            toggleLayer(window.lowPriorityEventRange);

        } else if (json.properties.priority == 3) {
            eventmarker.addTo(window.medPriorityEvent);
            range1.addTo(window.medPriorityEventRange);
            range2.addTo(window.medPriorityEventRange);

            toggleLayer(window.medPriorityEvent);
            toggleLayer(window.medPriorityEventRange);

        } else if (json.properties.priority == 2) {
            eventmarker.addTo(window.highPriorityEvent);
            range1.addTo(window.highPriorityEventRange);
            range2.addTo(window.highPriorityEventRange);

            toggleLayer(window.highPriorityEvent);
            toggleLayer(window.highPriorityEventRange);

        } else {
            eventmarker.addTo(window.critPriorityEvent);
            range1.addTo(window.critPriorityEventRange);
            range2.addTo(window.critPriorityEventRange);

            toggleLayer(window.critPriorityEvent);
            toggleLayer(window.critPriorityEventRange);
        }
    }

    buildAnalysisCharts();
}

async function updateMapMarkers(request) {

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
        await updateByLayer(request.complexEvent[i], "complexEvent", null);
    }
}

async function updateByLayer(req, win, ownerSensor) {
    let updated = false;
    let count = 0;
    let size = window[win].getLayers().length;

    let sensor = (req.properties.sensorType != null ? true : false);

    let icon = getIcon(req.properties, ownerSensor);

    if (window[win].getLayers().length > 0) {

        await window[win].eachLayer( async function (layer) {
            count ++;

            let properties = null;
            try {
                properties = JSON.parse(layer.options.properties);
            } catch {
                console.log("no properties found on layer");
            }
            
            if (properties != null) {
                let type = null;
                let objectID = null;

                if (properties.eventID != null && properties.eventID == req.properties.eventID) {
                    type = "Event";
                    objectID = properties.eventID;
                } else if (req.properties.eventID == null && properties.sensorID != null && properties.sensorID == req.properties.sensorID) {
                    type = "Sensor";
                    objectID = properties.sensorID;
                } else if (properties.complexID != null && properties.complexID == req.properties.complexID) {
                    type = "Complex";
                    objectID = properties.complexID;
                }

                if (properties != null && type != null) { 

                    updated = true;

                    // updating properties
                    layer.setPopupContent((type == "Event" ? req.properties.eventName : type == "Sensor" ? req.properties.sensorName : req.properties.complexName));
                    let output = await updateProperties(properties, req.properties, type, ownerSensor);
                    layer.options.properties = JSON.stringify(output);

                    // updating map marker information
                    if (output.newIcon != null) { layer.setIcon(icon); }

                    let currentLocation = layer.getLatLng();
                    let newLocation = req.geometry.coordinates;

                    let direction = null;
                    if (type == "Sensor" && req.properties.rangeDirection != null) { direction = req.properties.rangeDirection; }

                    if (currentLocation.lat != newLocation[0] || currentLocation.lng != newLocation[1]) { 
                        layer.setLatLng(newLocation); 
                    }

                    if (type != "Complex") { updateRange(win, newLocation, objectID, direction); }
                }

                if (updated == false && count == size) {
                    if (req.properties.complexID != null) {
                        await processComplexEvent(req);
                    } else {
                        addMarker(req, sensor);
                    }
                }
            }
        });
    } else {
        if (req.properties.complexID != null) {
            await processComplexEvent(req);
        } else {
            addMarker(req, sensor);
        }
    }
}

async function updateProperties(marker, update, type) {

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
        if (update.slctRevVideo != null) {
            marker.slctRevVideo = update.slctRevVideo;
        }
        if (update.priority != null) {
            marker.priority = update.priority;
            // add support for this
        }
        if (update.datetime != null) {
            marker.datetime = update.datetime;
        }

        return Promise.resolve(marker);

    } else if (type == "Sensor") {
        if (update.sensorName != null) {
            marker.sensorName = update.sensorName;
        }
        if (update.sensorType != null) {
            marker.sensorType = update.sensorType;
        }
        if (update.video != null) {
            marker.video = update.video;
        }
        if (update.audio != null) {
            marker.audio = update.audio;
        }
        if (update.owner != null) {
            marker.owner = update.owner;
        }

        return Promise.resolve(marker);
    
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

        return Promise.resolve(marker);
    }
}

function getIcon(properties, ownerSensor) {
    if (properties.sensorType != null) {
        if (ownerSensor) { 
            return (properties.owner == "UK" ? ukMarker : usMarker); 
        } else { 
            return (properties.sensorType == "Camera" ? cameraIcon : properties.sensorType == "Microphone" ? microphoneIcon : humanIcon); 
        }
    } else if (properties.priority != null) {
        if (window.accessibility) {
            return (properties.priority == 1 ? cbRedIcon : properties.priority == 2 ? cbOrangeIcon : properties.priority == 3 ? cbYellowIcon : cbBlueIcon);
        } else {
            return (properties.priority == 1 ? redIcon : properties.priority == 2 ? orangeIcon : properties.priority == 3 ? yellowIcon : blueIcon);
        }        
    } else {
        return complexIcon;
    }
};

async function updateRange(layerName, newLocation, objID, direction) {
    let win = layerName + "Range";

    if (window[win].getLayers().length > 0) {

        await window[win].eachLayer( async function (layer) {
            let properties = null;
            try {
                properties = JSON.parse(layer.options.properties);
            } catch {
                console.log("no properties found on layer");
            }

            if (properties != null) {
                let type = null;

                if (properties.eventID != null && properties.eventID == objID) {
                    type = "Event";
                } else if (properties.eventID == null && properties.sensorID != null && properties.sensorID == objID) {
                    type = "Sensor";
                } else if (properties.complexID != null && properties.complexID == objID) {
                    type = "Complex";
                }

                if (properties != null && type != null) { 
                    let prevLocation = layer.getLatLng();
                    if (newLocation != null && (prevLocation.lat != newLocation[0] || prevLocation.lng != newLocation[1])) { layer.setLatLng(newLocation); }
                    if (direction != null && properties.rangeDirection != null && properties.rangeDirection != direction) { 
                        layer.setDirection(direction, 90); 
                        layer.options.properties.rangeDirection = direction;
                    }
                }
            }
        })
    }
}

async function findSensor(id) {
    let found = null;

    found = await isInLayer(id, window.sensorUK);

    if (found != null && !isEmpty(found)) { 
        return found;

    } else {
        found = await isInLayer(id, window.sensorUS);

        if (found != null && !isEmpty(found)) { 
            return found
        }
    };
    return null;
};

async function findEvents(list) {
    let discoveredItems = [];

    for ( let i in list ) {
        let found = null;

        found = await isInLayer(list[i], window.critPriorityEvent);

        if (found != null && !isEmpty(found)) { 
            discoveredItems.push(found);

        } else {
            found = await isInLayer(list[i], window.highPriorityEvent);

            if (found != null && !isEmpty(found)) { 
                discoveredItems.push(found);
             
            } else {
                found = await isInLayer(list[i], window.medPriorityEvent);
    
                if (found != null && !isEmpty(found)) {
                    discoveredItems.push(found);
                 
                } else {
                    found = await isInLayer(list[i], window.lowPriorityEvent);
        
                    if (found != null && !isEmpty(found)) {
                        discoveredItems.push(found); 
                     
                    }
                }
            }
        }
    }

    return discoveredItems;
};

function isEmpty(obj) {
    for ( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            return false;
        }
    }
    return true;
};