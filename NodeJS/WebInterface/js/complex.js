async function processComplexEvent(complex) {
    var eventCoordinates = [];
    var y = 0;
    var x = 0;

    for ( i in complex.properties.events ) {
        let item = complex.properties.events[i];

        window.id = item;

        var data = await new Promise((resolve, reject) => {
            getEventMarkersByID(resolve);
        });

        let coordstr = data.geometry.coordinates;

        y += coordstr[0];
        x += coordstr[1];

        eventCoordinates.push(coordstr);
    }

    if (complex.properties.events != null && complex.properties.events.length > 0) {

        y = y / eventCoordinates.length;
        x = x / eventCoordinates.length;

        let markerCoordinates = [y, x];

        let coordinates = [];
        for ( i in eventCoordinates ) {
            coordinates.push([eventCoordinates[i], markerCoordinates]);
        }

        var marker = L.polyline(coordinates, {color: "#ee133b", properties: JSON.stringify(complex.properties)}).addTo(window.complexLayer);
        var marker = L.marker(markerCoordinates, {icon: markerRed, properties: JSON.stringify(complex.properties)}).on('click', toggleDetailsFromMap).addTo(window.complexLayer);
    }
};

function listContains(prevlist, curlist) {
    var match = true;

    for ( i in prevlist ) {
        if (!curlist.includes(prevlist[i])) {
            match = false;
        }
    }

    return match;
};

function refineList(list) {
    var refinedList = [];
    var eventsDict = {};

    for ( i in list ) {
        let complex = list[i];

        for ( d in eventsDict ) {
            let val = eventsDict[d];
            if ( listContains(val, complex.properties.events) ) {
                delete eventsDict[d];
                for ( j in refinedList ) {
                    if ( refinedList[j].properties.id == d) {
                        delete refinedList[j];
                        break;
                    }
                }
                break;
            }
        }

        eventsDict[complex.properties.id] = complex.properties.events; 
        refinedList.push(complex);
    }
    return refinedList;
}