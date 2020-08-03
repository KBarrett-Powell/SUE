# How to use the SUE WebSockets

## JSON options

### Sensors
|Parameter name|Data type|Details|
|--------------|---------|-------|
|SensorID|Integer|The test sensors (ones already in SUE) have IDs in the range 1-9|
|sensorName|String|String in structure: [sensor description] on [street name]|
|sensorType|String|Camera / Microphone / Human|
|video|String|Video file name e.g. MilitaryParade.mp4|
|audio|String|Audio file name|
|rangeDirection|Integer|In range 0 to 360, showing direction sensor is pointed in as degrees from vertical top of marker|
|owner|String|UK / US|
|coordinates|Array(Float)|Latitude, Longitude coordinates in form: [lat, long] e.g. [58.145903, 7.989244]|  

### Events
|Parameter name|Data type|Details|
|--------------|---------|-------|
|eventID|Integer|The test events (ones already in SUE) have IDs in the range 1-5|
|eventName|String|String in structure: [event description] on [street name]|
|eventType|String|Person / Vehicle / Planned|
|description|String|Semantic description of event from AI/ML analysis tool|
|sensorID|Integer|ID of sensor which detected the event|
|chartPoints|Array|OPTIONAL – Output of AI/ML tool, stored as list of audioOnly / videoOnly / videoAndObjDet points in form: "chartPoints": [ { "videoOnly": [ {"x": 0, "y": 0}, {"x": 1, "y": 3}]}, { "videoAndObjDet": [ {"x": 0, "y": 4}, {"x": 1, "y": 7}]}]|
|objDetVideo|String|OPTIONAL – Object detection video file name|
|slctRevVideo|String|OPTIONAL – Selective Relevance video file name|
|detImage|String|OPTIONAL – Detection image file name|
|detAudio|String|OPTIONAL – Detection audio file name|
|priority|Integer|1 – 4 rating of priority (1 being Critical, 4 being Low)|
|datetime|ISO Datetime|ISO Datetime string in form: "YYYY-MM-DDThh:mm:ssZ" e.g. "2020-03-04T16:10:20Z"|
|coordinates|Array(Float)|Latitude, Longitude coordinates in form: [lat, long] e.g. [58.145903, 7.989244]|  

### Complex
|Parameter name|Data type|Details|
|--------------|---------|-------|
|complexID|Integer|The test complex events (ones already in SUE) have IDs in the range 1-2|
|complexName|String||
|events|Array(String)|List of eventIDs of events within the complex event e.g. "events": [2,3]|
|datetime|ISO Datetime|ISO Datetime string in form: "YYYY-MM-DDThh:mm:ssZ" e.g. "2020-03-04T16:10:20Z"|  

## WebSocket Requests
|Parameter name|Data type|Details|
|--------------|---------|-------|
|type|String|"post" / "get" / "delete"|
|events|Array(Oobject)|OPTIONAL - List containing information of events to add to database/ update/ get/ delete|
|sensors|Array(Oobject)|OPTIONAL - List containing information of sensors to add to database/ update/ get/ delete|
|complex|Array(Oobject)|OPTIONAL - List containing information of complex events to add to database/ update/ get/ delete|  

### POST Requests
These requests cover adding a new item and updating an old one.  

#### Add New Object Structure
Use JSON structure of events to create new one, no need to add an id, as it will be automatically generated.  
```
{
       "type": "post",
       "events": [
              {
                      "eventName": "New Event on Fjellgata",
                      "eventType": "Person",
                      "description": "- Blank Description -",
                      "sensorID": 6,
                      "slctRevVideo": "MilitaryParade_desc.mp4",
                      "priority": 4,
                      "datetime": "2020-03-04T16:11:00Z",
                      "coordinates": [58.148121, 7.9894312]
              }
       ]
}
```
#### Update Object Structure
The object structure in this will include the id of the object to update with any fields that need updating, and their new values.
```
{
        "type": "post",
        "events": [
              {
                      "eventID": 5,
                      "eventName": "March on Vestre Strandgate"
              }
       ]
} 
```
### GET Requests
These requests cover getting objects with an object ID.  

#### Get Object by ID Structure
The object structure in this will include the id of the object which the client wants to retrieve information on.  
```
{
        "type": "get",
        "events": [
              {
                      "eventID": 5
              },
              {
                      "eventID": 3
	}
       ]
} 
```
### DELETE Requests
These requests cover deleting an object using its object ID.  

#### Delete Object by ID Structure
The object structure in this will include the id of the object which the client wants to remove from the database.  
```
{
        "type": "delete",
        "sensors": [
              {
                      "sensorID": 4
              }
       ]
} 
```
*Credit to Jack Furby for converting my Word doc to markdown*
