// Create all map layer groups
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

// Define base icon
let mapIcon = L.Icon.extend({
    options: {
        shadowUrl: "images/marker-shadow.png",
        iconSize: [35, 54],
        shadowSize: [54, 54],
        iconAnchor: [17, 53],
        popupAnchor: [0, -48]
    }
});

// Define camera icon
const cameraIcon = new mapIcon({
    iconUrl: 'images/camera-marker.png'
});

// Define microphone icon
const microphoneIcon = new mapIcon({
    iconUrl: 'images/microphone-marker.png'
});

// Define human icon
const humanIcon = new mapIcon({
    iconUrl: 'images/human-marker.png'
});

// Define UK icon
const ukIcon = new mapIcon({
    iconUrl: 'images/uk-marker.png'
});

// Define US icon
const usIcon = new mapIcon({
    iconUrl: 'images/us-marker.png'
});

// Define blue icon
const blueIcon = new mapIcon({
    iconUrl: 'images/blue-marker.png'
});

// Define yellow icon
const yellowIcon = new mapIcon({
    iconUrl: 'images/yellow-marker.png'
});

// Define orange icon
const orangeIcon = new mapIcon({
    iconUrl: 'images/orange-marker.png'
});

// Define red icon
const redIcon = new mapIcon({
    iconUrl: 'images/red-marker.png'
});

// Define colour-blind low priority icon
const cbBlueIcon = new mapIcon({
    iconUrl: 'images/cb-drkblue-marker.png'
});

// Define colour-blind medium priority icon
const cbYellowIcon = new mapIcon({
    iconUrl: 'images/cb-lghtblue-marker.png'
});

// Define colour-blind high priority icon
const cbOrangeIcon = new mapIcon({
    iconUrl: 'images/cb-orange-marker.png'
});

// Define colour-blind critical priority icon
const cbRedIcon = new mapIcon({
    iconUrl: 'images/cb-red-marker.png'
});

// Define complex icon
const complexIcon = new mapIcon({
    iconUrl: 'images/complex-marker.png'
});

// Add map marker function
async function addMarker(json, sensor, layer) {
    let coordinates = json.geometry.coordinates;
    let ranges = [];

    if (sensor) {
        // Create default sensor marker with camera icon
        let sensorMarker = L.marker(coordinates, {properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        sensorMarker.bindPopup(json.properties.sensorName);
        let radius = 10;

        let sensorType = json.properties.sensorType;

        // Fill in Sensor Type map layers
        if (sensorType == "Camera"){
            // Create semicircle ranges for camera range, and store in ranges list
            for ( let i = 0; i < 5; i ++ ) {
                let newRange = L.semiCircle(coordinates, {radius: radius, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)}).setDirection(json.properties.rangeDirection, 90);
                ranges.push(newRange);
                radius = radius + 5;
            }

        } else {
            // Create circle ranges for microphone and human range, and store in ranges list
            for ( let i = 0; i < 5; i ++ ) {
                let newRange = L.circle(coordinates, {radius: radius, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, properties: JSON.stringify(json.properties)});
                ranges.push(newRange);
                radius = radius + 5;
            }
        } 

        if (layer == "sensorCamera") {
            // Update map layer with new marker and ranges
            sensorMarker.setIcon(cameraIcon);

        } else if (layer == "sensorMicrophone") {
            // Use default sensor marker with microphone icon
            sensorMarker.setIcon(microphoneIcon);
    
        } else if (layer == "sensorHuman") {
            // Use default sensor marker with human icon
            sensorMarker.setIcon(humanIcon);
        
        } else if (layer == "sensorUK") {
            // Use default sensor marker with uk flag icon
            sensorMarker.setIcon(ukIcon);

        } else {
            // Use default sensor marker with us flag icon
            sensorMarker.setIcon(usIcon);
        }

        // Update map layer with new marker and ranges
        addMarkerToLayer(sensorMarker, ranges, window[layer], window[layer + "Range"]);
    
    } else {
        let iconChoice = null;
        let colourChoice = "";

        // Get colour and icon choice based on event priority and whether accessibility mode is on or not
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

        // Create an event marker with the icon determined above
        let eventmarker = L.marker(coordinates, {icon: iconChoice, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap);
        eventmarker.bindPopup(json.properties.eventName);
        
        // Creating a varying outer range for events determined randomly from list of avaliable ranges
        let rangeRadius = [90, 80, 70, 60, 50, 40, 30];
        let rad = rangeRadius[Math.floor(Math.random() * rangeRadius.length)];

        // Add range circles to list
        ranges.push(L.circle(coordinates, {radius: eventRadius*1/4, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.6, weight: 3, gradient: true, properties: JSON.stringify(json.properties)}));
        ranges.push(L.circle(coordinates, {radius: rad, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.4, weight: 3, gradient: true, properties: JSON.stringify(json.properties)}));
        
        // Add event marker and its ranges to the appropriate layer
        if (json.properties.priority == 4) {
            addMarkerToLayer(eventmarker, ranges, window.lowPriorityEvent, window.lowPriorityEventRange);

        } else if (json.properties.priority == 3) {
            addMarkerToLayer(eventmarker, ranges, window.medPriorityEvent, window.medPriorityEventRange);

        } else if (json.properties.priority == 2) {
            addMarkerToLayer(eventmarker, ranges, window.highPriorityEvent, window.highPriorityEventRange);

        } else {
            addMarkerToLayer(eventmarker, ranges, window.critPriorityEvent, window.critPriorityEventRange);
        }
    }

    // Update the analysis charts
    buildPriorityChart();
    buildTimeChart();
};

function addMarkerToLayer(marker, ranges, layer, rangeLayer) {
    // Add the marker and its range to the appropriate layers
    if (marker != null) {
        marker.addTo(layer);
    }

    for( let i in ranges ) {
        ranges[i].addTo(rangeLayer);
    }

    // Refresh layers on map so updates are displayed in SUE
    toggleLayer(layer);
    toggleLayer(rangeLayer);
};

// Function to go through each object in the request and attempt to find and update it on the appropriate map layer
// If not found, a new marker is added to that layer
async function updateMapMarkers(request) {

    for (let i in request.sensorCamera) {
        updateByLayer(request.sensorCamera[i], "sensorCamera", false, false);
    }

    for (let i in request.sensorMicrophone) {
        updateByLayer(request.sensorMicrophone[i], "sensorMicrophone", false, false);
    }

    for (let i in request.sensorHuman) {
        updateByLayer(request.sensorHuman[i], "sensorHuman", false, false);
    }

    for (let i in request.sensorUK) {
        updateByLayer(request.sensorUK[i], "sensorUK", true, false);
    }

    for (let i in request.sensorUS) {
        updateByLayer(request.sensorUS[i], "sensorUS", true, false);
    }
    
    for (let i in request.critPriorityEvent) {
        updateByLayer(request.critPriorityEvent[i], "critPriorityEvent", null, false);
    }

    for (let i in request.highPriorityEvent) {
        updateByLayer(request.highPriorityEvent[i], "highPriorityEvent", null, false);
    }

    for (let i in request.medPriorityEvent) {
        updateByLayer(request.medPriorityEvent[i], "medPriorityEvent", null, false);
    }

    for (let i in request.lowPriorityEvent) {
        updateByLayer(request.lowPriorityEvent[i], "lowPriorityEvent", null, false);
    }

    for (let i in request.complexEvent) {
        await updateByLayer(request.complexEvent[i], "complexEvent", null, false);
    }
};

// Function to go through each object in the request and attempt to delete it from the appropriate map layer
function deleteMapMarkers(request) {
    if (request.sensorCamera != null && request.sensorCamera.length > 0) { 
        deleteByLayer(request.sensorCamera, "sensorCamera", null); 
    }

    if (request.sensorMicrophone != null && request.sensorMicrophone.length > 0) { 
        deleteByLayer(request.sensorMicrophone, "sensorMicrophone", null); 
    }

    if (request.sensorHuman != null && request.sensorHuman.length > 0) { 
        deleteByLayer(request.sensorHuman, "sensorHuman", null); 
    }

    if (request.sensorUK != null && request.sensorUK.length > 0) { 
        deleteByLayer(request.sensorUK, "sensorUK", null); 
    }

    if (request.sensorUS != null && request.sensorUS.length > 0) { 
        deleteByLayer(request.sensorUS, "sensorUS", null); 
    }

    if (request.critPriorityEvent != null && request.critPriorityEvent.length > 0) { 
        deleteByLayer(request.critPriorityEvent, "critPriorityEvent", null); 
    }

    if (request.highPriorityEvent != null && request.highPriorityEvent.length > 0) { 
        deleteByLayer(request.highPriorityEvent, "highPriorityEvent", null); 
    }

    if (request.medPriorityEvent != null && request.medPriorityEvent.length > 0) { 
        deleteByLayer(request.medPriorityEvent, "medPriorityEvent", null); 
    }

    if (request.lowPriorityEvent != null && request.lowPriorityEvent.length > 0) { 
        deleteByLayer(request.lowPriorityEvent, "lowPriorityEvent", null); 
    }

    if (request.complexEvent != null && request.complexEvent.length > 0) { 
        deleteByLayer(request.complexEvent, "complexEvent", null); 
    }
}

async function updateByLayer(req, win, ownerSensor, isRange) {
    let updated = false;
    let count = 0;
    let layers = window[win].getLayers();
    let size = layers.length;

    let icon = getIcon(req.properties, ownerSensor);

    if (size > 0) {

        await window[win].eachLayer( async function (layer) {
            count ++;

            let properties = await getProperties(layer);
            
            if (properties != null) {
                // Get ID and check if layer is the right one to update
                let objID = (req.properties.eventID != null ? req.properties.eventID : (req.properties.sensorID != null ? req.properties.sensorID : req.properties.complexID));
                let type = isObjectToUpdate(properties, objID);
              
                if (type != null) { 
                    updated = true;

                    // Updating properties
                    if (!isRange) { layer.setPopupContent((type == "Event" ? req.properties.eventName : type == "Sensor" ? req.properties.sensorName : req.properties.complexName)); }
                    layer.options.properties = JSON.stringify(await updateProperties(properties, req.properties, type, ownerSensor));

                    // Updating map marker information
                    // Changing icon for sensor type, owner or event priority change
                    let currentIcon = null;
                    if (!isRange) { currentIcon = layer.getIcon(); }

                    if (!isRange && currentIcon != null && currentIcon != icon) {
                        layer.setIcon(icon); 
                    }

                    // Update location of object
                    let currentLocation = layer.getLatLng();
                    let newLocation = req.geometry.coordinates;

                    if (currentLocation.lat != newLocation[0] || currentLocation.lng != newLocation[1]) { 
                        layer.setLatLng(newLocation); 
                    }

                    // Update direction of sensor range if changed
                    if (isRange && properties.rangeDirection != null && properties.rangeDirection != req.properties.rangeDirection) { 
                        layer.setDirection(direction, 90);
                    }

                    // Update range of sensor or event
                    if (type != "Complex" && !isRange) { updateByLayer(req, win + "Range", ownerSensor, true); }
                }

                // If correct layer not found, add a new marker to the map
                if (updated == false && count == size && !isRange) {
                    if (req.properties.complexID != null) {
                        await processComplexEvent(req);
                    } else {
                        addMarker(req, (req.properties.sensorType != null), win);
                    }

                    updated = true;
                }
            }
        });
    } else if (!isRange) {
        // If layer is empty, like when the SUE interface has just been opened and is being initialised, do not attempt update just add new marker
        if (req.properties.complexID != null) {
            await processComplexEvent(req);
        } else {
            addMarker(req, (req.properties.sensorType != null), win);
        }
    }
}

// Try to parse properties from the layer into JSON
function getProperties(layer) {
    let properties = null;
    try {
        properties = JSON.parse(layer.options.properties);
    } catch {
        console.log("No properties found on layer");
    }

    return properties;
}

async function deleteByLayer(request, win, idsLst) {
    let layers = window[win].getLayers();
    let type = (win.includes("sensor") ? "sensor" : (win.includes("complex") ? "complex" : "event"));

    // Compile list of ids to delete from the layer
    let listOfIDs = [];
    if (idsLst != null && idsLst.length > 0) {
        listOfIDs = idsLst
    } else {
        for (let i in request) {
            if (type == "event") { listOfIDs.push(request[i].properties.eventID); } 
            else if (type == "sensor") { listOfIDs.push(request[i].properties.sensorID); } 
            else if (type == "complex") { listOfIDs.push(request[i].properties.complexID); } 
        }
    }
    
    // Clear map layer of all markers
    await window[win].clearLayers();

    let updatedLayers = [];

    for ( let i in layers) {
        let properties = await getProperties(layers[i]);
        let id = (type == "event" ? properties.eventID : (type == "sensor" ? properties.sensorID : properties.complexID));

        // Try to find index of marker id in the list of those to be deleted, return those that aren't in the list
        if (listOfIDs.indexOf(id) < 0) {
            updatedLayers.push(layers[i]);
        }
    };

    // Add each marker which isn't in the list of ids back on the map layer
    for (let i in updatedLayers) { 
        updatedLayers[i].addTo(window[win]);
    }

    // Delete related ranges in same way
    if (type != "complex" && !win.includes("Range")) { deleteByLayer(null, win  + "Range", listOfIDs); }
}

// Update all marker properties
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

// Get icon by sensor type/owner, event priority, or complex event
function getIcon(properties, ownerSensor) {
    if (properties.sensorType != null) {
        if (ownerSensor) { 
            return (properties.owner == "UK" ? ukIcon : usIcon); 
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

// If object ids match then return object type
function isObjectToUpdate(properties, objID) {
    if (properties.eventID != null && properties.eventID == objID) {
        return "Event";
    } else if (properties.eventID == null && properties.sensorID != null && properties.sensorID == objID) {
        return "Sensor";
    } else if (properties.complexID != null && properties.complexID == objID) {
        return "Complex";
    }
    return null;
}

// Find information on sensor with id - USED FOR EVENT DETAILS
async function findSensor(id) {
    let found = null;

    // Search through sensorUK and sensorUS layers to try and find sensor with matching id
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

// Find information on sensor with id - USED FOR COMPLEX EVENT DETAILS
async function findEvents(list) {
    let discoveredItems = [];

    // Search through all event layers to try and find events with ids detailed in the list
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

// Simple function to determine whether a list of objects is empty or not
function isEmpty(obj) {
    for ( let key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            return false;
        }
    }
    return true;
};