async function processComplexEvent(complex) {
    let eventCoordinates = [];
    let eventDetails = [];
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

        let obj = {datetime: data.properties.datetime, name: data.properties.eventName, description: data.properties.eventType + " - " + data.properties.description, coordinates: "[" + coordstr[0] + ", " + coordstr[1] + "]", priority: data.properties.priority};

        eventCoordinates.push(coordstr);
        eventDetails.push(obj);
    }

    if (complex.properties.events != null && complex.properties.events.length > 0) {

        y = y / eventCoordinates.length;
        x = x / eventCoordinates.length;

        let markerCoordinates = [y, x];

        let coordinates = [];
        for ( let i in eventCoordinates ) {
            coordinates.push([eventCoordinates[i], markerCoordinates]);
        }

        let cmplxproperties = complex.properties;
        cmplxproperties.eventDetails = eventDetails;

        L.polyline(coordinates, {color: "#ee133b"}).addTo(window.complexEvent);
        complexevent = L.marker(markerCoordinates, {icon: complexIcon, properties: JSON.stringify(cmplxproperties)}).on('click', toggleDetailsFromMap).addTo(window.complexEvent);
        complexevent.bindPopup(complex.properties.complexName)
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
    let complexList = [];

    for ( let i in list ) {
        let complex = list[i];

        for ( let d in complexList ) {
            let val = complexList[d];

            if ( listContains(val.properties.events, complex.properties.events) ) {
                delete complexList[d];
            }
        }
        complexList.push(complex);
    }

    for ( let c in complexList ) {
        let complex = complexList[c];

        if (complex != null) {
            refinedList.push(complex);
        }
    }
    return refinedList;
}

function compareList(current, previous) { 

    let match = true;

    if (current.length == previous.length) {
        for (let i in previous) {
            if ( !current[i].properties.complexID == previous[i].properties.complexID ) {
                match = false;
            }
        }
    } else {
        match = false;
    }

    return match;
}

// function calculateComplex(events) {
//     for (i in events) {
//         if(events[i].datetime - events[i].datetime < window.complexTime && ) {

//         }
//     }
// }