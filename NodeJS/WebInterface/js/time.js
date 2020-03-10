document.addEventListener('DOMContentLoaded', skipTime(), false);

function changeTime(checkbox) {
    if (checkbox.checked) {
        skipTime();
    } else {
        activeTime();
    }
}

function activeTime() {
    clearMap();
    window.datetime = new Date("2020-03-04T16:10:10Z");
    window.cendtime = new Date("2020-03-04T16:10:45Z");

    var skipSwitch = document.getElementById("skipSwitch");

    getAllSensorMarkers(function (data) {
        window.sensorlst = data;
        var sensorlist = window.sensorlst;

        for (i in sensorlist) {
            var sensor = sensorlist[i];

            if (skipSwitch.checked == true) {
                clearInterval(refreshId);
            } else {
                addMarker(sensor, cameraIcon);

                addListItem(sensor, "sensor", sensor.properties.sensorType);
            }
        } 

        if (sensorlist != null && Object.keys(sensorlist).length > 0) {
            window.sensorLayer.addTo(window.leafletmap);
        }
    });

    var refreshId = setInterval( function() { 

        if (skipSwitch.checked == true) {
            clearInterval(refreshId);
        }

        window.datetime.setSeconds( window.datetime.getSeconds() + 5 );
               
        getEventMarkers(function (data) {

            if ( data != window.eventlst ) {

                window.eventlst = data;
                var eventlist = window.eventlst;

                for (i in eventlist) {
                    var event = eventlist[i];

                    if (skipSwitch.checked == true) {
                        clearInterval(refreshId);
                    } else {
                        addMarker(event, null);
            
                        addListItem(event, "event", event.properties.eventType);
                    }
                } 
            
                if (eventlist != null && Object.keys(eventlist).length > 0) {
                    window.eventLayer.addTo(window.leafletmap);
                }
            }
        });

        if (window.datetime <= window.cendtime) {
            getComplexEvents(function (data) {

                if ( JSON.stringify(data) != JSON.stringify(window.complexlst) ) {

                    window.complexlst = data;
                    var complexlist = window.complexlst;

                    if ( complexlist.length > 1 ) {
                        refreshComplex();
                    }

                    var refinedList = refineList(complexlist);

                    for ( i in refinedList ) {
                        let complex = refinedList[i];

                        if (skipSwitch.checked == true) {
                            clearInterval(refreshId);
                        } else {

                            processComplexEvent(complex);

                            addListItem(complex, "complex", null);
                        }
                    } 

                    if (complexlist != null && Object.keys(complexlist).length > 0) {
                        window.complexLayer.addTo(window.leafletmap);
                    }
                }
            });
        }
    }, 5000);
};

function skipTime() {
    clearMap();
     
    getAllSensorMarkers(function (data) {
        window.sensorlst = data;
        var sensorlist = window.sensorlst;

        for (i in sensorlist) {
            var sensor = sensorlist[i];

            addMarker(sensor, cameraIcon);

            addListItem(sensor, "sensor", sensor.properties.sensorType);
        } 

        if (sensorlist != null && Object.keys(sensorlist).length > 0) {
            window.sensorLayer.addTo(window.leafletmap);
        }
    });

    getAllEventMarkers(function (data) {
        window.eventlst = data;
        var eventlist = window.eventlst;
        
        for (i in eventlist) {
            var event = eventlist[i];
        
            addMarker(event, null);
        
            addListItem(event, "event", event.properties.eventType);
        } 
        
        if (eventlist != null && Object.keys(eventlist).length > 0) {
            window.eventLayer.addTo(window.leafletmap);
        }
    });

    getAllComplexEvents(function (data) {
        window.complexlst = data;
        var complexlist = window.complexlst;

        var refinedList = refineList(complexlist);

        for ( i in refinedList ) {
            let complex = refinedList[i];

            processComplexEvent(complex);

            addListItem(complex, "complex", null);
        } 

        if (refinedList != null && Object.keys(refinedList).length > 0) {
            window.complexLayer.addTo(window.leafletmap);
        }
    });
};