window.currentComplex = [];

async function processComplexEvent(json) {
    let currentComplexLst = window.currentComplex;
    currentComplexLst.push(json);

    let refinedList = await refineList(currentComplexLst); 
    window.currentComplex = refinedList;

    if (refinedList != currentComplexLst) {
        refreshComplex();

        for ( let i in refinedList ) {
            let complex = refinedList[i];
            await addComplexMarker(complex);
        }
    }
};

async function addComplexMarker(complex) {
    let eventCoordinates = [];
    let eventDetails = [];
    let lat = 0;
    let long = 0;

    let events = await findEvents(complex.properties.events);

    for ( let i in events ) {
        let item = JSON.parse(events[i].options.properties);

        let coordstr = events[i].getLatLng();
       
        lat += coordstr.lat;
        long += coordstr.lng;

        let obj = {datetime: item.datetime, name: item.eventName, description: item.eventType + " - " + item.description, coordinates: "[" + coordstr.lat + ", " + coordstr.lng + "]", priority: item.priority};

        eventCoordinates.push(coordstr);
        eventDetails.push(obj);
    }

    if (complex.properties.events != null && complex.properties.events.length > 0) {

        lat = lat / eventCoordinates.length;
        long = long / eventCoordinates.length;

        let markerCoordinates = [lat, long];

        let coordinates = [];
        for ( let i in eventCoordinates ) {
            coordinates.push([eventCoordinates[i], markerCoordinates]);
        }

        let cmplxproperties = complex.properties;
        cmplxproperties.eventDetails = eventDetails;

        L.polyline(coordinates, {color: "#ee133b", properties: JSON.stringify(cmplxproperties)}).addTo(window.complexEvent);
        complexevent = L.marker(markerCoordinates, {icon: complexIcon, properties: JSON.stringify(cmplxproperties)}).on('click', toggleDetailsFromMap).addTo(window.complexEvent);
        complexevent.bindPopup(complex.properties.complexName)

        toggleLayer(window.complexEvent);
    }
};

function refineList(list) {
    let refinedList = [];
    let complexList = [];
      
    for ( let i in list ) {
        let newEvents = list[i].properties.events;
        let okayToAdd = true;

        for ( let d in complexList ) {
            let prevEvents = complexList[d].properties.events;

            if (newEvents.every(function(item) {return prevEvents.indexOf(item) >= 0;})) {
                okayToAdd = false;
            }

            if (prevEvents.every(function(item) {return newEvents.indexOf(item) >= 0;})) {
                delete complexList[d];
            }
        }

        if (okayToAdd) { complexList.push(list[i]); }
    }

    for ( let c in complexList ) {
        let complex = complexList[c];

        if (complex != null) {
            refinedList.push(complex);
        }
    }

    return refinedList;
};