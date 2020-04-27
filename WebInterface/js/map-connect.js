window.leafletmap = L.map('map', {
    center: [51.483313, -3.1743],
    minZoom: 15,
    zoom: 17,
    zoomControl: false
});

L.tileLayer('http://localhost:8081/tile/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'map-cardiff',
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
}).addTo(window.leafletmap);

L.control.zoom({
    position:'bottomright'
}).addTo(window.leafletmap);