const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const eventsJsonFile = path.join(__dirname, "../json/events.json");
const originalEventsJsonFile = path.join(__dirname, "../json/demo/events.json");

module.exports = {
    refreshEvents: async function refreshEvents() {
        let data = await fsp.readFile( originalEventsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        fs.writeFile( eventsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });
    },
    getEvents: async function getEvents(request) {
        let data = await fsp.readFile( eventsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        let critPriorityEvent = [];
        let highPriorityEvent = [];
        let medPriorityEvent = [];
        let lowPriorityEvent = [];
    
        if (request != null && request.size() < data.events.size()) {
            
            for ( let i in request ) {
                let found = false;
                let req = request[i];
        
                for ( let j in data.events ) {
        
                    let event  = data.events[j];
            
                    if ( event.properties.eventID == req.eventID ) {
                        found = true;
            
                        if (event.properties.priority == 1) {
                            critPriorityEvent.push(event);
                        } else if (event.properties.priority == 2) {
                            highPriorityEvent.push(event);
                        } else if (event.properties.priority == 3) {
                            medPriorityEvent.push(event);
                        } else {
                            lowPriorityEvent.push(event);
                        }

                        break;
                    }
                }
            }
        } else {
            for ( let i in data.events ) {
                let event = data.events[i];

                if (event.properties.priority == 1) {
                    critPriorityEvent.push(event);
                } else if (event.properties.priority == 2) {
                    highPriorityEvent.push(event);
                } else if (event.properties.priority == 3) {
                    medPriorityEvent.push(event);
                } else {
                    lowPriorityEvent.push(event);
                }
            }
        }

        let jsonResp = {
            "type":"update",
            "critPriorityEvent": critPriorityEvent,
            "highPriorityEvent": highPriorityEvent,
            "medPriorityEvent": medPriorityEvent,
            "lowPriorityEvent": lowPriorityEvent
        }

        return JSON.stringify(jsonResp);
    }, 
    postEvent: async function postEvent(request) {

        let data = await fsp.readFile( eventsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        let critPriorityEvent = [];
        let highPriorityEvent = [];
        let medPriorityEvent = [];
        let lowPriorityEvent = [];

        for (let req in request) {

            let found = false;
            let maxId = 0;
            let Id = 0;

            let newEvent = null;

            let event = request[req];
        
            for ( i in data.events ) {
                let item  = data.events[i];

                maxId = item.properties.eventID;

                if (event.eventID != null) {
                    
                    if ( item.properties.eventID == event.eventID ) {
                        found = true;

                        if (event.coordinates != null) {
                            data.events[i].geometry.coordinates = event.coordinates;
                        }
                        if (event.eventName != null) {
                            data.events[i].properties.eventName = event.eventName;
                        }
                        if (event.eventType != null) {
                            data.events[i].properties.eventType = event.eventType;
                        }
                        if (event.description != null) {
                            data.events[i].properties.description = event.description;
                        }
                        if (event.sensorID != null) {
                            data.events[i].properties.sensorID = event.sensorID;
                        }
                        if (event.chartPoints != null) {
                            data.events[i].properties.chartPoints = event.chartPoints;
                        }
                        if (event.objDetVideo != null) {
                            data.events[i].properties.objDetVideo = event.objDetVideo;
                        }
                        if (event.slctRevVideo != null) {
                            data.events[i].properties.slctRevVideo = event.slctRevVideo;
                        }
                        if (event.priority != null) {
                            data.events[i].properties.priority = event.priority;
                        }
                        if (event.datetime != null) {
                            data.events[i].properties.datetime = event.datetime;
                        }

                        newEvent = data.events[i];

                        break;
                    }
                }
            }
        
            if (found == false) {
                Id = (maxId + 1); 

                newEvent = {
                    "type": "Feature",
                    "properties": {
                        "eventID": Id,
                        "eventName": event.eventName,
                        "eventType": event.eventType,
                        "description": event.description,
                        "sensorID": event.sensorID,
                        "chartPoints": event.chartPoints,
                        "objDetVideo": event.objDetVideo,
                        "slctRevVideo": event.slctRevVideo,
                        "priority": event.priority,
                        "datetime": event.datetime
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": event.coordinates
                    }
                }

                data.events.push(newEvent);
            }

            if (newEvent.properties.priority == 1) {
                critPriorityEvent.push(newEvent);
            } else if (newEvent.properties.priority == 2) {
                highPriorityEvent.push(newEvent);
            } else if (newEvent.properties.priority == 3) {
                medPriorityEvent.push(newEvent);
            } else {
                lowPriorityEvent.push(newEvent);
            }

        }

        fs.writeFile( eventsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });

        let jsonResp = {
            "type":"update",
            "critPriortiyEvent": critPriorityEvent,
            "highPriorityEvent": highPriorityEvent,
            "medPriorirtyEvent": medPriorityEvent,
            "lowPriorityEvent": lowPriorityEvent
        }

        return jsonResp
    },
    deleteEvent: async function deleteEvent(request) {
        let data = await fsp.readFile( eventsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        let listOfIDs = [];
        let filteredList = [];
         
        let critPriorityEvent = [];
        let highPriorityEvent = [];
        let medPriorityEvent = [];
        let lowPriorityEvent = [];
        
        for (let i in request) {
            if (request[i].eventID != null) { listOfIDs.push(request[i].eventID); }
        } 

        if (listOfIDs.length > 0) {
            for ( let i in data.events ) {
                let event = data.events[i].properties;

                if ( listOfIDs.indexOf(event.eventID) >= 0 ) {
                    if (event.priority == 1) {
                        critPriorityEvent.push(data.events[i]);
                    } else if (event.priority == 2) {
                        highPriorityEvent.push(data.events[i]);
                    } else if (event.priority == 3) {
                        medPriorityEvent.push(data.events[i]);
                    } else {
                        lowPriorityEvent.push(data.events[i]);
                    }

                } else {
                    filteredList.push(data.events[i]);
                }
            }
            
            data.events = filteredList;
        }

        fs.writeFile( eventsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });

        let jsonResp = {
            "type":"delete",
            "critPriortiyEvent": critPriorityEvent,
            "highPriorityEvent": highPriorityEvent,
            "medPriorirtyEvent": medPriorityEvent,
            "lowPriorityEvent": lowPriorityEvent
        }

        return jsonResp
    }
}