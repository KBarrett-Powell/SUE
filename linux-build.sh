#!/bin/bash
# Installing basic requirements
sudo apt update &&
sudo apt install -y python3-dev python3-pip python3-venv &&
sudo apt install -y nodejs npm &&
sudo npm install -g n &&
sudo n stable &&
PATH="$PATH" &&
sudo apt install -y docker.io &&

# Installing node modules for Web server
npm install &&

# Adding required packages for chatroom
cd chatroom && sudo npm install -g yarn && yarn install &&

# Installing virtualenv requirements for Rasa
cd ../Rasa &&
python3 -m venv --system-site-packages ./venv &&
source ./venv/bin/activate &&
pip3 install -U pip &&
pip3 install rasa &&
rasa train &&
deactivate &&

# Creating and running OSM Server on port 8081
cd ../MapServer && 
sudo docker kill osm_container || true &&
sudo docker rm osm_container || true &&
sudo docker volume create openstreetmap-data &&
sudo docker run -v $(readlink -f Openstreetmap/Data/kristiansand-latest.osm.pbf):/data.osm.pbf -v openstreetmap-data:/var/lib/postgresql/12/main overv/openstreetmap-tile-server import &&
sudo docker run -d --name osm_container -p 8081:80 -v openstreetmap-data:/var/lib/postgresql/12/main -v openstreetmap-rendered-tiles:/var/lib/mod_tile -e ALLOW_CORS=1 -d overv/openstreetmap-tile-server run &&

# Complete
echo 'Build Complete'
