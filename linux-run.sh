#!/bin/bash
# Clearing ports
fuser -k 8000/tcp
fuser -k 8080/tcp
fuser -k 8082/tcp

# Running rasa actions on port 5055
cd Rasa &&
source ./venv/bin/activate &&
gnome-terminal --tab -q -t "Rasa Actions (port 5055)" -- rasa run actions

# Running rasa on port 5052
gnome-terminal --tab -q -t "Rasa (port 5052)" -- python -m rasa run --m ./models --endpoints endpoints.yml --port 5052 -vv --enable-api --cors "*"

# Running chatroom processing and server on port 8080
deactivate &&
cd ../chatroom &&
gnome-terminal --tab -q -t "Chatroom (port 8080)" -- yarn serve

# Running JSON server on port 8000
cd ../nodeJSON &&
gnome-terminal --tab -q -t "JSON server (port 8000)" -- npm start

# Running Web server on port 8082
cd ../
gnome-terminal --tab -q -t "Web Server (port 8082)" -- npm start
