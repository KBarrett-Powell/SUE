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
            let keys = Object.keys(event.properties);

            for ( let j in keys ) {
                let datetime = new Date(keys[j]);
                let datestr = functions.buildISOString(today, datetime);
                     
                event.properties[datestr] = event.properties[keys[j]];
                delete event.properties[keys[j]];
            }
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
                let req = request[i];
        
                for ( let j in data.events ) {
        
                    let event  = data.events[j];
                    let properties = await functions.compileProperties(event.properties, "event");
            
                    if ( event.eventID === req.eventID ) {
                        found = true;
            
                        if (properties.priority === 1) {
                            critPriorityEvent.push(data.events[j]);
                        } else if (properties.priority === 2) {
                            highPriorityEvent.push(data.events[j]);
                        } else if (properties.priority === 3) {
                            medPriorityEvent.push(data.events[j]);
                        } else {
                            lowPriorityEvent.push(data.events[j]);
                        }

                        break;
                    }
                }
            }
        } else {
            for ( let i in data.events ) {
                let event = data.events[i];
                let properties = await functions.compileProperties(event.properties, "event");

                if (properties.priority === 1) {
                    critPriorityEvent.push(data.events[i]);
                } else if (properties.priority === 2) {
                    highPriorityEvent.push(data.events[i]);
                } else if (properties.priority === 3) {
                    medPriorityEvent.push(data.events[i]);
                } else {
                    lowPriorityEvent.push(data.events[i]);
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

        for (let i in request) {

            let found = false;
            let invalid = false;
            let maxId = 0;
            let Id = 0;

            let newEvent = null;

            let req = request[i];
        
            for ( let j in data.events ) {
                let event  = data.events[j];
                let properties = await functions.compileProperties(event.properties, "event");

                maxId = event.eventID;

                if (req.eventID != null) {
                    
                    if ( event.eventID === req.eventID ) {
                        found = true;
                        let newObject = {};

                        if (req.coordinates != null && properties.coordinates != req.coordinates) {
                            newObject.coordinates = req.coordinates;
                        }
                        if (req.eventName != null && properties.eventName != req.eventName) {
                            newObject.eventName = req.eventName;
                        }
                        if (req.eventType != null && properties.eventType != req.eventType) {
                            newObject.eventType = req.eventType;
                        }
                        if (req.description != null && properties.description != req.description) {
                            newObject.description = req.description;
                        }
                        if (req.sensorID != null && properties.sensorID != req.sensorID) {
                            newObject.sensorID = req.sensorID;
                        }
                        if (req.chartPoints != null && properties.chartPoints != req.chartPoints) {
                            newObject.chartPoints = req.chartPoints;
                        }
                        if (req.objDetVideo != null && properties.objDetVideo != req.objDetVideo) {
                            newObject.objDetVideo = req.objDetVideo;
                        }
                        if (req.slctRevVideo != null && properties.slctRevVideo != req.slctRevVideo) {
                            newObject.slctRevVideo = req.slctRevVideo;
                        }
                        if (req.detImage != null && properties.detImage != req.detImage) {
                            newObject.detImage = req.detImage;
                        }
                        if (req.detAudio != null && properties.detAudio != req.detAudio) {
                            newObject.detAudio = req.detAudio;
                        }
                        if (req.priority != null && properties.priority != req.priority) {
                            newObject.priority = req.priority;
                            sendDelete.push({"eventID": req.eventID});
                        }
                        if (req.datetime != null && properties.datetime != req.datetime) {
                            newObject.datetime = req.datetime;
                        }

                        if (Object.keys(newObject).length > 0) {
                            let today = new Date();
                            let datestr = functions.buildISOString(today, null);

                            data.events[j].properties[datestr] = newObject;

                            newEvent = data.events[j];
                        }

                        break;
                    }
                }
            }
        
            if (found == false) {
                Id = (maxId + 1); 
                if ( req.eventName == null ) { newEvent = buildNewObjectError(newEvent, "Event", "eventName"); invalid = true; }
                if ( req.eventType == null ) { newEvent = buildNewObjectError(newEvent, "Event", "eventType"); invalid = true; }
                if ( req.description == null ) { newEvent = buildNewObjectError(newEvent, "Event", "description"); invalid = true; }
                if ( req.sensorID == null ) { newEvent = buildNewObjectError(newEvent, "Event", "sensorID"); invalid = true; }
                if ( req.priority == null ) { newEvent = buildNewObjectError(newEvent, "Event", "priority"); invalid = true; }

                if (!invalid) { 
                    newEvent = {
                        "eventID": Id,
                        "properties": {
                            [functions.buildISOString(new Date(), new Date())]: {
                                "eventName": req.eventName,
                                "eventType": req.eventType,
                                "description": req.description,
                                "sensorID": req.sensorID,
                                "chartPoints": req.chartPoints,
                                "objDetVideo": req.objDetVideo,
                                "slctRevVideo": req.slctRevVideo,
                                "detImage": req.detImage,
                                "detAudio": req.detAudio,
                                "priority": req.priority,
                                "coordinates": req.coordinates
                            }
                        }
                    }
                }

                if (newEvent.type != "Invalid Event Error") { data.events.push(newEvent); }
            }

            let updatedProperties = await functions.compileProperties(newEvent.properties, "event");

            if (updatedProperties.priority === 1) {
                critPriorityEvent.push(newEvent);
            } else if (updatedProperties.priority === 2) {
                highPriorityEvent.push(newEvent);
            } else if (updatedProperties.priority === 3) {
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
        
        for ( let i in request ) {
            if (request[i].eventID != null) { listOfIDs.push(request[i].eventID); }
        } 

        if (listOfIDs.length > 0) {
            for ( let j in data.events ) {
                let event = data.events[j];
                let properties = await functions.compileProperties(event.properties, "event");

                if ( listOfIDs.indexOf(event.eventID) >= 0 ) {
                    if (properties.priority === 1) {
                        critPriorityEvent.push(data.events[j]);
                    } else if (properties.priority === 2) {
                        highPriorityEvent.push(data.events[j]);
                    } else if (properties.priority === 3) {
                        medPriorityEvent.push(data.events[j]);
                    } else {
                        lowPriorityEvent.push(data.events[j]);
                    }

                } else {
                    filteredList.push(data.events[j]);
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