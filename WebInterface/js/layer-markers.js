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

    if (request.complexEvent == null) { processComplexEvent(null, null); }   
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

    if (request.complexEvent == null) { processComplexEvent(null, null); } 
};

// Finds the relevant layer and updates its properties, and features of the map marker
async function updateByLayer(request, layerGroup, ownerSensor, isRange) {
    
    let id = "";
    let type = "";
    if ( request.eventID != null ) { id = request.eventID; type = "event"; } 
    else if (request.sensorID != null ) { id = request.sensorID; type = "sensor"; } 
    else { id = request.complexID; type = "complex";}
    
    let layers = await window[layerGroup].getLayersByID(id);

    for ( let i in layers ) {
        let layer = layers[i];
        let currentProperties = await getProperties(layer, false);

        if (currentProperties != null) {
            // Updating properties
            layer.options.properties = JSON.stringify(request.properties);
            let newProperties = await getProperties(layer, false);
        
            // Updating map marker information
            // Update popup content
            if (!isRange) { 
                layer.setPopupContent((type == "event" ? newProperties.eventName : type == "sensor" ? newProperties.sensorName : newProperties.complexName)); 
            }

            // Update location of object
            if (currentProperties.coordinates != newProperties.coordinates) { 
                layer.setLatLng(newProperties.coordinates); 
            }

            // Update direction of sensor range
            if (isRange && (currentProperties.sensorType == "Camera" || newProperties.sensorType == "Camera") && currentProperties.rangeDirection != newProperties.rangeDirection) { 
                layer.setDirection(newProperties.rangeDirection, 90);
            }

            // Updates specific to just sensor and event markers
            if (type != "Complex" && !isRange) { 

                // Changing icon for sensor type, owner or event priority change
                let currentIcon = layer.getIcon(); 
                let icon = await getIcon(newProperties, ownerSensor);

                if (currentIcon != null && currentIcon != icon) {
                    layer.setIcon(icon); 
                }

                // Update range of sensor or event
                updateByLayer(request, layerGroup + "Range", ownerSensor, true); 
            }
        }
    } 
    
    if (layers.length == 0 && !isRange) {
        // If layer is empty, like when the SUE interface has just been opened and is being initialised, do not attempt update just add new marker
        if (request.complexID != null) {
            await processComplexEvent(request, null);
        } else {
            addMarker(request, (request.properties.initial != null), layerGroup);
        }
    }
};

// Attempts to find a map layer with a matching id to one specified in the passed list, deleting it from the layer group it’s stored in, when found
async function deleteByLayer(request, layerGroup, idsList) {
    let layers = window[layerGroup].getLayers();
    let type = (layerGroup.includes("sensor") ? "sensor" : (layerGroup.includes("complex") ? "complex" : "event"));

    // Compile list of ids to delete from the layer
    let listOfIDs = [];
    if (idsList != null && idsList.length > 0) {
        listOfIDs = idsList
    } else {
        for (let i in request) {
            if (type == "event") { listOfIDs.push(request[i].eventID); } 
            else if (type == "sensor") { listOfIDs.push(request[i].sensorID); } 
            else if (type == "complex") { listOfIDs.push(request[i].complexID); } 
        }
    }

    if (type == "complex") {
        processComplexEvent(null, listOfIDs);
        
    } else {
        // Clear map layer of all markers
        await window[layerGroup].clearLayers();

        let updatedLayers = [];

        for ( let i in layers) {
            let properties = await getProperties(layers[i], false);
            let id = (type == "event" ? properties.eventID : properties.sensorID);

            // Try to find index of marker id in the list of those to be deleted, return those that aren't in the list
            if ( listOfIDs.indexOf(id) < 0 ) {
                updatedLayers.push(layers[i]);
            }
        };

        // Add each marker which isn't in the list of ids back on the map layer
        for (let i in updatedLayers) { 
            updatedLayers[i].addTo(window[layerGroup]);
        }

        // Delete related ranges in same way
        if (!layerGroup.includes("Range")) { deleteByLayer(null, layerGroup  + "Range", listOfIDs); }
    } 
};

// Refresh markers on map to reflect their appearance at a certain time point
async function showTimePoint() {

    let layerGroups = ["sensorCamera", "sensorMicrophone", "sensorHuman", "sensorCameraRange", "sensorMicrophoneRange", "sensorHumanRange", 
        "sensorUK", "sensorUS", "sensorUKRange", "sensorUSRange", "critPriorityEvent", "highPriorityEvent", "medPriorityEvent", "lowPriorityEvent",
        "critPriorityEventRange", "highPriorityEventRange", "medPriorityEventRange", "lowPriorityEventRange"]
    
    for (let i in layerGroups) {
        let type = (layerGroups[i].includes("sensor") ? "sensor" : "event");
        let isRange = layerGroups[i].includes("Range");
        let ownerSensor = (layerGroups[i].includes("UK") || layerGroups[i].includes("US")) ? true : false;

        await window[layerGroups[i]].eachLayer( async function (layer) {
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

                if (!isRange) { 
                    layer.setPopupContent((type == "event" ? properties.eventName : type == "sensor" ? properties.sensorName : properties.complexName)); 
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
    
    processComplexEvent(null, null);   
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

// Opens the Popup of a selected event with specified id
async function showHoveredEvent(id) {
    let ids = [parseInt(id)];
    let events = await findEvents(ids);
    showPopup(events[0]);
};