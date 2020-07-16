# SUE
Situational Understanding Explorer. An interface designed to showcase new situational awareness/ understandin research on a city-based map integration. This interface can take inputs in the form of JSON documents and display then as markers on the map, with features to allow user interaction and customisation.  
Currently being used to display sensors and events around a city, with sensors being data capturers, such as CCTV cameras and microphones, and events being AI detected anomolous events that are discovered within sensor feeds.  

![](examples/SUE-mainpage.png)

## Features
### Chatbot
The interface features a chatbot through which users can customise the map, removing objects they don't want to see, to reduce potential clutter and assist in their situational understanding development.  

![](examples/Chatbot-example.gif)

### WebSocket
The gif below shows the submission of a JSON object to the WebSocket (found at ws://localhost:8000) using Smart WebSocket Client for Google Chrome.  
{  
  "type": "post",  
  "events": [
  {
	    "eventID": 5,
	    "eventName": "March on Vestre Strandgate"
	  }
  ]  
}  

![](examples/websocket-update.gif)  

*To be implemented in coming week: support for event priority updates*

### Colour-Blindness Support
Using a command to enter accessibility mode in the Chatbot, the colour scheme used for events on the map changes to a colour blind friendly scheme.  

![](examples/accessibility-mode.gif)

## Recommendations
It is recommended to run this interface on a:  
- (Ubuntu-based) Linux VM  

Viewing the interface with the browser:  
- Google Chrome

## Installation
### Linux
Clone this git repository and open a termial in the SUE folder, run  
$ bash linux-build.sh  
*This may take a while. If the installation pauses and asks you to confirm storage space requirements, enter y and it will continue.*  

## Running
### Linux
In a terminal in the SUE folder, run  
$ bash linux-run.sh  
*These scripts have set ports (8000, 8080, 8081, and 8082)*  

View the dashboard by opening a web browser and going to **http://localhost:8082/map.html**

## On-Going Development
### Timeline Functionality
A dictionary of time stamps and properties will be stored with each marker, through the use of a timeline chart marking the number of events  
found at each time point, users will be able to see previous points in time. Such as where a moving sensor was when it detected an event.  

### WebSocket Update Event Priority and Sensor Type/Owner
These properties have yet to be implemented in websocket updates due to how they are stored within SUE.  

### Online Hosting
Plans to host SUE online, so it can be quickly tested by anyone, are in motion.  

### WebSocket File Uploads 
File uploads have yet to be implemented through the WebSocket. When implmented a user should be able to upload a video file and create a new Event linked to that file.  

### Input Through the Chatbot
Plans to allow users to enter json into the Chatbot, or a semantic description of 2 or more events being linked, and to see SUE be updated with this information.  

### Highlight Events within a Complex Event
On the hover of an event within a complex event timeline, the event should be highlighted on the map.
