const details = document.getElementById("detailspanel");
const mainBar = document.getElementById("side-main");

const id = document.getElementById("detailsID");
const name = document.getElementById("detailsName");
const block = document.getElementById("detailsText");

const timeline = document.getElementById("eventTimeline");

const analysisCarousel = document.getElementById("analysisCarousel");

const analysisChart = document.getElementById("analysisChart");
const chartTitle = document.getElementById("chartTitle");

const objDetSource = document.getElementById("objDetSource");
const objDetPlayer = document.getElementById("objDetPlayer");

const analysisVideo = document.getElementById("analysisVideo");
const analysisSource = document.getElementById("videoASource");
const analysisPlayer = document.getElementById("videoAPlayer");

const mainVideo = document.getElementById("mainVideo");
const videoDesc = document.getElementById("videoDesc");
const videoSource = document.getElementById("videoSource");
const videoPlayer = document.getElementById("videoPlayer");

const mainAudio = document.getElementById("mainAudio");
const audioDesc = document.getElementById("audioDesc");
const audioSource = document.getElementById("audioSource");
const audioPlayer = document.getElementById("audioPlayer");

const videoLink = "http://localhost:8000/video/";
const audioLink = "http://localhost:8000/audio/";

function toggleDetailsFromMap(e){

    let info = JSON.parse(this.options.properties);
    let mapMarker = e.target;

    // if (window.prvClickedMarker != null && window.prvClickedMarker != mapMarker) {
    //     console.log("refresh prev marker");
    //     window.prvClickedMarker.setIcon(toggleMarkerIcon(window.prvClickedMarker));
    // }

    // console.log("refresh marker");
    // mapMarker.setIcon(toggleMarkerIcon(mapMarker));

    if (mapMarker.isPopupOpen() === true) {
        toggleDetails(info, e.latlng.toString().slice(7, -1));
        showListPanel();
        window.prvClickedMarker = null;

    } else {
        showDetailsPanel();
        toggleDetails(info, e.latlng.toString().slice(7, -1));
        window.prvClickedMarker = mapMarker;
    }
}

function toggleMarkerIcon(marker) {
    if (marker.options.properties.search("Complex") != -1) {
        return (marker.options.icon == complexIcon ? complexSelectIcon : complexIcon);

    } else if (marker.options.properties.search("Event") != -1) {
        if (marker.options.properties.search("\"color\":\"yellow\"")!= -1) {
            return (marker.options.icon == yellowIcon ? yellowSelectIcon : yellowIcon);

        } else if (marker.options.properties.search("\"color\":\"orange\"")!= -1) {
            return (marker.options.icon == orangeIcon ? orangeSelectIcon : orangeIcon);

        } else if (marker.options.properties.search("\"color\":\"red\"")!= -1) {
            return (marker.options.icon == redIcon ? redSelectIcon : redIcon);

        } else {
            return (marker.options.icon == blueIcon ? blueSelectIcon : blueIcon);
        }
        
    } else {
        if (marker.options.properties.search("\"sensorType\":\"Camera\"")!= -1) {
            return (marker.options.icon == cameraIcon ? cameraSelectIcon : cameraIcon);

        } else if (marker.options.properties.search("\"sensorType\":\"Human\"")!= -1) {
            return (marker.options.icon == humanIcon ? humanSelectIcon : humanIcon);

        } else {
            return (marker.options.icon == microphoneIcon ? microphoneSelectIcon : microphoneIcon);
        }
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

    let idtext = "" + json.id + "";
    let nametext = "" + json.name + "";
    let type = "" + json.type;
    let blocktext = compileBlockText(json, coordinates);
    let chartdata = json.chartPoints;
    let file = ((json.video != null) ? videoLink + json.video : null);
    let saliencyfile = ((json.saliencyVideo != null) ? videoLink + json.saliencyVideo : null);
    let objdetfile = ((json.objDetVideo != null) ? videoLink + json.objDetVideo : null);
    let audiofile = ((json.audio != null) ? audioLink + json.audio : null);
    let timelineBlock = json.block;

    if (id.innerHTML != idtext && details.classList.contains('hidden') === false) {
       
        clearDetailsMedia()

        AddDetailsMedia(idtext, nametext, blocktext, type, audiofile, objdetfile, chartdata, saliencyfile, file, timelineBlock)

    } else if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        clearDetailsMedia()

    } else {

        details.classList.remove('hidden');

        clearDetailsMedia()

        AddDetailsMedia(idtext, nametext, blocktext, type, audiofile, objdetfile, chartdata, saliencyfile, file, timelineBlock)
    }
}

function clearDetailsMedia() {
    id.innerHTML = "";
    name.innerHTML = "";
    block.innerHTML = "";

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
    if (mainVideo.style.display != "none") {
        mainVideo.style.display = "none";
        videoSource.setAttribute('src', '');
        videoPlayer.load();
        if (videoPlayer.classList.contains("sensorVideo")) { videoPlayer.classList.remove("sensorVideo"); }
    }
    if (mainAudio.style.display != "none") {
        mainAudio.style.display = "none";
        audioSource.setAttribute('src', '');
        audioPlayer.load();
        if (audioPlayer.classList.contains("sensorAudio")) { videoPlayer.classList.remove("sensorAudio"); }
    }
}

function AddDetailsMedia(idtext, nametext, blocktext, type, audiofile, objdetfile, chartdata, saliencyfile, file, timelineBlock) {
    id.innerHTML = idtext;
    name.innerHTML = nametext;
    block.innerHTML = blocktext;

    if (type === "Sensor") {

        if (audiofile != null) {
            audioDesc.innerHTML = "Captured Audio :";
            if (!audioPlayer.classList.contains("sensorAudio")) { audioPlayer.classList.add("sensorAudio"); }

        } else {
            videoDesc.innerHTML = "Captured Footage :";
            if (!videoPlayer.classList.contains("sensorVideo")) { videoPlayer.classList.add("sensorVideo"); }
        }
    
    } else { 

        if (audiofile != null) {
            audioDesc.innerHTML = "Audio From Microphone :";
            if (audioPlayer.classList.contains("sensorAudio")) { audioPlayer.classList.remove("sensorAudio"); }

        } else {
            videoDesc.innerHTML = "Footage From CCTV :";
            if (videoPlayer.classList.contains("sensorVideo")) { videoPlayer.classList.remove("sensorVideo"); }
        }

        if (chartdata != null && objdetfile != null) {
            analysisCarousel.style.display = "block";
            createChart(chartdata, true);

            objDetSource.setAttribute('src', objdetfile);
            objDetPlayer.load();

        } else if (chartdata != null) {
            analysisChart.style.display = "block";
            createChart(chartdata, false);

        } else if (objdetfile != null) {
            analysisVideo.style.display = "block";
            analysisSource.setAttribute('src', objdetfile);
            analysisPlayer.load();

        } else if (saliencyfile != null) {
            analysisVideo.style.display = "block";
            analysisSource.setAttribute('src', saliencyfile);
            analysisPlayer.load();
        }
    }

    if (type != "Complex") {

        if (audiofile != null) {
            mainVideo.style.display = "none";
            mainAudio.style.display = "block";
            audioSource.setAttribute('src', audiofile);
            audioPlayer.load();

        } else {
            mainAudio.style.display = "none";
            mainVideo.style.display = "block";
            videoSource.setAttribute('src', file);
            videoPlayer.load();
        }

    } else {
        mainBar.style.overflow = "auto";
        timeline.innerHTML = timelineBlock;
        timeline.style.display = "block";
        mainVideo.style.display = "none";
        mainAudio.style.display = "none";
    }
}

function compileBlockText(text, coordinates) {
    let string = "";
    let type = text.type;

    if (type === "Event") { string += "Description: " + text.description; }
    if (type === "Event") { string += "<br>Datetime: " + text.datetime; }

    if (type === "Sensor") { string += "Lat/Long: " + coordinates; }
    else if (type === "Event") { string += "<br>Lat/Long: " + coordinates; }

    return string;
}