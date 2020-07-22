module.exports = {
    buildISOString: function buildISOString(curDate, svdDate) {

        function pad(number) {
          if (number < 10) {
            return '0' + number;
          }
          return number;
        }

        let minutes = curDate.getUTCMinutes() - 1;
        if ( svdDate.getUTCMinutes() == 9 ) { minutes = minutes - 1; }
        else if ( svdDate.getUTCMinutes() == 11 ) { minutes = minutes + 1; }
    
        return curDate.getUTCFullYear() + '-' + pad(curDate.getUTCMonth() + 1) + '-' + pad(curDate.getUTCDate()) +
            'T' + pad(curDate.getUTCHours()) + ':' + pad(minutes) + ':' + pad(svdDate.getUTCSeconds()) + 'Z';
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
    }
}