const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const sensorsJsonFile = path.join(__dirname, "../json/sensors.json");
const originalSensorsJsonFile = path.join(__dirname, "../json/demo/sensors.json");

module.exports = {
    refreshSensors: async function refreshSensors() {
        let data = await fsp.readFile( originalSensorsJsonFile, {encoding: 'utf8'});
        data = JSON.parse( data );

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
                let found = false;
                let req = request[i];
    
                for ( let j in data.sensors ) {
        
                    let sensor  = data.sensors[j];
            
                    if ( sensor.properties.sensorID == req.sensorID ) {
                        found = true;
            
                        if (sensor.properties.sensorType == "Camera") {
                            sensorCamera.push(sensor);
                        } else if (sensor.properties.sensorType == "Microphone") {
                            sensorMicrophone.push(sensor);
                        } else {
                            sensorHuman.push(sensor);
                        } 
                        
                        if (sensor.properties.owner == "UK") {
                            sensorUK.push(sensor);
                        } else {
                            sensorUS.push(sensor);
                        }

                        break;
                    }
                }
            }

        } else {
            for ( let i in data.sensors ) {
                let sensor = data.sensors[i];

                if (sensor.properties.sensorType == "Camera") {
                    sensorCamera.push(sensor);
                } else if (sensor.properties.sensorType == "Microphone") {
                    sensorMicrophone.push(sensor);
                } else {
                    sensorHuman.push(sensor);
                } 
                
                if (sensor.properties.owner == "UK") {
                    sensorUK.push(sensor);
                } else {
                    sensorUS.push(sensor);
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

        for (let req in request) {

            let found = false;
            let maxId = 0;
            let Id = 0;

            let newSensor = null;

            let sensor = request[req];
        
            for ( i in data.sensors ) {
                let item  = data.sensors[i];

                maxId = item.properties.sensorID;

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
                            sendDelete.push({"sensorID": sensor.sensorID});
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
                            sendDelete.push({"sensorID": sensor.sensorID});
                        }

                        newSensor = data.sensors[i];

                        break;
                    }
                }
            }
        
            if (found == false) {
                Id = maxId + 1; 

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

            if (newSensor.properties.sensorType == "Camera") {
                sensorCamera.push(newSensor);
            } else if (newSensor.properties.sensorType == "Microphone") {
                sensorMicrophone.push(newSensor);
            } else {
                sensorHuman.push(newSensor);
            } 
            
            if (newSensor.properties.owner == "UK") {
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
            for ( let i in data.sensors ) {
                let sensor = data.sensors[i].properties;

                if ( listOfIDs.indexOf(sensor.sensorID) >= 0 ) {

                    if (sensor.sensorType == "Camera") {
                        sensorCamera.push(data.sensors[i]);
                    } else if (sensor.sensorType == "Microphone") {
                        sensorMicrophone.push(data.sensors[i]);
                    } else {
                        sensorHuman.push(data.sensors[i]);
                    } 
                    
                    if (sensor.owner == "UK") {
                        sensorUK.push(data.sensors[i]);
                    } else {
                        sensorUS.push(data.sensors[i]);
                    }

                } else {
                    filteredList.push(data.sensors[i]);
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
