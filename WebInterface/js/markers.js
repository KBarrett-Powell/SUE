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
    let ranges = [];

    let keys = await Object.keys(json.properties);
    let current = compileProperties(json.properties, keys);
    let coordinates = current.coordinates;

    if (sensor) {
        let objID = json.sensorID;

        // Create default sensor marker with camera icon
        let sensorMarker = L.marker(coordinates, {id: objID, properties: JSON.stringify(json.properties), open: false, hidden: false}).on('click', toggleDetailsFromMap);
        sensorMarker.bindPopup(current.sensorName);
        let radius = 10;

        let sensorType = current.sensorType;

        // Fill in Sensor Type map layers
        if (sensorType == "Camera"){
            // Create semicircle ranges for camera range, and store in ranges list
            for ( let i = 0; i < 5; i ++ ) {
                let newRange = L.semiCircle(coordinates, {radius: radius, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, id: objID, properties: JSON.stringify(json.properties), hidden: false}).setDirection(current.rangeDirection, 90);
                ranges.push(newRange);
                radius = radius + 5;
            }

        } else {
            // Create circle ranges for microphone and human range, and store in ranges list
            for ( let i = 0; i < 5; i ++ ) {
                let newRange = L.circle(coordinates, {radius: radius, fillColor: '#999', fillOpacity: 0.2, weight: 0, gradient: true, id: objID, properties: JSON.stringify(json.properties), hidden: false});
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
        let objID = json.eventID;

        let iconChoice = null;
        let colourChoice = "";

        // Get colour and icon choice based on event priority and whether accessibility mode is on or not
        if (current.priority == 4) {
            iconChoice = (window.accessibility == false ? blueIcon : cbBlueIcon);
            colourChoice = (window.accessibility == false ? '#76CAEC' : '#6CA5D6');

        } else if (current.priority == 3) {
            iconChoice = (window.accessibility == false ? yellowIcon : cbYellowIcon);
            colourChoice = (window.accessibility == false ? '#FEDD80' : '#70D4E5');
        
        } else if (current.priority == 2) {
            iconChoice = (window.accessibility == false ? orangeIcon : cbOrangeIcon);
            colourChoice = (window.accessibility == false ? '#FEA080' : '#FE9D85');
        
        } else if (current.priority == 1) {
            iconChoice = (window.accessibility == false ? redIcon : cbRedIcon);
            colourChoice = (window.accessibility == false ? '#FE7F7F' : '#EC6C71');
        }

        // Create an event marker with the icon determined above
        let eventmarker = L.marker(coordinates, {id: objID, icon: iconChoice, properties: JSON.stringify(json.properties), open: false, hidden: false}).on('click', toggleDetailsFromMap);
        eventmarker.bindPopup(current.eventName);
        
        // Creating a varying outer range for events determined randomly from list of avaliable ranges
        let rangeRadius = [90, 80, 70, 60, 50, 40, 30];
        let rad = rangeRadius[Math.floor(Math.random() * rangeRadius.length)];

        // Add range circles to list
        ranges.push(L.circle(coordinates, {radius: eventRadius*1/4, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.6, weight: 3, gradient: true, id: objID, properties: JSON.stringify(json.properties), hidden: false}));
        ranges.push(L.circle(coordinates, {radius: rad, fillColor: colourChoice, color: colourChoice, fillOpacity: 0.4, weight: 3, gradient: true, id: objID, properties: JSON.stringify(json.properties), hidden: false}));
        
        // Add event marker and its ranges to the appropriate layer
        if (current.priority == 4) {
            addMarkerToLayer(eventmarker, ranges, window.lowPriorityEvent, window.lowPriorityEventRange);

        } else if (current.priority == 3) {
            addMarkerToLayer(eventmarker, ranges, window.medPriorityEvent, window.medPriorityEventRange);

        } else if (current.priority == 2) {
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

// Try to parse properties from the layer into JSON
async function getProperties(layer, graph) {
    let properties = null;
    try {
        let allProperties = (JSON.parse(layer.options.properties));
        let keys = Object.keys(allProperties);
        if (graph) { properties = keys[0]; }
        else {
          allProperties.id = layer.options.id;
          properties = await compileProperties(allProperties, keys, true);
        }

    } catch {
        console.log("No properties found on layer");
    }

    return properties;
};

function compileProperties(properties, keys, time) {
    let fullProperties = {};
    let type = properties.initial != null ? "sensor" : (properties[keys[0]].events != null ? "complex" : "event");
    
    let currentTime = null;
    if ( window.timePoint != null && time ) {
        let splitTime = window.timePoint.split(":");
        currentTime = new Date();
        currentTime.setHours(splitTime[0]);
        currentTime.setUTCMinutes(splitTime[1]);
        currentTime.setUTCSeconds(splitTime[2]);
        currentTime.setUTCMilliseconds(0);
    };

    for ( let i in keys ) {
        let propertiesTime = null;
        if ( window.timePoint != null && keys[i] != "initial" && time ) {
            propertiesTime = new Date(keys[i]);
        }

        if ( currentTime == null || propertiesTime < currentTime ) {
            let item = properties[keys[i]];

            if (type.toLowerCase() == "event") {
                if (item.eventName != null) {
                    fullProperties.eventName = item.eventName;
                }
                if (item.eventType != null) {
                    fullProperties.eventType = item.eventType;
                }
                if (item.description != null) {
                    fullProperties.description = item.description;
                }
                if (item.sensorID != null) {
                    fullProperties.sensorID = item.sensorID;
                }
                if (item.chartPoints != null) {
                    fullProperties.chartPoints = item.chartPoints;
                }
                if (item.objDetVideo != null) {
                    fullProperties.objDetVideo = item.objDetVideo;
                }
                if (item.slctRevVideo != null) {
                    fullProperties.slctRevVideo = item.slctRevVideo;
                }
                if (item.detAudio != null) {
                    fullProperties.detAudio = item.detAudio;
                }
                if (item.detImage != null) {
                    fullProperties.detImage = item.detImage;
                }
                if (item.priority != null) {
                    fullProperties.priority = item.priority;
                }
                fullProperties.datetime = keys[i];
                fullProperties.eventID = properties.id
        
            } else if (type.toLowerCase() == "sensor") {
                if (item.sensorName != null) {
                    fullProperties.sensorName = item.sensorName;
                }
                if (item.sensorType != null) {
                    fullProperties.sensorType = item.sensorType;
                }
                if (item.video != null) {
                    fullProperties.video = item.video;
                }
                if (item.audio != null) {
                    fullProperties.audio = item.audio;
                }
                if (item.owner != null) {
                    fullProperties.owner = item.owner;
                }
                if (item.rangeDirection != null) {
                    fullProperties.rangeDirection = item.rangeDirection;
                }
                fullProperties.sensorID = properties.id
            
            } else {
                if (item.complexName != null) {
                    fullProperties.complexName = item.complexName;
                }
                if (item.events != null) {
                    fullProperties.events = item.events;
                }
                fullProperties.datetime = keys[i];
                fullProperties.complexID = properties.id
            }

            if ( type.toLowerCase() != "complex" && item.coordinates != null ) {
                fullProperties.coordinates = item.coordinates;
            }
        }
    }

    return fullProperties;
};

// Update all marker properties
async function updateProperties(marker, update, type, isRange) {
    let properties = {};

    if (!isRange && type.toLowerCase() == "event") {
        if (update.eventName != null && update.eventName != marker.eventName) {
            properties.eventName = update.eventName;
        }
        if (update.eventType != null && update.eventType != marker.eventType) {
            properties.eventType = update.eventType;
        }
        if (update.description != null && update.description != marker.description) {
            properties.description = update.description;
        }
        if (update.sensorID != null && update.sensorID != marker.sensorID) {
            properties.sensorID = update.sensorID;
        }
        if (update.chartPoints != null && update.chartPoints != marker.chartPoints) {
            properties.chartPoints = update.chartPoints;
        }
        if (update.objDetVideo != null && update.objDetVideo != marker.objDetVideo) {
            properties.objDetVideo = update.objDetVideo;
        }
        if (update.slctRevVideo != null && update.slctRevVideo != marker.slctRevVideo) {
            properties.slctRevVideo = update.slctRevVideo;
        }
        if (update.priority != null && update.priority != marker.priority) {
            properties.priority = update.priority;
        }
        if (update.datetime != null && update.datetime != marker.datetime) {
            properties.datetime = update.datetime;
        }

    } else if (type.toLowerCase() == "sensor") {
        if (!isRange && update.sensorName != null && update.sensorName != marker.sensorName) {
            properties.sensorName = update.sensorName;
        }
        if (update.sensorType != null && update.sensorType != marker.sensorType) {
            properties.sensorType = update.sensorType;
        }
        if (!isRange && update.video != null && update.video != marker.video) {
            properties.video = update.video;
        }
        if (!isRange && update.audio != null && update.audio != marker.audio) {
            properties.audio = update.audio;
        }
        if (!isRange && update.owner != null && update.owner != marker.owner) {
            properties.owner = update.owner;
        }
        if (isRange && update.rangeDirection != null && update.rangeDirection != marker.rangeDirection) {
            properties.rangeDirection = update.rangeDirection;
        }

    } else if (!isRange) {
        if (update.complexName != null && update.complexName != marker.complexName) {
            properties.complexName = update.complexName;
        }
        if (update.events != null && update.events != marker.events) {
            properties.events = update.events;
        }
        if (update.datetime != null && update.datetime != marker.datetime) {
            properties.datetime = update.datetime;
        }
    }

    if ( type.toLowerCase() != "complex" && update.coordinates != null && update.coordinates != marker.coordinates) {
        properties.coordinates = update.coordinates;
    }

    return Promise.resolve(properties);
};

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
