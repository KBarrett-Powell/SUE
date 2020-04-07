const express = require('express');
const router = express.Router();

const fs = require('fs');
const url = require('url');
const path = require('path');

const sensorsJsonFile = path.join(__dirname, "../json/sensors.json");

// GET all
router.get('/', function (req, res) {
    var urlparams = url.parse(req.url, true);
    var date = new Date(urlparams.query.iso);

    if (date != null && urlparams.query.iso != null) {
        fs.readFile( sensorsJsonFile, 'utf8', function (err, data) {

            var parseddata = JSON.parse(data);
            console.log(parseddata);
            var enddata = "{\"sensors\": [";

            for (d in parseddata.sensors) {
                let sensor = parseddata.sensors[d];
                let sensordate = new Date(sensor.properties.datetime);

                if ( sensordate <= date && Math.abs(date.getTime() - sensordate.getTime()) < 5000) {
                    enddata += JSON.stringify(sensor) + ", ";
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
        fs.readFile( sensorsJsonFile, 'utf8', function (err, data) {
            data = JSON.parse( data );
            
            res.status(200).json(data);
            res.end( data );
        });
    }
})

// GET by id
router.get('/:id', function (req, res) {
    fs.readFile( sensorsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );
        
        if ( req.params.id in data ) {

            sensor = data[req.params.id];

            console.log(sensor);
            res.status(200).json(sensor);
            res.end( JSON.stringify(sensor));

        } else {
            res.sendStatus(404);
        }
    });
})

// POST
router.post('/', function (req, res) {
    fs.readFile( sensorsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        let sensorIds = data.map(item => item.id);
        let newId = 0;
        if (sensorIds.length > 0) {
            newId = "sensor" + toString(sensorIds.length + 1); 
        } else {
            newId = "sensor";
        };

        let newSensor = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": req.body.coordinates
            },
            "properties": {
                "name": req.body.name,
                "type": "Sensor",
                "sensorType": req.body.sensorType,
                "time": req.body.time,
                "linkedToEvent": req.body.eventLink
            }
        }

        data[newId] = newSensor;

        console.log( data );
        res.status(201).json(newSensor);
        res.end( JSON.stringify(data) );
    });
})

router.put('/:id', function (req, res) {
    fs.readFile( sensorsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        if ( req.params.id in data ) {
            
            let updatedSensor = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": req.body.coordinates
                },
                "properties": {
                    "name": req.body.name,
                    "type": "Sensor",
                    "sensorType": req.body.sensorType,
                    "time": req.body.time,
                    "linkedToEvent": req.body.eventLink
                }
            }

            data[req.params.id] = updatedEvent;

            console.log( data );
            res.sendStatus(204);
            res.end( JSON.stringify(data));

            fs.writeFile('sensors.json', JSON.stringify(data), function(err) {
                if(err) throw err;
            })
        } else {
            res.sendStatus(404);
        }
    });
});

// DELETE
router.delete('/:id', function (req, res) {
    fs.readFile( sensorsJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        if ( req.params.id in data ) {

            delete data[req.params.id];

            console.log( data );
            res.sendStatus(204);
            res.end( JSON.stringify(data));

            fs.writeFile('sensors.json', JSON.stringify(data), function(err) {
                if(err) throw err;
            })
        } else {
            res.sendStatus(404);
        }
    });
})

module.exports = router;
