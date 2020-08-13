module.exports = {
    buildISOString: function buildISOString(curDate, svdDate) {

      if ( svdDate == null ) {

        return curDate.getUTCFullYear() + '-' + this.pad(curDate.getUTCMonth() + 1) + '-' + this.pad(curDate.getUTCDate()) +
        'T' + this.pad(curDate.getUTCHours()) + ':' + this.pad(curDate.getUTCMinutes()) + ':' + this.pad(curDate.getUTCSeconds()) + 'Z';

      } else {
        let minutes = curDate.getUTCMinutes() - 1;
        if ( svdDate.getUTCMinutes() == 9 ) { minutes = minutes - 1; }
        else if ( svdDate.getUTCMinutes() == 11 ) { minutes = minutes + 1; }
      
        return curDate.getUTCFullYear() + '-' + this.pad(curDate.getUTCMonth() + 1) + '-' + this.pad(curDate.getUTCDate()) +
          'T' + this.pad(curDate.getUTCHours()) + ':' + this.pad(minutes) + ':' + this.pad(svdDate.getUTCSeconds()) + 'Z';
      }
    },

    pad: function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    },

    buildNewObjectError: function buildNewObjectError(newObj, type, toAdd) {
      if (newObj == null || !newObj.type.includes("Error")) {
        newObj = {
          "type": "Invalid " + type + " Error",  
          "properties": {
            toAdd: "missing"
          }
        };
      } else {
        newObj.properties[toAdd] = "missing";
      }

      return newObj;
    },

    compileProperties: function compileProperties(properties, type) {
      let fullProperties = {};
      let keys = Object.keys(properties);

      for ( let i in keys ) {    
        let item = properties[keys[i]];

        if (type.toLowerCase() == "event") {

          if (item.eventName != null) {
            fullProperties.eventName = item.eventName;
          }
          if (item.eventType != null) {
            fullProperties.eventType = item.eventType;
          }
          if (item.description != null) {
            fullProperties.description = item.description;
          }
          if (item.sensorID != null) {
            fullProperties.sensorID = item.sensorID;
          }
          if (item.chartPoints != null) {
            fullProperties.chartPoints = item.chartPoints;
          }
          if (item.objDetVideo != null) {
            fullProperties.objDetVideo = item.objDetVideo;
          }
          if (item.slctRevVideo != null) {
            fullProperties.slctRevVideo = item.slctRevVideo;
          }
          if (item.priority != null) {
            fullProperties.priority = item.priority;
          }
          if (item.datetime != null) {
            fullProperties.datetime = item.datetime;
          }
          
        } else if (type.toLowerCase() == "sensor") {

          if (item.sensorName != null) {
            fullProperties.sensorName = item.sensorName;
          }
          if (item.sensorType != null) {
            fullProperties.sensorType = item.sensorType;
          }
          if (item.video != null) {
            fullProperties.video = item.video;
          }
          if (item.audio != null) {
            fullProperties.audio = item.audio;
          }
          if (item.owner != null) {
            fullProperties.owner = item.owner;
          }
          if (item.rangeDirection != null) {
            fullProperties.rangeDirection = item.rangeDirection;
          }
              
        } else {
          if (item.complexName != null) {
            fullProperties.complexName = item.complexName;
          }
          if (item.events != null) {
            fullProperties.events = item.events;
          }
          if (item.datetime != null) {
            fullProperties.datetime = item.datetime;
          }
        }
  
        if ( i != 0 && type.toLowerCase() != "complex" && item.coordinates != null ) {
          fullProperties.coordinates = item.coordinates;
        }
      }

    return fullProperties;
    }
}