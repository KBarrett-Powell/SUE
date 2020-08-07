const videoLink = "http://localhost:8000/video/";
const audioLink = "http://localhost:8000/audio/";

const details = document.getElementById("detailspanel");
const mainBar = document.getElementById("side-main");

const detailsID = document.getElementById("detailsID");
const detailsName = document.getElementById("detailsName");
const detailsText = document.getElementById("detailsText");

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

async function toggleDetailsFromMap(e){

    let info = await getProperties(this, false);

    if (this.options.open == false) {
        this.options.open = true;
        if (window.prvClickedMarker != null) { window.prvClickedMarker.options.open = false; }

        showDetailsPanel();
        await toggleDetails(info, e.latlng.toString().slice(7, -1));
        window.prvClickedMarker = this;

    } else {
        this.options.open = false;

        await toggleDetails(info, e.latlng.toString().slice(7, -1));
        showSUEPanel();
        window.prvClickedMarker = null;
    }
};

function showSUEPanel() {
    const panel = document.getElementById("searchpanel");
    const toggle = document.getElementById("toggleSearch");

    if (panel.classList.contains("hidden")) {
        if ( !document.getElementById("detailspanel").classList.contains("hidden") ) {
            document.getElementById("detailspanel").classList.add("hidden")
        }
        if ( !document.getElementById("analysispanel").classList.contains("hidden") ) {
            document.getElementById("analysispanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleMarker").classList.contains("active") ) {
            document.getElementById("toggleMarker").classList.remove("active")
        }
        if ( document.getElementById("toggleAnalysis").classList.contains("active") ) {
            document.getElementById("toggleAnalysis").classList.remove("active")
        }

        panel.classList.remove("hidden");
        toggle.classList.add("active");
    }
};

function showAnalysisPanel() {
    const panel = document.getElementById("analysispanel");
    const toggle = document.getElementById("toggleAnalysis");

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
};

function showDetailsPanel() {
    const panel = document.getElementById("detailspanel");
    const toggle = document.getElementById("toggleMarker");

    if (panel.classList.contains("hidden")) {
        if ( !document.getElementById("analysispanel").classList.contains("hidden") ) {
            document.getElementById("analysispanel").classList.add("hidden")
        }
        if ( !document.getElementById("searchpanel").classList.contains("hidden") ) {
            document.getElementById("searchpanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleAnalysis").classList.contains("active") ) {
            document.getElementById("toggleAnalysis").classList.remove("active")
        }
        if ( document.getElementById("toggleSearch").classList.contains("active") ) {
            document.getElementById("toggleSearch").classList.remove("active")
        }

        panel.classList.remove("hidden");
        toggle.classList.add("active");
    }
};

async function toggleDetails(json, coordinates){

    let type = (json.eventID != null) ? "Event" : ((json.sensorID != null) ? "Sensor" : "Complex");
    let id = (type == "Event") ? json.eventID : ((type == "Sensor") ? json.sensorID : json.complexID);

    let chartdata = json.chartPoints;
    let objdetfile = ((json.objDetVideo != null) ? videoLink + json.objDetVideo : null);
    let slctRevVideo = ((json.slctRevVideo != null) ? videoLink + json.slctRevVideo : null);

    let videofile = null;
    let audiofile = null; 

    if (type == "Event") {

        let sensor = await getProperties(await findSensor(json.sensorID), false);

        if (sensor != null) {
            videofile = ((sensor.video != null) ? videoLink + sensor.video : null);
            audiofile = ((sensor.audio != null) ? audioLink + sensor.audio : null);
        }

    } else if (type == "Sensor") {
        videofile = ((json.video != null) ? videoLink + json.video : null);
        audiofile = ((json.audio != null) ? audioLink + json.audio : null);
    }

    let timelineInfo = json.eventDetails;

    if (detailsID.innerHTML != id && details.classList.contains('hidden') === false) {
       
        clearDetailsMedia()

        AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, videofile, audiofile, timelineInfo)

    } else if (details.classList.contains('hidden') === false) {

        details.classList.add('hidden');

        clearDetailsMedia()

    } else {

        details.classList.remove('hidden');

        clearDetailsMedia()

        AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, videofile, audiofile, timelineInfo)
    }
};

function clearDetailsMedia() {
    detailsID.innerHTML = "";
    detailsName.innerHTML = "";
    detailsText.innerHTML = "";

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
        while (timeline.firstChild) {
            timeline.removeChild(timeline.lastChild);
        }

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
};

function AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, videofile, audiofile, timelineInfo) {

    if (type === "Sensor" || type === "Event") {
        if (type === "Sensor") {

            detailsID.innerHTML = json.sensorID;
            detailsName.innerHTML = json.sensorName;
            detailsText.innerHTML = "Lat/Long: " + coordinates;

            if (audiofile != null) {
                audioDesc.innerHTML = "Captured Audio :";
                if (!audioPlayer.classList.contains("sensorAudio")) { audioPlayer.classList.add("sensorAudio"); }

            } else {
                videoDesc.innerHTML = "Captured Footage :";
                if (!videoPlayer.classList.contains("sensorVideo")) { videoPlayer.classList.add("sensorVideo"); }
            }
        
        } else { 

            detailsID.innerHTML = json.eventID;
            detailsName.innerHTML = json.eventName;
            detailsText.innerHTML = "Description: " + json.description + "<br>Datetime: " + json.datetime + "<br>Lat/Long: " + coordinates;

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

            } else if (slctRevVideo != null) {
                analysisVideo.style.display = "block";
                analysisSource.setAttribute('src', slctRevVideo);
                analysisPlayer.load();
            }
        }

        if (audiofile != null) {
            mainVideo.style.display = "none";
            mainAudio.style.display = "block";
            audioSource.setAttribute('src', audiofile);
            audioPlayer.load();

        } else {
            mainAudio.style.display = "none";
            mainVideo.style.display = "block";
            videoSource.setAttribute('src', videofile);
            videoPlayer.load();
        }

    } else {

        detailsID.innerHTML = json.complexID;
        detailsName.innerHTML = json.complexName;

        mainBar.style.overflow = "auto";

        let i = 0;
        for (let item in timelineInfo) {

            let div0 = document.createElement("div");
            div0.classList.add("tcontainer");
            div0.classList.add((timelineInfo[item].priority == 4) ? "blue" : ((timelineInfo[item].priority == 3) ? "yellow" : ((timelineInfo[item].priority == 2) ? "orange" : "red")));
            div0.classList.add((i%2 == 0) ? "left" : "right");

            let div1 = document.createElement("div");
            div1.classList.add("content");

            let h2 = document.createElement("h2");
            let time = document.createTextNode(timelineInfo[item].datetime);
            h2.appendChild(time);

            let p0 = document.createElement("p");
            let name = document.createTextNode(timelineInfo[item].name);
            p0.appendChild(name);

            let p1 = document.createElement("p");
            let desc = document.createTextNode(timelineInfo[item].description);
            p1.appendChild(desc);

            let p2 = document.createElement("p");
            let coords = document.createTextNode(timelineInfo[item].coordinates);
            p2.appendChild(coords);

            div1.appendChild(h2);
            div1.appendChild(p0);
            div1.appendChild(p1);
            div1.appendChild(p2);

            div0.appendChild(div1);

            timeline.appendChild(div0);

            i++;
        }

        timeline.style.display = "block";

        mainVideo.style.display = "none";
        mainAudio.style.display = "none";
    }
};