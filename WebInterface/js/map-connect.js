window.leafletmap = L.map('map', {
    center: [58.1473697, 7.9930261],
    minZoom: 15,
    zoom: 17,
    zoomControl: false
});

L.tileLayer('http://localhost:8081/tile/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'map-kristiansand',
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
}).addTo(window.leafletmap);

L.control.zoom({
    position:'bottomright'
}).addTo(window.leafletmap);

// Finds and returns any layers within a layer group with an id that matches the specified value
L.LayerGroup.include({
    getLayersByID: function (id) {
        let layers = [];
        for (var i in this._layers) {
            if (this._layers[i].options.id == id) {
                layers.push(this._layers[i]);
            }
        }
        return layers;
    }
});

// Tracks clicks on map which aren't on a map marker, closes marker panel on one of these clicks
window.leafletmap.on('click', function(e) {        
    if ( window.prvClickedMarker != null ) { toggleDetailsFromFunction(window.prvClickedMarker); }
});