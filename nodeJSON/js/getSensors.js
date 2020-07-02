const express = require('express');
const router = express.Router();

const fs = require('fs');
const fsp = require('fs').promises;
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

        let found = false;

        for ( i in data.sensors ) {

            let item  = data.sensors[i];
    
            if ( item.properties.sensorID == req.params.id) {
                found = true;
    
                let sensor = item;
    
                res.status(200).json(sensor);
                res.end( sensor );

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
                "linkedTosensor": req.body.sensorLink
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
                    "linkedTosensor": req.body.sensorLink
                }
            }

            data[req.params.id] = updatedsensor;

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

module.exports = {
    router,
    getSensors: async function getSensors(request) {
        let data = await fsp.readFile( sensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );
    
        if (request != null && request.size() < data.sensors.size()) {
            
            for ( let i in request ) {
                let found = false;
                let req = request[i];
    
                for ( let j in data.sensors ) {
        
                    let sensor  = data.sensors[j];
            
                    if ( sensor.properties.sensorID == req.sensorID ) {
                        found = true;
            
                        return sensor;
                    }
                }
            }

            // if ( found == false ) {
            //     return "404";
            // }

        } else {
            return data;
        }
    }, 
    postSensor: async function postSensor(request) {

        let data = await fsp.readFile( sensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        for (let req in request) {

            let found = false;
            let maxId = 0;
            let Id = 0;

            let newSensor = null;

            let sensor = request[req];
        
            for ( i in data.sensors ) {
                let item  = data.sensors[i];

                maxId = parseInt(item.properties.sensorID, 10);

                if (sensor.sensorID != null) {
                    
                    if ( item.properties.sensorID == sensor.sensorID ) {
                        found = true;

                        if (sensor.coordinates != null) {
                            data.sensors[i].geometry.coordinates = sensor.coordinates;
                        }
                        if (sensor.sensorName != null) {
                            data.sensors[i].properties.sensorName = sensor.sensorName;
                        }
                        if (sensor.sensorType != null) {
                            data.sensors[i].properties.sensorType = sensor.sensorType;
                        }
                        if (sensor.video != null) {
                            data.sensors[i].properties.video = sensor.video;
                        }
                        if (sensor.audio != null) {
                            data.sensors[i].properties.audio = sensor.audio;
                        }
                        if (sensor.rangeDirection != null) {
                            data.sensors[i].properties.rangeDirection = sensor.rangeDirection;
                        }
                        if (sensor.owner != null) {
                            data.sensors[i].properties.owner = sensor.owner;
                        }

                        break;
                    }
                }
            }
        
            if (found == false) {
                Id = "" + (maxId + 1); 

                newSensor = {
                    "type": "Feature",
                    "properties": {
                        "sensorID": Id,
                        "sensorName": sensor.sensorName,
                        "sensorType": sensor.sensorType,
                        "video": sensor.video,
                        "audio": sensor.audio,
                        "rangeDirection": sensor.rangeDirection,
                        "owner": sensor.owner
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": sensor.coordinates
                    }
                }

                data.sensors.push(newSensor);
            }
        }

        fs.writeFile( sensorsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });
    },
    deleteSensor: async function deleteSensor(request) {
        let data = await fsp.readFile( sensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );
        
        for (let i in request) {

            let req = request[i];
            let found = false;
                        
            if (id != null) {
            
                for ( let j in data.sensors ) {
            
                    let sensor = data.sensors[j];
                
                    if ( sensor.properties.sensorID == req.sensorID) {
                        found = true;
                
                        data.sensors.delete(sensor);
                    }
                }
            }
            // if ( found == false ) {
            //     return "404";
            // }
        } 

        fs.writeFile( sensorsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });
    }
}