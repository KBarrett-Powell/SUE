const express = require('express');
const router = express.Router();

const fs = require('fs');
const fsp = require('fs').promises;
const url = require('url');
const path = require('path');

const eventsJsonFile = path.join(__dirname, "../json/events.json");

// GET all
router.get('/', function (req, res) {
    var urlparams = url.parse(req.url, true);
    var date = new Date(urlparams.query.iso);

    if (date != null && urlparams.query.iso != null) {
        fs.readFile( eventsJsonFile, 'utf8', function (err, data) {
        
            var data = JSON.parse(data);
            var enddata = "{\"events\": [";

            for (d in data.events) {
                let event = data.events[d];
                let eventdate = new Date(event.properties.datetime);

                if ( eventdate <= date && Math.abs(date.getTime() - eventdate.getTime()) < 5000) {
                    enddata += JSON.stringify(event) + ", ";
                }
            }

            let endofstr = enddata.substring(enddata.length - 2, enddata.length);

            if (endofstr == ", ") {
                enddata = enddata.slice(0, -2);
            }
            enddata += "]}";

            data = JSON.parse(enddata);

            res.status(200).json(data);
            res.end( data );
        });
    } else {
        fs.readFile( eventsJsonFile, 'utf8', function (err, data) {
            data = JSON.parse( data );
            
            res.status(200).json(data);
            res.end( data );
        });
    }
})

// GET by id
router.get('/:id', function (req, res) {
    fs.readFile( eventsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        let found = false;

        for ( i in data.events ) {

            let item  = data.events[i];
    
            if ( item.properties.eventID == req.params.id) {
                found = true;
    
                let events = item;
    
                res.status(200).json(events);
                res.end( events );

                break;
            }
        }
        
        if ( found == false ) {
            res.sendStatus(404);
        }
    });
})

// POST
router.post('/', function (req, res) {

    let newEvent, data = postEvent(req.body);

    res.status(201).json(newEvent);
    res.end( JSON.stringify(data));
})

// PUT
router.put('/:id', function (req, res) {
    fs.readFile( eventsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        if ( req.params.id in data ) {

            let updatedEvent = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": req.body.coordinates
                },
                "properties": {
                    "name": req.body.name,
                    "type" : "Event",
                    "time": req.body.time
                }
            }

            data[req.params.id] = updatedEvent;

            res.sendStatus(204);
            res.end( JSON.stringify(data));

            fs.writeFile(eventsJsonFile, JSON.stringify(data), function(err) {
                if(err) throw err;
            })
        } else {
            res.sendStatus(404);
        }
    });
});

// DELETE
router.delete('/:id', function (req, res) {
    fs.readFile(eventsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        if ( req.params.id in data ) {
            delete data[req.params.id];

            console.log( data );
            res.sendStatus(204);
            res.end( JSON.stringify(data));

            fs.writeFile(eventsJsonFile, JSON.stringify(data), function(err) {
                if(err) throw err;
            })
        } else {
            res.sendStatus(404);
        }
    });
})

module.exports = {
    router,
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
        
        for (let i in request) {
            
            let req = request[i];
            let found = false;

            if (id != null) {
            
                for ( let j in data.events ) {
            
                    let event = data.events[j];
                
                    if ( event.properties.eventID == req.eventID) {
                        found = true;
                
                        data.events.delete(event);
                    }
                }
            }
        } 

        fs.writeFile( eventsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });
    }
}