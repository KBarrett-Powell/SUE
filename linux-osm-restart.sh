# Running the osm server on port 8081
cd MapServer &&
sudo docker kill osm_container || true && 
sudo docker rm osm_container || true && 
sudo docker run -d --name osm_container -p 8081:80 -v openstreetmap-data:/var/lib/postgresql/12/main -v openstreetmap-rendered-tiles:/var/lib/mod_tile -e ALLOW_CORS=1 -d overv/openstreetmap-tile-server run
