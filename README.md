# SUE
Situational Understanding Explorer. An interface designed to showcase new situational awareness/ understandin research on a city-based map integration. This interface can take inputs in the form of JSON documents and display then as markers on the map, with features to allow user interaction and customisation.  
Currently being used to display sensors and events around a city, with sensors being data capturers, such as CCTV cameras and microphones, and events being AI detected anomolous events that are discovered within sensor feeds.  

![](examples/SUE-mainpage.png)

## Features
### Chatbot
The interface features a chatbot through which users can customise the map, removing objects they don't want to see, to reduce potential clutter and assist in their situational understanding development.  

![](examples/Chatbot-example.png)

### Real-Time Mode
The interface also has a feature to allow for a real-time demonstrations, with events appearing on the map as they are 'detected'. This feature assists in demonstrating how data would appear in a live version.

![](examples/Realtime-example.png)

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
