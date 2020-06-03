async function processComplexEvent(complex) {
    let eventCoordinates = [];
    let y = 0;
    let x = 0;

    for (let i in complex.properties.events ) {
        let item = complex.properties.events[i];

        window.id = item;

        let data = await new Promise((resolve, reject) => {
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
        for ( let i in eventCoordinates ) {
            coordinates.push([eventCoordinates[i], markerCoordinates]);
        }

        L.polyline(coordinates, {color: "#ee133b", properties: JSON.stringify(complex.properties)}).addTo(window.complexEvent);
        complexevent = L.marker(markerCoordinates, {icon: complexIcon, properties: JSON.stringify(complex.properties)}).on('click', toggleDetailsFromMap).addTo(window.complexEvent);
        complexevent.bindPopup(complex.properties.name)
    }
}

function listContains(prevlist, curlist) {
    let match = true;

    for ( let i in prevlist ) {
        if (!curlist.includes(prevlist[i])) {
            match = false;
        }
    }

    return match;
}

function refineList(list) {
    let refinedList = [];
    let eventsDict = {};

    for ( let i in list ) {
        let complex = list[i];

        for ( let d in eventsDict ) {
            let val = eventsDict[d];
            if ( listContains(val, complex.properties.events) ) {
                delete eventsDict[d];
                for ( let j in refinedList ) {
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

// function calculateComplex(events) {
//     for (i in events) {
//         if(events[i].datetime - events[i].datetime < window.complexTime && ) {

//         }
//     }
// }