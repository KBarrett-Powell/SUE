function toggleDetailsFromPage($this){
    var info = JSON.parse($this.id);

    var marker = null; //get marker by id

    if (info.properties.type == "Sensor") {
        marker.setIcon(layer.options.icon == cameraIcon ? cameraIconYellow : cameraIcon);
    } else if (info.properties.type == "Complex") {
        marker.setIcon(layer.options.icon == markerRed ? markerYellow : markerRed);
    } else {
        marker.setIcon(layer.options.icon == markerNormal ? markerYellow : markerNormal);
    }

    toggleDetails(info.properties, info.geometry.coordinates);
};


function toggleDetailsFromMap(e){
    var info = JSON.parse(this.options.properties);
    console.log(this.options);
    var layer = e.target;

    if (window.prvClickedMarker != null && window.prvClickedMarker != layer) {
        if (window.prvClickedMarker.options.properties.search("Sensor") != -1) {
            window.prvClickedMarker.setIcon(cameraIcon);
        } else if (window.prvClickedMarker.options.properties.search("Complex") != -1) {
            window.prvClickedMarker.setIcon(markerRed);
        } else {
            window.prvClickedMarker.setIcon(markerNormal);
        }
    }

    if (layer.options.properties.search("Sensor") != -1) {
        layer.setIcon(layer.options.icon == cameraIcon ? cameraIconLarge : cameraIcon);
    } else if (layer.options.properties.search("Complex") != -1) {
        layer.setIcon(layer.options.icon == markerRed ? markerRedLarge : markerRed);
    } else {
        layer.setIcon(layer.options.icon == markerNormal ? markerLarge : markerNormal);
    }
    
    window.prvClickedMarker = layer;

    toggleDetails(info, e.latlng.toString().slice(7, -1));
};

function toggleDetails(json, coordinates){
    var details = document.getElementById("detailsdiv");
    var id = document.getElementById("detailsID");
    var name = document.getElementById("detailsName");
    var block = document.getElementById("detailsText");

    var videodiv = document.getElementById("videodiv");
    var videodesc = document.getElementById("videoDesc");
    var video = document.getElementById("videoPlayer");
    var vsource = document.getElementById("videoSource");

    var idtext = "" + json.id + "";
    var nametext = "" + json.name + "";
    var type = "" + json.type;
    var blocktext = compileBlockText(json, coordinates);
    var file = "http://localhost:8000/video/" + json.video;

    if (id.innerHTML != idtext && details.classList.contains('hidden') === false) {

        id.innerHTML = idtext;
        name.innerHTML = nametext;
        block.innerHTML = blocktext;
        if (type === "Sensor") {
            videodesc.innerHTML = "Captured Footage :";
        } else {
            videodesc.innerHTML = "Footage Analysis :";
        }
        videodiv.classList.remove('hidden');
        vsource.setAttribute('src', file);
        video.load(); 

    } else if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        id.innerHTML = "";
        name.innerHTML = "";
        block.innerHTML = "";
        videodesc.innerHTML = "";
        videodiv.classList.add('hidden');
        vsource.setAttribute('src', '');
        video.load();

    } else {

        details.classList.remove('hidden');

        id.innerHTML = idtext;
        name.innerHTML = nametext;
        block.innerHTML = blocktext;
        if (type === "Sensor") {
            videodesc.innerHTML = "Captured Footage :";
        } else {
            videodesc.innerHTML = "Footage Analysis :";
        }
        videodiv.classList.remove('hidden');
        vsource.setAttribute('src', file);
        video.load();

    }
};

function compileBlockText(text, coordinates) {
    var string = "";

    string += text.name;
    string += "<br>Description: " + text.description;
    string += "<br>Lat/Long: " + coordinates;
    string += "<br>Datetime: " + text.datetime;

    return string;
};

function filterMarkers() {
    var details = document.getElementById("detailsdiv");
    var text = document.getElementById("detailsID");
};

function toggleList() {
    var list = document.getElementById("listdiv");
    var close = document.getElementById("closeList");
    var arrow = document.getElementById("closeArrow");

    if (arrow.classList.contains("fa-angle-left")) {
        arrow.classList.remove("fa-angle-left")
        arrow.classList.add("fa-angle-right")

        list.classList.add("hidden");

        close.style.left = "5px";
    } else {
        arrow.classList.remove("fa-angle-right")
        arrow.classList.add("fa-angle-left")

        list.classList.remove("hidden");

        close.style.left = "275px";
    }
}