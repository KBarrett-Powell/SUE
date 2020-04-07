#!/bin/sh
cd MapServer &&
sudo docker run -p 8081:80 -v openstreetmap-data:/var/lib/postgresql/12/main -v openstreetmap-rendered-tiles:/var/lib/mod_tile -e ALLOW_CORS=1 -d overv/openstreetmap-tile-server run &&
cd ../chatroom &&
sudo apt install cmdtest &&
cd ../ &&
npm run dev-build &&
cd Rasa/venv &&
source ./bin/activate &&
pip3 install setuptools &&
pip3 install -r dependencies.txt &&
echo 'Build Complete'
