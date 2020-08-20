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
    
    let id = "";
    let type = "";
    if ( req.properties.eventID != null ) { id = req.properties.eventID; type = "event"; } 
    else if (req.properties.sensorID != null ) { id = req.properties.sensorID; type = "sensor"; } 
    else { id = req.properties.complexID; type = "complex";}
    
    let layers = await window[win].getLayersByID(id);

    for ( let i in layers ) {
        let layer = layers[i];
        let properties = await getProperties(layer, false);

        if (type != "complex") { req.properties.coordinates = req.geometry.coordinates; }

        if (properties != null) {
            // Updating properties
            let updatedProperties = await updateProperties(properties, req.properties, type, isRange);
            let updateTime = await buildISOString( new Date(), null ); 
            let allProperties = JSON.parse(layer.options.properties);
            allProperties[updateTime] = updatedProperties;
            layer.options.properties = JSON.stringify(allProperties);
        
            // Updating map marker information
            // Update popup content
            if (!isRange) { 
                layer.setPopupContent((type == "event" ? req.properties.eventName : type == "sensor" ? req.properties.sensorName : req.properties.complexName)); 
            }

            // Update location of object
            if (req.geometry.coordinates != null && properties.coordinates != req.geometry.coordinates) { 
                layer.setLatLng(req.geometry.coordinates); 
            }

            // Update direction of sensor range
            if (isRange && req.properties.rangeDirection != null && (properties.sensorType == "Camera" || req.properties.sensorType == "Camera") && properties.rangeDirection != req.properties.rangeDirection) { 
                layer.setDirection(req.properties.rangeDirection, 90);
            }

            // Updates specific to just sensor and event markers
            if (type != "Complex" && !isRange) { 

                // Changing icon for sensor type, owner or event priority change
                let currentIcon = layer.getIcon(); 
                let icon = await getIcon(req.properties, ownerSensor);

                if (currentIcon != null && currentIcon != icon) {
                    layer.setIcon(icon); 
                }

                // Update range of sensor or event
                updateByLayer(req, win + "Range", ownerSensor, true); 
            }
        }
    } 
    
    if (layers.length == 0 && !isRange) {
        // If layer is empty, like when the SUE interface has just been opened and is being initialised, do not attempt update just add new marker
        if (req.properties.complexID != null) {
            await processComplexEvent(req);
        } else {
            addMarker(req, (req.properties.initial != null), win);
        }
    }
};

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
        let properties = await getProperties(layers[i], false);
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
};

// Refresh markers on map to reflect their apperance at a certain time point
async function showTimePoint() {

    let mapLayers = ["sensorCamera", "sensorMicrophone", "sensorHuman", "sensorCameraRange", "sensorMicrophoneRange", "sensorHumanRange", 
        "sensorUK", "sensorUS", "sensorUKRange", "sensorUSRange", "critPriorityEvent", "highPriorityEvent", "medPriorityEvent", "lowPriorityEvent",
        "critPriorityEventRange", "highPriorityEventRange", "medPriorityEventRange", "lowPriorityEventRange"]
    
    for (let i in mapLayers) {
        let type = (mapLayers[i].includes("sensor") ? "sensor" : "event");
        let isRange = mapLayers[i].includes("Range");
        let ownerSensor = (mapLayers[i].includes("UK") || mapLayers[i].includes("US")) ? true : false;

        await window[mapLayers[i]].eachLayer( async function (layer) {
            let properties = await getProperties(layer, false);

            if (properties != null && Object.keys(properties).length > 0) {

                // Updating map marker information
                // Making layer visible 
                layer.options.hidden = false;
                if (layer instanceof L.Marker) {
                    layer.setOpacity(1);
                } else if (type == "sensor") {
                    layer.setStyle({fillOpacity: 0.2});
                } else {
                    if (layer.options.radius == (90 * 1/4)) {
                        layer.setStyle({fillOpacity: 0.6});
                    } else {
                        layer.setStyle({fillOpacity: 0.4});
                    }
                    layer.setStyle({weight: 3});
                }

                // Update location of object
                if (properties.coordinates != null && (layer.getLatLng()[0] != properties.coordinates[0] || layer.getLatLng()[1] != properties.coordinates[1])) { 
                    layer.setLatLng(properties.coordinates); 
                }
    
                // Update direction of sensor range
                if (isRange && properties.rangeDirection != null && properties.sensorType == "Camera" && properties.rangeDirection != layer.getDirection()) { 
                    layer.setDirection(properties.rangeDirection, 90);
                }
    
                // Updates specific to just sensor and event markers
                if (!isRange) { 
                    // Changing icon for sensor type, owner or event priority change
                    let currentIcon = layer.getIcon(); 
                    let icon = await getIcon(properties, ownerSensor);
    
                    if (currentIcon != null && currentIcon != icon) {
                        layer.setIcon(icon); 
                    }
                }

            } else { 
                // Hiding map marker
                layer.options.hidden = true;
                if (layer instanceof L.Marker) {
                    layer.setOpacity(0);
                } else {
                    layer.setStyle({fillOpacity: 0});
                    if (type != "sensor") { layer.setStyle({weight: 0}); }
                }
            }
        });
    }
    
    processComplexEvent(null);   
};

// Find information on sensor with id - USED FOR EVENT DETAILS
async function findSensor(id) {
    let found = [];

    // Search through sensorUK and sensorUS layers to try and find sensor with matching id
    found = await window.sensorUK.getLayersByID(id);

    if (found.length > 0) { 
        return found[0];

    } else {
        found = await window.sensorUS.getLayersByID(id);

        if (found.length > 0) { 
            return found[0]
        }
    };

    return null;
};

// Find information on events with id - USED FOR COMPLEX EVENT DETAILS AND CHATBOT VIEW DETAILS FUNCTIONALITY
async function findEvents(list) {
    let discoveredItems = [];

    // Search through all event layers to try and find events with ids detailed in the list
    for ( let i in list ) {
        let found = [];
        found = await window.critPriorityEvent.getLayersByID(list[i]);

        if (found.length > 0 && found[0].options.hidden == false) { 
            discoveredItems.push(found[0]);

        } else {
            found = await window.highPriorityEvent.getLayersByID(list[i]);

            if (found.length > 0 && found[0].options.hidden == false) { 
                discoveredItems.push(found[0]);
             
            } else {
                found = await window.medPriorityEvent.getLayersByID(list[i]);
    
                if (found.length > 0 && found[0].options.hidden == false) {
                    discoveredItems.push(found[0]);
                 
                } else {
                    found = await window.lowPriorityEvent.getLayersByID(list[i]);
        
                    if (found.length > 0 && found[0].options.hidden == false) {
                        discoveredItems.push(found[0]);
                     
                    }
                }
            }
        }
    }

    return discoveredItems;
};

// Find information on complex events with id - USED FOR CHATBOT VIEW DETAILS FUNCTIONALITY
async function findComplex(id) {
    let found = [];

    // Search through complexEvent layer to try and find complex event with matching id
    found = await window.complexEvent.getLayersByID(id);

    if (found.length > 0) { 
        return found[0];
    }

    return null;
};