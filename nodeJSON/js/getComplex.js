const express = require('express');
const router = express.Router();

const fs = require('fs');
const url = require('url');
const path = require('path');

const complexJsonFile = path.join(__dirname, "../json/complex.json");

// GET all
router.get('/', function (req, res) {
    var urlparams = url.parse(req.url, true);
    var date = new Date(urlparams.query.iso);

    if (date != null && urlparams.query.iso != null) {
        fs.readFile( complexJsonFile, 'utf8', function (err, data) {

            var parseddata = JSON.parse(data);
            var enddata = "{\"connections\": [";

            for (d in parseddata.connections) {
                let complex = parseddata.connections[d];
                let complexdate = new Date(complex.properties.datetime);
                
                if ( complexdate <= date ) {
                    enddata += JSON.stringify(complex) + ", ";
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
        fs.readFile( complexJsonFile, 'utf8', function (err, data) {
            data = JSON.parse( data );
            
            res.status(200).json(data);
            res.end( data );
        });
    }
})

// GET by id
router.get('/:id', function (req, res) {
    fs.readFile( complexJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );
        
        if ( req.params.id in data ) {

            complex = data[req.params.id];

 
            res.status(200).json(complex);
            res.end( JSON.stringify(complex));

        } else {
            res.sendStatus(404);
        }
    });
})

// POST
router.post('/', function (req, res) {
    fs.readFile( complexJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        let complexIds = data.map(item => item.id);
        let newId = 0;

        if (complexIds.length > 0) {
            newId = "Complex" + toString(complexIds.length + 1); 
        } else {
            newId = "Complex1";
        };

        let newComplex = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": req.body.coordinates
            },
            "properties": {
                "id": newId,
                "name": req.body.name,
                "type" : "Complex",
                "time": req.body.time
            }
        }

        data[complexIds.length] = newComplex;

        console.log( data );
        res.status(201).json(newComplex);
        res.end( JSON.stringify(data));
    });
})

// PUT
router.put('/:id', function (req, res) {
    fs.readFile( complexJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        if ( req.params.id in data ) {

            let updatedComplex = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": req.body.coordinates
                },
                "properties": {
                    "id": req.params.id,
                    "name": req.body.name,
                    "type" : "Complex",
                    "time": req.body.time
                }
            }

            data[req.params.id] = updatedComplex;

            console.log( data );
            res.sendStatus(204);
            res.end( JSON.stringify(data));

            fs.writeFile(complexJsonFile, JSON.stringify(data), function(err) {
                if(err) throw err;
            })
        } else {
            res.sendStatus(404);
        }
    });
});

// DELETE
router.delete('/:id', function (req, res) {
    fs.readFile(complexJsonFile, 'utf8', function (err, data) {
        data = JSON.parse( data );

        if ( req.params.id in data ) {
            delete data[req.params.id];

            res.sendStatus(204);
            res.end( JSON.stringify(data));

            fs.writeFile(complexJsonFile, JSON.stringify(data), function(err) {
                if(err) throw err;
            })
        } else {
            res.sendStatus(404);
        }
    });
})

module.exports = router;
