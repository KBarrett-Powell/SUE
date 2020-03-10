var sensorsurl = "http://localhost:8000/sensors";
var eventsurl = "http://localhost:8000/events";
var complexurl = "http://localhost:8000/complex";

var sdiv = document.getElementById("sdiv");
var ediv = document.getElementById("ediv");
var cdiv = document.getElementById("cdiv");

var sensoralist = document.getElementById("sensoralist");
var sensorclist = document.getElementById("sensorclist");
var sensorplist = document.getElementById("sensorplist");
var eventplist = document.getElementById("eventalist");
var eventplist = document.getElementById("eventplist");
var eventvlist = document.getElementById("eventvlist");
var eventllist = document.getElementById("eventllist");
var complexalist = document.getElementById("complexalist");

var slstbadge = document.getElementById("slst-badge");
var salstbadge = document.getElementById("salst-badge");
var sclstbadge = document.getElementById("sclst-badge");
var splstbadge = document.getElementById("splst-badge");

var elstbadge = document.getElementById("elst-badge");
var ealstbadge = document.getElementById("ealst-badge");
var eplstbadge = document.getElementById("eplst-badge");
var evlstbadge = document.getElementById("evlst-badge");
var ellstbadge = document.getElementById("ellst-badge");

var clstbadge = document.getElementById("clst-badge");
var calstbadge = document.getElementById("calst-badge");

var geoLayer = L.geoJSON().addTo(window.leafletmap);
window.sensorLayer = L.layerGroup();
window.eventLayer = L.layerGroup();
window.complexLayer = L.layerGroup();

window.id = "";

window.prvClickedMarker = null;

var markerNormal = L.icon({
    iconUrl: 'images/marker-icon.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define camera icon
var cameraIcon = L.icon({
    iconUrl: 'images/marker-camera.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 40],
    popupAnchor:  [1, -34] 
});

// Define red marker
var markerRed = L.icon({
    iconUrl: 'images/marker-red.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [25, 41],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define normal marker large
var markerLarge = L.icon({
    iconUrl: 'images/marker-icon-2x.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [32, 53],
    shadowSize:   [41, 41],
    iconAnchor:   [15, 53],
    popupAnchor:  [1, -34] 
});

// Define camera icon large
var cameraIconLarge = L.icon({
    iconUrl: 'images/marker-camera.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [37, 61],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Define red marker large
var markerRedLarge = L.icon({
    iconUrl: 'images/marker-red.png',
    shadowUrl: "images/marker-shadow.png",

    iconSize:     [37, 61],
    shadowSize:   [41, 41],
    iconAnchor:   [12, 41],
    popupAnchor:  [1, -34] 
});

// Add marker function
function addMarker(json, iconimg) {
    var type = json.geometry.type;
    var coordinates = json.geometry.coordinates;

    if (type === "Point" && iconimg != null) {
        var marker = L.marker(coordinates, {icon: iconimg, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.sensorLayer);
        var marker = L.semiCircle(coordinates, {radius: 10, fillOpacity: 0.6, weight: 0, gradient: true}).setDirection(json.properties.direction, 80).addTo(window.sensorLayer);
        var marker = L.semiCircle(coordinates, {radius: 15, fillOpacity: 0.5, weight: 0, gradient: true}).setDirection(json.properties.direction, 80).addTo(window.sensorLayer);
        var marker = L.semiCircle(coordinates, {radius: 20, fillOpacity: 0.4, weight: 0, gradient: true}).setDirection(json.properties.direction, 80).addTo(window.sensorLayer);
        var marker = L.semiCircle(coordinates, {radius: 25, fillOpacity: 0.3, weight: 0, gradient: true}).setDirection(json.properties.direction, 80).addTo(window.sensorLayer);
        var marker = L.semiCircle(coordinates, {radius: 30, weight: 0, gradient: true}).setDirection(json.properties.direction, 80).addTo(window.sensorLayer);
    
    } else if (type === "Point") {
        var marker = L.marker(coordinates, {icon: markerNormal, properties: JSON.stringify(json.properties)}).on('click', toggleDetailsFromMap).addTo(window.eventLayer);
    }

    return marker;
};

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
};

// Get sensor markers
function getSensorMarkers(callback) {
    var sensorurlwithtime = sensorsurl + "?iso=" + window.datetime.toISOString();
    $.getJSON(sensorurlwithtime, function(data) {
        callback(data.sensors);
    });
};

// Get event markers
function getEventMarkers(callback) {
    var eventurlwithtime = eventsurl + "?iso=" + window.datetime.toISOString();
    $.getJSON(eventurlwithtime, function(data) {
        callback(data.events);
    });
}

// Get complex event polygons
function getComplexEvents(callback) {
    var complexurlwithtime = complexurl + "?iso=" + window.datetime.toISOString();
    $.getJSON(complexurlwithtime, function(data) {
        callback(data.connections);
    });
}

// Get sensor markers
function getAllSensorMarkers(callback) {
    $.getJSON(sensorsurl, function(data) {
        callback(data.sensors);
    });
};

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
    var eventsurlwithid = eventsurl + "/" + window.id;
    $.getJSON(eventsurlwithid, function(data) {
        callback(data);
    });
}

function clearMap() {

    var details = document.getElementById("detailsdiv");
    var id = document.getElementById("detailsID");
    var name = document.getElementById("detailsName");
    var block = document.getElementById("detailsText");

    var videodiv = document.getElementById("videodiv");
    var videodesc = document.getElementById("videoDesc");
    var video = document.getElementById("videoPlayer");
    var vsource = document.getElementById("videoSource");

    if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        id.innerHTML = "";
        name.innerHTML = "";
        block.innerHTML = "";
        videodesc.innerHTML = "";
        videodiv.classList.add('hidden');
        vsource.setAttribute('src', '');
        video.load();
    }

    window.sensorLayer.clearLayers();
    window.eventLayer.clearLayers();
    window.complexLayer.clearLayers();

    slstbadge.innerHTML = "0";
    salstbadge.innerHTML = "0";
    sclstbadge.innerHTML = "0";
    splstbadge.innerHTML = "0";

    elstbadge.innerHTML = "0";
    ealstbadge.innerHTML = "0";
    eplstbadge.innerHTML = "0";
    evlstbadge.innerHTML = "0";
    ellstbadge.innerHTML = "0";

    clstbadge.innerHTML = "0";
    calstbadge.innerHTML = "0";

    sensoralist.innerHTML = "";
    sensorclist.innerHTML = "";
    sensorplist.innerHTML = "";

    eventalist.innerHTML = "";
    eventplist.innerHTML = "";
    eventvlist.innerHTML = "";
    eventllist.innerHTML = "";

    complexalist.innerHTML = "";
}

function refreshComplex() {
    window.complexLayer.clearLayers();

    clstbadge.innerHTML = "0";
    calstbadge.innerHTML = "0";

    complexalist.innerHTML = "";
}