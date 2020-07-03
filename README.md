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

*To be implemented in coming week: support for event priority updates, location updates*

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
