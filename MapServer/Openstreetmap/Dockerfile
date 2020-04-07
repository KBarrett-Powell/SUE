FROM ubuntu:18.04

# Based on
# https://switch2osm.org/manually-building-a-tile-server-18-04-lts/

# Set up environment
ENV TZ=UTC
ENV AUTOVACUUM=off
ENV UPDATES=disabled
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install dependencies
COPY ./Openstreetmap/dependencies.sh /.
RUN ["chmod","+x","/dependencies.sh"]
RUN /dependencies.sh

# Set up PostGIS
RUN wget http://download.osgeo.org/postgis/source/postgis-3.0.0.tar.gz
RUN tar -xvzf postgis-3.0.0rc2.tar.gz
RUN cd postgis-3.0.0rc2 && ./configure && make && make install

# Set up renderer user
RUN adduser --disabled-password --gecos "" renderer
USER renderer

# Install latest osm2pgsql
RUN mkdir /home/renderer/src
WORKDIR /home/renderer/src
RUN git clone https://github.com/openstreetmap/osm2pgsql.git
WORKDIR /home/renderer/src/osm2pgsql
RUN mkdir build
WORKDIR /home/renderer/src/osm2pgsql/build
RUN cmake .. \
  && make -j $(nproc)
USER root
RUN make install
RUN mkdir /nodes \
    && chown renderer:renderer /nodes
USER renderer

# Install and test Mapnik
RUN python -c 'import mapnik'

# Install mod_tile and renderd
WORKDIR /home/renderer/src
RUN git clone -b switch2osm https://github.com/SomeoneElseOSM/mod_tile.git
WORKDIR /home/renderer/src/mod_tile
RUN ./autogen.sh \
  && ./configure \
  && make -j $(nproc)
USER root
RUN make -j $(nproc) install \
  && make -j $(nproc) install-mod_tile \
  && ldconfig
USER renderer

# Configure stylesheet
WORKDIR /home/renderer/src
RUN git clone https://github.com/gravitystorm/openstreetmap-carto.git \
 && git -C openstreetmap-carto checkout v4.23.0
WORKDIR /home/renderer/src/openstreetmap-carto
USER root
RUN npm install -g carto@0.18.2
USER renderer
RUN carto project.mml > mapnik.xml

# Load shapefiles
USER root
WORKDIR /home/renderer/src/openstreetmap-carto
RUN scripts/get-shapefiles.py

# Configure renderd
USER root
RUN sed -i 's/renderaccount/renderer/g' /usr/local/etc/renderd.conf \
  && sed -i 's/hot/tile/g' /usr/local/etc/renderd.conf
USER renderer

# Configure Apache
USER root
RUN mkdir /var/lib/mod_tile \
  && chown renderer /var/lib/mod_tile \
  && mkdir /var/run/renderd \
  && chown renderer /var/run/renderd
RUN echo "LoadModule tile_module /usr/lib/apache2/modules/mod_tile.so" >> /etc/apache2/conf-available/mod_tile.conf \
    && echo "LoadModule headers_module /usr/lib/apache2/modules/mod_headers.so" >> /etc/apache2/conf-available/mod_headers.conf \
  && a2enconf mod_tile && a2enconf mod_headers
COPY ./Openstreetmap/apache.conf /etc/apache2/sites-available/000-default.conf
COPY  ./Openstreetmap/leaflet-demo.html /var/www/html/index.html
COPY  ./Openstreetmap/leaflet.css  /var/www/html/leaflet.css
COPY  ./Openstreetmap/leaflet.js  /var/www/html/leaflet.js
RUN ln -sf /dev/stdout /var/log/apache2/access.log \
  && ln -sf /dev/stderr /var/log/apache2/error.log

# Configure PosgtreSQL
COPY ./Openstreetmap/postgresql.custom.conf.tmpl /etc/postgresql/12/main/
RUN chown -R postgres:postgres /var/lib/postgresql \
  && chown postgres:postgres /etc/postgresql/12/main/postgresql.custom.conf.tmpl \
  && echo "\ninclude 'postgresql.custom.conf'" >> /etc/postgresql/12/main/postgresql.conf
RUN echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/12/main/pg_hba.conf \
      && echo "host all all ::/0 md5" >> /etc/postgresql/12/main/pg_hba.conf

# Copy update scripts
COPY openstreetmap-tiles-update-expire /usr/bin/
RUN chmod +x /usr/bin/openstreetmap-tiles-update-expire \
 && mkdir /var/log/tiles \
 && chmod a+rw /var/log/tiles \
 && ln -s /home/renderer/src/mod_tile/osmosis-db_replag /usr/bin/osmosis-db_replag \
 && echo "*  *    * * *   renderer    openstreetmap-tiles-update-expire\n" >> /etc/crontab

# Install trim_osc.py helper script
USER renderer
RUN cd ~/src \
    && git clone https://github.com/zverik/regional \
    && cd regional \
    && git checkout 612fe3e040d8bb70d2ab3b133f3b2cfc6c940520 \
    && chmod u+x ~/src/regional/trim_osc.py

# Start running
USER root

#search for the data files in Data folder
CMD file_pbf=$(find Data/  -name "*.osm.pbf" -printf "%f\n")
CMD file_poly=$(find Data/  -name "*.poly" -printf "%f\n")

#move the data files to the container
RUN mkdir /home/renderer/src/Data
COPY  ./Openstreetmap/Data/$file_pbf   /home/renderer/src/Data/
COPY  ./Openstreetmap/Data/$file_poly  /var/lib/mod_tile/file_poly/

#run script to insert data to the database
COPY  ./Openstreetmap/run.sh /
COPY ./Openstreetmap/indexes.sql /
ENTRYPOINT ["/run.sh"]
CMD []

#expose ports
EXPOSE 80 5432
