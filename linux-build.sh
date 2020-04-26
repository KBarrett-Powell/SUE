#!/bin/sh
# Installing node modules for Web server
npm install &&

# Running OSM Server
cd MapServer && sudo docker run -p 8081:80 -v openstreetmap-data:/var/lib/postgresql/12/main -v openstreetmap-rendered-tiles:/var/lib/mod_tile -e ALLOW_CORS=1 -d overv/openstreetmap-tile-server run &&

# Adding required packages for chatroom
cd ../chatroom && sudo npm install -g yarn &&

# Installing python3 virtualenv requirements for Rasa
cd ../Rasa/venv &&
source ./bin/activate &&
pip3 install setuptools &&
pip3 install -r dependencies.txt &&

# Complete
echo 'Build Complete'
