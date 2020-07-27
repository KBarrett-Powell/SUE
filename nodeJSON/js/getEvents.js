const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const functions = require('./functions.js');

const eventsJsonFile = path.join(__dirname, "../json/events.json");
const originalEventsJsonFile = path.join(__dirname, "../json/demo/events.json");

module.exports = {
    refreshEvents: async function refreshEvents() {
        let data = await fsp.readFile( originalEventsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        const today = new Date();

        for ( let i in data.events ) {
            let event = data.events[i];
            let datetime = new Date(event.properties.datetime);

            data.events[i].properties.datetime = (functions.buildISOString(today, datetime));
        }

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
    
        if (request != null && request.length < data.events.length) {
            
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

        let sendDelete = [];

        for (let req in request) {

            let found = false;
            let invalid = false;
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
                            sendDelete.push({"eventID": event.eventID});
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
                if ( event.eventName == null ) { newEvent = buildNewObjectError(newEvent, "Event", "eventName"); invalid = true; }
                if ( event.eventType == null ) { newEvent = buildNewObjectError(newEvent, "Event", "eventType"); invalid = true; }
                if ( event.description == null ) { newEvent = buildNewObjectError(newEvent, "Event", "description"); invalid = true; }
                if ( event.sensorID == null ) { newEvent = buildNewObjectError(newEvent, "Event", "sensorID"); invalid = true; }
                if ( event.priority == null ) { newEvent = buildNewObjectError(newEvent, "Event", "priority"); invalid = true; }

                if (!invalid) { 
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
                            "datetime": (event.datetime != null ? event.datetime : functions.buildISOString(new Date(), new Date()))
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": event.coordinates
                        }
                    }
                }

                if (newEvent.type != "Invalid Event Error") { data.events.push(newEvent); }
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

        let jsonResp = [];
        
        if (sendDelete.length > 0) {
            let deleteResp = await this.deleteEvent(sendDelete, false);
            jsonResp.push(deleteResp);
        }

        jsonResp.push({
            "type":"update",
            "critPriorityEvent": critPriorityEvent,
            "highPriorityEvent": highPriorityEvent,
            "medPriorityEvent": medPriorityEvent,
            "lowPriorityEvent": lowPriorityEvent
        });

        fs.writeFile( eventsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });

        return jsonResp
    },
    deleteEvent: async function deleteEvent(request, deleteFromFile) {
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
            
            if (deleteFromFile) { data.events = filteredList; }
        }

        if (deleteFromFile) { 
            fs.writeFile( eventsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
                if (err) throw err;
            });
        };

        let jsonResp = {
            "type":"delete",
            "critPriorityEvent": critPriorityEvent,
            "highPriorityEvent": highPriorityEvent,
            "medPriorityEvent": medPriorityEvent,
            "lowPriorityEvent": lowPriorityEvent
        }

        return jsonResp
    }
}
