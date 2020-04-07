function toggleDetailsFromMap(e){
    let info = JSON.parse(this.options.properties);
    let layer = e.target;

    if (window.prvClickedMarker != null && window.prvClickedMarker != layer) {
        if (window.prvClickedMarker.options.properties.search("Complex") != -1) {
            window.prvClickedMarker.setIcon(markerComplex);

        } else if (window.prvClickedMarker.options.properties.search("Event") != -1) {
            if (window.prvClickedMarker.options.properties.search("\"color\":\"yellow\"")!= -1) {
                window.prvClickedMarker.setIcon(markerYellow);
            } else if (window.prvClickedMarker.options.properties.search("\"color\":\"orange\"")!= -1) {
                window.prvClickedMarker.setIcon(markerOrange);
            } else if (window.prvClickedMarker.options.properties.search("\"color\":\"red\"")!= -1) {
                window.prvClickedMarker.setIcon(markerRed);
            } else {
                window.prvClickedMarker.setIcon(markerNormal);
            }
            
        } else {
            window.prvClickedMarker.setIcon(cameraIcon);
        }
    }

    if (layer.options.properties.search("Complex") != -1) {
        layer.setIcon(layer.options.icon == markerComplex ? markerComplexLarge : markerComplex);

    } else if (layer.options.properties.search("Event") != -1) {
        if (layer.options.properties.search("\"color\":\"yellow\"")!= -1) {
            layer.setIcon(layer.options.icon == markerYellow ? markerYellowLarge : markerYellow);
        } else if (layer.options.properties.search("\"color\":\"orange\"")!= -1) {
            layer.setIcon(layer.options.icon == markerOrange ? markerOrangeLarge : markerOrange);
        } else if (layer.options.properties.search("\"color\":\"red\"")!= -1) {
            layer.setIcon(layer.options.icon == markerRed ? markerRedLarge : markerRed);
        } else {
            layer.setIcon(layer.options.icon == markerNormal ? markerLarge : markerNormal);
        }

    } else {
        layer.setIcon(layer.options.icon == cameraIcon ? cameraIconLarge : cameraIcon);
    }
    
    window.prvClickedMarker = layer;
    
    if (layer.options.icon === cameraIcon || layer.options.icon === markerNormal || layer.options.icon === markerComplex || layer.options.icon === markerRed || layer.options.icon === markerYellow  || layer.options.icon === markerOrange) {
        toggleDetails(info, e.latlng.toString().slice(7, -1));
        showListPanel();
    } else {
        showDetailsPanel();
        toggleDetails(info, e.latlng.toString().slice(7, -1));
    }
}

function showListPanel() {
    const panel = document.getElementById("listpanel");
    const toggle = document.getElementById("toggleList");

    if (panel.classList.contains("hidden")) {
        if ( !document.getElementById("detailspanel").classList.contains("hidden") ) {
            document.getElementById("detailspanel").classList.add("hidden")
        }
        if ( !document.getElementById("searchpanel").classList.contains("hidden") ) {
            document.getElementById("searchpanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleMarker").classList.contains("active") ) {
            document.getElementById("toggleMarker").classList.remove("active")
        }
        if ( document.getElementById("toggleSearch").classList.contains("active") ) {
            document.getElementById("toggleSearch").classList.remove("active")
        }

        panel.classList.remove("hidden");
        toggle.classList.add("active");
    }
}

function showDetailsPanel() {
    const panel = document.getElementById("detailspanel");
    const toggle = document.getElementById("toggleMarker");

    if (panel.classList.contains("hidden")) {
        if ( !document.getElementById("listpanel").classList.contains("hidden") ) {
            document.getElementById("listpanel").classList.add("hidden")
        }
        if ( !document.getElementById("searchpanel").classList.contains("hidden") ) {
            document.getElementById("searchpanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleList").classList.contains("active") ) {
            document.getElementById("toggleList").classList.remove("active")
        }
        if ( document.getElementById("toggleSearch").classList.contains("active") ) {
            document.getElementById("toggleSearch").classList.remove("active")
        }

        panel.classList.remove("hidden");
        toggle.classList.add("active");
    }
}

function toggleDetails(json, coordinates){
    const details = document.getElementById("detailspanel");
    const mainBar = document.getElementById("side-main");

    const id = document.getElementById("detailsID");
    const name = document.getElementById("detailsName");
    const block = document.getElementById("detailsText");
    
    const timeline = document.getElementById("eventTimeline");

    const analysisCarousel = document.getElementById("analysisCarousel");

    const analysisChart = document.getElementById("analysisChart");

    const objDetSource = document.getElementById("objDetSource");
    const objDetPlayer = document.getElementById("objDetPlayer");

    const analysisVideo = document.getElementById("analysisVideo");
    const analysisSource = document.getElementById("videoASource");
    const analysisPlayer = document.getElementById("videoAPlayer");

    const mainVideo = document.getElementById("mainVideo");
    const videodesc = document.getElementById("videoDesc");
    const videoSource = document.getElementById("videoSource");
    const video = document.getElementById("videoPlayer");

    let idtext = "" + json.id + "";
    let nametext = "" + json.name + "";
    let type = "" + json.type;
    let blocktext = compileBlockText(json, coordinates);
    let chartdata = json.chartPoints;
    let file = "http://localhost:8000/video/" + json.video;
    let saliencyfile = "http://localhost:8000/video/" + json.saliencyVideo;
    let objdetfile = "http://localhost:8000/video/" + json.objDetVideo;

    if (id.innerHTML != idtext && details.classList.contains('hidden') === false) {

        id.innerHTML = idtext;
        name.innerHTML = nametext;
        block.innerHTML = blocktext;
       
        clearDetailsMedia(timeline, mainBar, analysisCarousel, analysisChart, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer)

        AddDetailsMedia(json, timeline, mainBar, type, videodesc, video, chartdata, file, objdetfile, saliencyfile, analysisCarousel, analysisChart, mainVideo, videoSource, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer)


    } else if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        id.innerHTML = "";
        name.innerHTML = "";
        block.innerHTML = "";
        videodesc.innerHTML = "";
        if (video.classList.contains("sensorVideo")) { video.classList.remove("sensorVideo"); }

        clearDetailsMedia(timeline, mainBar, analysisCarousel, analysisChart, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer)

        mainVideo.style.display = "none";
        videoSource.setAttribute('src', '');
        video.load();

    } else {

        details.classList.remove('hidden');

        id.innerHTML = idtext;
        name.innerHTML = nametext;
        block.innerHTML = blocktext;

        clearDetailsMedia(timeline, mainBar, analysisCarousel, analysisChart, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer)

        AddDetailsMedia(json, timeline, mainBar, type, videodesc, video, chartdata, file, objdetfile, saliencyfile, analysisCarousel, analysisChart, mainVideo, videoSource, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer)
    }
}

function clearDetailsMedia(timeline, mainBar, analysisCarousel, analysisChart, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer) {
    if (analysisCarousel.style.display != "none") {
        analysisCarousel.style.display = "none";
        clearChart(true);
            
        objDetSource.setAttribute('src', '');
        objDetPlayer.load();
    }
    if (analysisChart.style.display != "none") {
        analysisChart.style.display = "none";
        clearChart(false);
    }
    if (analysisVideo.style.display != "none") {
        analysisVideo.style.display = "none";
        analysisSource.setAttribute('src', '');
        analysisPlayer.load();
    }
    if (timeline.style.display != "none") {
        timeline.style.display = "none";
        mainBar.style.overflow = "hidden";
    }
}

function AddDetailsMedia(json, timeline, mainBar, type, videodesc, video, chartdata, file, objdetfile, saliencyfile, analysisCarousel, analysisChart, mainVideo, videoSource, objDetSource, objDetPlayer, analysisVideo, analysisSource, analysisPlayer) {
    if (type === "Sensor") {
        videodesc.innerHTML = "Captured Footage :";
        if (!video.classList.contains("sensorVideo")) { video.classList.add("sensorVideo"); }

    } else { 
        videodesc.innerHTML = "Footage From CCTV :";
        if (video.classList.contains("sensorVideo")) { video.classList.remove("sensorVideo"); }

        if (chartdata != null && json.objDetVideo != null) {
            analysisCarousel.style.display = "block";
            createChart(chartdata, true);

            objDetSource.setAttribute('src', objdetfile);
            objDetPlayer.load();

        } else if (chartdata != null) {
            analysisChart.style.display = "block";
            createChart(chartdata, false);

        } else if (json.objDetVideo != null) {
            analysisVideo.style.display = "block";
            analysisSource.setAttribute('src', objdetfile);
            analysisPlayer.load();

        } else if (json.saliencyVideo != null) {
            analysisVideo.style.display = "block";
            analysisSource.setAttribute('src', saliencyfile);
            analysisPlayer.load();
        }
    }

    if (type != "Complex") {
        mainVideo.style.display = "block";
        videoSource.setAttribute('src', file);
        video.load();
    } else {
        mainBar.style.overflow = "auto";
        timeline.innerHTML = json.block;
        timeline.style.display = "block";
        mainVideo.style.display = "none";
    }
}

function compileBlockText(text, coordinates) {
    let string = "";
    let type = text.type;

    if (type === "Event") { string += "Description: " + text.description; }
    if (type === "Event") { string += "<br>Datetime: " + text.datetime; }

    if (type === "Sensor" || type === "Complex") { string += "Lat/Long: " + coordinates; }
    else { string += "<br>Lat/Long: " + coordinates; }

    return string;
}
