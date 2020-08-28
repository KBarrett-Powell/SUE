const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const functions = require('./functions.js');

const sensorsJsonFile = path.join(__dirname, "../json/sensors.json");
const originalSensorsJsonFile = path.join(__dirname, "../json/demo/sensors.json");

module.exports = {
    refreshSensors: async function refreshSensors() {
        let data = await fsp.readFile( originalSensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        const today = new Date();

        for ( let i in data.sensors ) {
            let sensor = data.sensors[i];
            let keys = Object.keys(sensor.properties);

            for ( let j in keys ) {
                if ( keys[j] != "initial" ) {
                    let datetime = new Date(keys[j]);
                    let datestr = functions.buildISOString(today, datetime);
                     
                    sensor.properties[datestr] = sensor.properties[keys[j]];
                    delete sensor.properties[keys[j]];
                }
            }
        }

        fs.writeFile( sensorsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });
    },
    getSensors: async function getSensors(request) {
        let data = await fsp.readFile( sensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        let sensorCamera = [];
        let sensorMicrophone = [];
        let sensorHuman = [];
        let sensorUK = [];
        let sensorUS = [];
    
        if (request != null && request.length < data.sensors.length) {
            
            for ( let i in request ) {
                let req = request[i];
    
                for ( let j in data.sensors ) {
        
                    let sensor  = data.sensors[j];
            
                    if ( sensor.sensorID === req.sensorID ) {
                        let properties = await functions.compileProperties(sensor.properties, "sensor");
            
                        if (properties.sensorType == "Camera") {
                            sensorCamera.push(data.sensors[j]);
                        } else if (properties.sensorType == "Microphone") {
                            sensorMicrophone.push(data.sensors[j]);
                        } else {
                            sensorHuman.push(data.sensors[j]);
                        } 
                        
                        if (properties.owner == "UK") {
                            sensorUK.push(data.sensors[j]);
                        } else {
                            sensorUS.push(data.sensors[j]);
                        }

                        break;
                    }
                }
            }

        } else {
            for ( let i in data.sensors ) {
                let sensor = data.sensors[i];
                let properties = await functions.compileProperties(sensor.properties, "sensor");

                if (properties.sensorType === "Camera") {
                    sensorCamera.push(data.sensors[i]);
                } else if (properties.sensorType === "Microphone") {
                    sensorMicrophone.push(data.sensors[i]);
                } else {
                    sensorHuman.push(data.sensors[i]);
                } 
                
                if (properties.owner === "UK") {
                    sensorUK.push(data.sensors[i]);
                } else {
                    sensorUS.push(data.sensors[i]);
                }
            }
        }

        let jsonResp = {
            "type":"update",
            "sensorCamera": sensorCamera,
            "sensorMicrophone": sensorMicrophone,
            "sensorHuman": sensorHuman,
            "sensorUK": sensorUK,
            "sensorUS": sensorUS
        }
        
        return JSON.stringify(jsonResp);
    }, 
    postSensor: async function postSensor(request) {

        let data = await fsp.readFile( sensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        let sensorCamera = [];
        let sensorMicrophone = [];
        let sensorHuman = [];
        let sensorUK = [];
        let sensorUS = [];

        let sendDelete = [];

        for (let i in request) {

            let found = false;
            let maxId = 0;
            let Id = 0;

            let newSensor = null;

            let req = request[i];
        
            for ( let j in data.sensors ) {
                let sensor  = data.sensors[j];
                let properties = await functions.compileProperties(sensor.properties, "sensor");

                maxId = sensor.sensorID;

                if (req.sensorID != null) {
                    
                    if ( sensor.sensorID === req.sensorID ) {
                        found = true;
                        let newObject = {};

                        if (req.coordinates != null && properties.coordinates != req.coordinates) {
                            newObject.coordinates = req.coordinates;
                        }
                        if (req.sensorName != null && properties.sensorName != req.sensorName) {
                            newObject.sensorName = req.sensorName;
                        }
                        if (req.sensorType != null && properties.sensorType != req.sensorType) {
                            newObject.sensorType = req.sensorType;
                            sendDelete.push({"sensorID": req.sensorID});
                        }
                        if (req.video != null && properties.video != req.video) {
                            newObject.video = req.video;
                        }
                        if (req.audio != null && properties.audio != req.audio) {
                            newObject.audio = req.audio;
                        }
                        if (req.rangeDirection != null && properties.rangeDirection != req.rangeDirection) {
                            newObject.rangeDirection = req.rangeDirection;
                        }
                        if (req.owner != null && properties.owner != req.owner) {
                            newObject.owner = req.owner;
                            sendDelete.push({"sensorID": req.sensorID});
                        }

                        if (Object.keys(newObject).length > 0) {
                            let today = new Date();
                            let datestr = functions.buildISOString(today, null);

                            data.sensors[j].properties[datestr] = newObject;

                            newSensor = data.sensors[j];
                        }

                        break;
                    }
                }
            }
        
            if (found == false) {
                Id = maxId + 1; 

                newSensor = {
                    "sensorID": Id,
                    "properties": {
                        "initial": {
                            "sensorName": req.sensorName,
                            "sensorType": req.sensorType,
                            "video": req.video,
                            "audio": req.audio,
                            "rangeDirection": req.rangeDirection,
                            "owner": req.owner,
                            "coordinates": req.coordinates
                        }
                    }
                }

                data.sensors.push(newSensor);
            }

            if (newSensor.properties.initial.sensorType === "Camera") {
                sensorCamera.push(newSensor);
            } else if (newSensor.properties.initial.sensorType === "Microphone") {
                sensorMicrophone.push(newSensor);
            } else {
                sensorHuman.push(newSensor);
            } 
            
            if (newSensor.properties.initial.owner === "UK") {
                sensorUK.push(newSensor);
            } else {
                sensorUS.push(newSensor);
            }
        }

        let jsonResp = [];

        if (sendDelete.length > 0) {
            let deleteResp = await this.deleteSensor(sendDelete, false);
            jsonResp.push(deleteResp);
        }

        jsonResp.push({
            "type":"update",
            "sensorCamera": sensorCamera,
            "sensorMicrophone": sensorMicrophone,
            "sensorHuman": sensorHuman,
            "sensorUK": sensorUK,
            "sensorUS": sensorUS
        });

        fs.writeFile( sensorsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
            if (err) throw err;
        });

        return jsonResp
    },
    deleteSensor: async function deleteSensor(request, deleteFromFile) {
        let data = await fsp.readFile( sensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

        let listOfIDs = [];
        let filteredList = [];
         
        let sensorCamera = [];
        let sensorMicrophone = [];
        let sensorHuman = [];
        let sensorUK = [];
        let sensorUS = [];
        
        for (let i in request) {
            if (request[i].sensorID != null) { listOfIDs.push(request[i].sensorID); }
        } 

        if (listOfIDs.length > 0) {
            for ( let j in data.sensors ) {
                let sensor = data.sensors[j];
                let properties = await functions.compileProperties(sensor.properties, "sensor");

                if ( listOfIDs.indexOf(sensor.sensorID) >= 0 ) {

                    if (properties.sensorType == "Camera") {
                        sensorCamera.push(data.sensors[j]);
                    } else if (properties.sensorType == "Microphone") {
                        sensorMicrophone.push(data.sensors[j]);
                    } else {
                        sensorHuman.push(data.sensors[j]);
                    } 
                    
                    if (properties.owner == "UK") {
                        sensorUK.push(data.sensors[j]);
                    } else {
                        sensorUS.push(data.sensors[j]);
                    }

                } else {
                    filteredList.push(data.sensors[j]);
                }
            }

            if (deleteFromFile) { data.sensors = filteredList; }
        }

        if (deleteFromFile) { 
            fs.writeFile( sensorsJsonFile, JSON.stringify(data, undefined, 4), function (err) {
                if (err) throw err;
            });
        };

        let jsonResp = {
            "type":"delete",
            "sensorCamera": sensorCamera,
            "sensorMicrophone": sensorMicrophone,
            "sensorHuman": sensorHuman,
            "sensorUK": sensorUK,
            "sensorUS": sensorUS
        }

        return jsonResp
    }
}