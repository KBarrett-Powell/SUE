var express = require('express');
var router = express.Router();

var fs = require('fs');
var url = require('url');

var eventsJsonFile = __dirname + "/events.json";

// GET all
router.get('/', function (req, res) {
    var urlparams = url.parse(req.url, true);
    var date = new Date(urlparams.query.iso);

    if (date != null && urlparams.query.iso != null) {
        fs.readFile( eventsJsonFile, 'utf8', function (err, data) {

            var parseddata = JSON.parse(data);
            var enddata = "{\"events\": [";

            for (d in parseddata.events) {
                let event = parseddata.events[d];
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
    
            if ( item.properties.id == req.params.id) {
                found = true;
    
                let event = item;
    
                res.status(200).json(event);
                res.end( event );

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
    fs.readFile( eventsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        let eventIds = data.map(item => item.id);
        let newId = 0;
        if (eventIds.length > 0) {
            newId = "event" + toString(eventIds.length + 1); 
        } else {
            newId = "event1";
        };

        let newEvent = {
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

        data[newId] = newEvent;

        console.log( data );
        res.status(201).json(newEvent);
        res.end( JSON.stringify(data));
    });
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

module.exports = router;