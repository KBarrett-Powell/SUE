window.currentComplex = [];
window.complexEventsAdded = [];

// Processes a list of complex events, only updating markers on the map if the list has changed from what is currently stored
async function processComplexEvent(json, idList) {
    let currentComplexLst = window.currentComplex;
    if (json != null) { currentComplexLst.push(json); }

    let refinedList = await refineList(currentComplexLst, idList); 
    window.currentComplex = refinedList;

    if (refinedList != currentComplexLst) {
        refreshComplex();

        for ( let i in refinedList ) {
            let complex = refinedList[i];
            await addComplexMarker(complex);
        }
    }
};

// Adds a new marker to the map for the complex event described in the "complex" object
async function addComplexMarker(complex) {
    let eventCoordinates = [];
    let eventDetails = [];
    let lat = 0;
    let long = 0;

    let events = await findEvents(complex.properties.events);

    for ( let i in events ) {
        let item = await getProperties(events[i], false);

        let coordinates = item.coordinates;
       
        lat += coordinates[0];
        long += coordinates[1];

        let obj = {datetime: item.datetime, id: item.eventID, name: item.eventName, description: item.eventType + " - " + item.description, coordinates: coordinates[0] + ", " + coordinates[1], priority: item.priority};

        eventCoordinates.push(coordinates);
        eventDetails.push(obj);
    }

    if (events.length > 0 && complex.properties.events != null && complex.properties.events.length > 0) {

        lat = lat / eventCoordinates.length;
        long = long / eventCoordinates.length;

        let markerCoordinates = [lat, long];

        let coordinates = [];
        for ( let i in eventCoordinates ) {
            coordinates.push([eventCoordinates[i], markerCoordinates]);
        }

        let cmplxproperties = complex.properties;
        cmplxproperties.eventDetails = eventDetails;

        let id = complex.complexID;

        let datetime = new Date(complex.properties.datetime);
        let updateTime = buildISOString( datetime, null );
        let finishedProperties = { [updateTime]: cmplxproperties };

        L.polyline(coordinates, {id: id, color: "#ee133b", properties: JSON.stringify(finishedProperties)}).addTo(window.complexEvent);
        complexevent = L.marker(markerCoordinates, {id: id, icon: complexIcon, properties: JSON.stringify(finishedProperties), open: false}).on('click', toggleDetailsFromMap).addTo(window.complexEvent);
        complexevent.bindPopup(complex.properties.complexName)

        if ( window.complexEventsAdded.indexOf(id) == -1 ) {
            await sendUpdateToChat("Complex Event", id, complex.properties.complexName);
            window.complexEventsAdded.push(id);
        };
    }
    
    toggleLayer(window.complexEvent);
};

// Remove duplicates from the list of complex events
function refineList(list, idList) {
    let refinedList = [];
    let complexList = [];
      
    for ( let i in list ) {
        let newEvents = list[i].properties.events;
        let okayToAdd = true;

        if ( idList != null && idList.length > 0 && idList.indexOf(list[i].complexID) >= 0 ) {
            okayToAdd = false;
        }

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