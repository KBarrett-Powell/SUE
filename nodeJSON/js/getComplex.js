const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const functions = require('./functions.js');

const complexJsonFile = path.join(__dirname, "../json/complex.json");
const originalComplexJsonFile = path.join(__dirname, "../json/demo/complex.json");

module.exports = {
    refreshComplex: async function refreshComplex() {
        let data = await fsp.readFile( originalComplexJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        const today = new Date();

        for ( let i in data.connections ) {
            let complex = data.connections[i];
            let datetime = new Date(complex.properties.datetime);

            data.connections[i].properties.datetime = (functions.buildISOString(today, datetime));
        }

        fs.writeFile( complexJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });
    },
    getComplex: async function getComplex(request) {
        let data = await fsp.readFile( complexJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );
    
        let complexEvent = [];

        if (request != null && request.length < data.connections.length) {
            
            for ( let i in request ) {
                let req = request[i];

                for ( let j in data.connections ) {
        
                    let complex  = data.connections[j];
            
                    if ( complex.complexID === req.complexID ) {

                        complexEvent.push(complex);

                        break;
                    }
                }
            }

        } else {
            for ( let i in data.connections ) {
                let complex = data.connections[i];

                complexEvent.push(complex);
            }
        }

        let jsonResp = {
            "type":"update",
            "complexEvent": complexEvent
        }

        return JSON.stringify(jsonResp);
    }, 
    postComplex: async function postComplex(request) {

        let data = await fsp.readFile( complexJsonFile, {encoding: 'utf8'} );
        data = JSON.parse( data );

        let complexEvent = [];

        for (let i in request) {

            let found = false;
            let maxId = 0;
            let Id = 0;

            let newComplex = null;

            let req = request[i];
        
            for ( let j in data.connections ) {
                let complex  = data.connections[j];

                maxId = complex.complexID;

                if (req.complexID != null) {
                    
                    if ( complex.complexID === req.complexID ) {
                        found = true;

                        if (req.complexName != null) {
                            data.connections[j].properties.complexName = req.complexName;
                        }
                        if (req.events != null) {
                            let a = data.connections[j].properties.events;
                            let b = req.events;
                            data.connections[j].properties.events = a.concat(b.filter((item) => a.indexOf(item) < 0));
                        }
                        if (req.datetime != null) {
                            data.connections[j].properties.datetime = req.datetime;
                        }

                        newComplex = data.connections[j];

                        break;
                    }
                }
            }
        
            if (found == false) {
                Id = (maxId + 1); 

                newComplex = {
                    "complexID": Id,
                    "properties": {
                        "complexName": req.complexName,
                        "events": req.events,
                        "datetime": req.datetime
                    }
                }

                data.connections.push(newComplex);
            }

            complexEvent.push(newComplex);
        }

        fs.writeFile( complexJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });

        let jsonResp = [];
        
        jsonResp.push({
            "type":"update",
            "complexEvent": complexEvent
        });
        
        return jsonResp
    },
    deleteComplex: async function deleteComplex(request) {
        let data = await fsp.readFile( complexJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );
        
        let listOfIDs = [];
        let filteredList = [];
         
        let complexEvent = [];
        
        for ( let i in request ) {
            if (request[i].complexID != null) { listOfIDs.push(request[i].complexID); }
        } 

        if (listOfIDs.length > 0) {
            for ( let i in data.connections ) {
                let complex = data.connections[i];

                if ( listOfIDs.indexOf(complex.complexID) >= 0 ) {
                    complexEvent.push(complex);
                    
                } else {
                    filteredList.push(complex);
                }
            }
            
            data.connections = filteredList;
        }

        fs.writeFile( complexJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });

        let jsonResp = {
            "type":"delete",
            "complexEvent": complexEvent
        }

        return jsonResp
    }
}