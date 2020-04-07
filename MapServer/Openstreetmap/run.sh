#!/bin/bash

set -x
#initaialize variables

#define the number of threads
THREADS=4

#enable CORS => CORS=1, disable CORS=> CORS=0
ALLOW_CORS=1

#enable or disable autovacuum feature in postgresql
#enable autovacuum=> AUTOVACUUM=on, disable autovacuum => 
#AUTOVACUUM=off

AUTOVACUUM=off

#to enable cache assign the value
OSM2PGSQL_EXTRA_ARGS="-C 4096"

#create a docker volume for the databse
sudo docker volume create openstreetmap-data

function createPostgresConfig() {
  cp /etc/postgresql/12/main/postgresql.custom.conf.tmpl /etc/postgresql/12/main/postgresql.custom.conf
  sudo -u postgres echo "autovacuum = $AUTOVACUUM" >> /etc/postgresql/12/main/postgresql.custom.conf
  #cat /etc/postgresql/12/main/postgresql.custom.conf
}

function setPostgresPassword() {
    sudo -u postgres psql -c "ALTER USER renderer PASSWORD '${PGPASSWORD:-renderer}'"
}

# identify the data file
    osm_data_file=$(find /home/renderer/src/Data/  -name "*.osm.pbf" -printf "%f\n")

# Initialize PostgreSQL
    createPostgresConfig
    service postgresql start
    sudo -u postgres createuser renderer
    sudo -u postgres createdb -E UTF8 -O renderer gis
    sudo -u postgres psql -d gis -c "CREATE EXTENSION postgis;"
    sudo -u postgres psql -d gis -c "CREATE EXTENSION hstore;"
    sudo -u postgres psql -d gis -c "ALTER TABLE geometry_columns    OWNER TO renderer;"
    sudo -u postgres psql -d gis -c "ALTER TABLE spatial_ref_sys OWNER TO renderer;"
    setPostgresPassword

# Import data
     sudo -u renderer osm2pgsql -d gis --create --slim -G --hstore --tag-transform-script /home/renderer/src/openstreetmap-carto/openstreetmap-carto.lua ${OSM2PGSQL_EXTRA_ARGS} -S /home/renderer/src/openstreetmap-carto/openstreetmap-carto.style /home/renderer/src/Data/$osm_data_file

# Create indexes
    sudo -u postgres psql -d gis -f indexes.sql

# Register that data has changed for mod_tile caching purposes
    touch /var/lib/mod_tile/planet-import-complete

service postgresql stop

# Clean /tmp
    rm -rf /tmp/*

# Fix postgres data privileges
    chown postgres:postgres /var/lib/postgresql -R

# Configure Apache CORS
    if [ "$ALLOW_CORS" == "1" ]; then
        echo "export APACHE_ARGUMENTS='-D ALLOW_CORS'" >> 
/etc/apache2/envvars
    fi

# Initialize PostgreSQL and Apache
    createPostgresConfig
    service postgresql start
    service apache2 restart
    setPostgresPassword

# Configure renderd threads
    sed -i -E "s/num_threads=[0-9]+/num_threads=${THREADS:-4}/g" 
/usr/local/etc/renderd.conf

# start cron job to trigger consecutive updates
    if [ "$UPDATES" = "enabled" ]; then
      /etc/init.d/cron start
    fi

# Run while handling docker stop's SIGTERM
    stop_handler() {
        kill -TERM "$child"
    }
    trap stop_handler SIGTERM

sudo -u renderer renderd -f -c /usr/local/etc/renderd.conf &
    child=$!
    wait "$child"

service postgresql stop
exit 0
