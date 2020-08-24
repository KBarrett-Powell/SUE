// Find Panel HTML Elements
const chatPanel = document.getElementById("chatPanel");
const chatToggle = document.getElementById("chatToggle");

const analysisPanel = document.getElementById("analysisPanel");
const analysisToggle = document.getElementById("analysisToggle");

const markerPanel = document.getElementById("markerPanel");
const markerToggle = document.getElementById("markerToggle");

// * Find Details HTML Elements
// General
const markerDetails = document.getElementById("markerDetails");

const detailsID = document.getElementById("detailsID");
const detailsName = document.getElementById("detailsName");
const detailsText = document.getElementById("detailsText");

// Complex Event Specific
const timeline = document.getElementById("eventTimeline");

// Event Specific - Carousel
const analysisCarousel = document.getElementById("analysisCarousel");
const carouselItems = document.getElementById("carouselItems");

const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

const analysisChartDiv = document.getElementById("analysisChartDiv");
const analysisChart = document.getElementById("analysisChart");

const analysisImageDiv = document.getElementById("analysisImageDiv");
const analysisImage = document.getElementById("analysisImage");

const objDetVideoDiv = document.getElementById("objDetVideoDiv");
const objDetVideo = document.getElementById("objDetVideo");
const objDetVideoSrc = document.getElementById("objDetVideoSrc");

const analysisVideoDiv = document.getElementById("analysisVideoDiv");
const analysisVideo = document.getElementById("analysisVideo");
const analysisVideoSrc = document.getElementById("analysisVideoSrc");

const analysisAudioDiv = document.getElementById("analysisAudioDiv");
const analysisAudio = document.getElementById("analysisAudio");
const analysisAudioSrc = document.getElementById("analysisAudioSrc");

// Sensor Footage
const sensorVideo = document.getElementById("sensorVideo");
const videoDesc = document.getElementById("videoDesc");
const videoSource = document.getElementById("videoSource");
const videoPlayer = document.getElementById("videoPlayer");

const sensorAudio = document.getElementById("sensorAudio");
const audioDesc = document.getElementById("audioDesc");
const audioSource = document.getElementById("audioSource");
const audioPlayer = document.getElementById("audioPlayer");

async function toggleDetailsFromMap(e){

    let info = await getProperties(this, false);

    if (this.options.open == false) {
        if (window.prvClickedMarker != null) { window.prvClickedMarker.options.open = false; }
        this.options.open = true;
 
        showPanel("marker");
        await showDetails(info, e.latlng.toString().slice(7, -1));
        window.prvClickedMarker = this;

    } else {
        this.options.open = false;

        clearDetailsMedia();
        showPanel("chat");
        window.prvClickedMarker = null;
    }
};

async function toggleDetailsFromFunction(layer){

    let info = await getProperties(layer, false);

    if (layer.options.open == false) {
        if (window.prvClickedMarker != null) { window.prvClickedMarker.options.open = false; }
        layer.options.open = true;
        layer.openPopup();
 
        showPanel("marker");
        await showDetails(info, layer.getLatLng().toString().slice(7, -1));
        window.prvClickedMarker = layer;

    } else {
        layer.options.open = false;
        layer.closePopup();

        clearDetailsMedia();
        showPanel("chat");
        window.prvClickedMarker = null;
    }
};

async function showPopup(layer) {
    if ( layer != null ) { layer.openPopup(); }
    else { window.prvClickedMarker.openPopup(); }
};

function showPanel(selectedPanel) {
    let panel = (selectedPanel.toLowerCase() == "chat" ? chatPanel : (selectedPanel == "analysis" ? analysisPanel : markerPanel));
    let toggle = (selectedPanel.toLowerCase() == "chat" ? chatToggle : (selectedPanel == "analysis" ? analysisToggle : markerToggle));;

    if ( selectedPanel.toLowerCase() != "chat" ) {
        if ( !chatPanel.classList.contains("hidden") ) {
            chatPanel.classList.add("hidden")
        }
        if ( chatToggle.classList.contains("active") ) {
            chatToggle.classList.remove("active")
        }
    }

    if ( selectedPanel.toLowerCase() != "analysis" ) {
        if ( !analysisPanel.classList.contains("hidden") ) {
            analysisPanel.classList.add("hidden")
        }
        if ( analysisToggle.classList.contains("active") ) {
            analysisToggle.classList.remove("active")
        }
    }

    if ( selectedPanel.toLowerCase() != "marker" ) {
        if ( !markerPanel.classList.contains("hidden") ) {
            markerPanel.classList.add("hidden")
        }
        if ( markerToggle.classList.contains("active") ) {
            markerToggle.classList.remove("active")
        }
    }

    if ( panel.classList.contains("hidden") ) {
        panel.classList.remove("hidden")
    }
    if ( !toggle.classList.contains("active") ) {
        toggle.classList.add("active")
    }
};

async function showDetails(json, coordinates){

    let type = (json.eventID != null) ? "Event" : ((json.sensorID != null) ? "Sensor" : "Complex");

    let chartdata = json.chartPoints;
    let objdetfile = ((json.objDetVideo != null) ? json.objDetVideo : null);
    let slctRevVideo = ((json.slctRevVideo != null) ? json.slctRevVideo : null);
    let detAudio = ((json.detAudio != null) ? json.detAudio : null);
    let detImage = ((json.detImage != null) ? json.detImage : null);

    let videofile = null;
    let audiofile = null; 

    if (type == "Event") {

        let sensor = await getProperties(await findSensor(json.sensorID), false);

        if (sensor != null) {
            videofile = ((sensor.video != null) ? sensor.video : null);
            audiofile = ((sensor.audio != null) ? sensor.audio : null);
        }

    } else if (type == "Sensor") {

        videofile = ((json.video != null) ? json.video : null);
        audiofile = ((json.audio != null) ? json.audio : null);
    
    }

    let timelineInfo = json.eventDetails;
       
    clearDetailsMedia()

    AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, detImage, detAudio, videofile, audiofile, timelineInfo)
};

function clearDetailsMedia() {
    detailsID.innerHTML = "";
    detailsName.innerHTML = "";
    detailsText.innerHTML = "";

    if (analysisCarousel.style.display != "none") {

        analysisCarousel.style.display = "none";

        if (analysisChartDiv.classList.contains("carousel-item")) {
            clearChart();
        }

        analysisImage.setAttribute('src', '');
            
        objDetVideoSrc.setAttribute('src', '');
        objDetVideo.load();

        analysisVideoSrc.setAttribute('src', '');
        analysisVideo.load();

        analysisAudioSrc.setAttribute('src', '');
        analysisAudio.load();
    }

    if (timeline.style.display != "none") {
        while (timeline.firstChild) {
            timeline.removeChild(timeline.lastChild);
        }

        timeline.style.display = "none";
        markerDetails.style.overflow = "hidden";
    }

    if (sensorVideo.style.display != "none") {
        sensorVideo.style.display = "none";
        videoSource.setAttribute('src', '');
        videoPlayer.load();
        if (videoPlayer.classList.contains("sensorVideo")) { videoPlayer.classList.remove("sensorVideo"); }
    }
    if (sensorAudio.style.display != "none") {
        sensorAudio.style.display = "none";
        audioSource.setAttribute('src', '');
        audioPlayer.load();
        if (audioPlayer.classList.contains("sensorAudio")) { videoPlayer.classList.remove("sensorAudio"); }
    }
};

async function AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, detImage, detAudio, videofile, audiofile, timelineInfo) {

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

            analysisCarousel.style.display = "block";
            let activeSet = false;
            let totalCarousel = 0;

            if (chartdata != null) {
                createChart(chartdata);
                totalCarousel ++;

                if ( !analysisChartDiv.classList.contains("carousel-item") ) { analysisChartDiv.classList.add("carousel-item"); analysisChartDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(analysisChartDiv); }

            } else {
                if ( analysisChartDiv.classList.contains("carousel-item") ) { analysisChartDiv.classList.remove("carousel-item"); analysisChartDiv.classList.add("hidden"); }
                if ( analysisChartDiv.classList.contains("active") ) { analysisChartDiv.classList.remove("active"); }
            }

            if (detImage != null) {
                getFile(detImage, "analysisImage", null);
                totalCarousel ++;

                if ( !analysisImageDiv.classList.contains("carousel-item") ) { analysisImageDiv.classList.add("carousel-item"); analysisImageDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(analysisImageDiv); }

            } else {
                if ( analysisImageDiv.classList.contains("carousel-item") ) { analysisImageDiv.classList.remove("carousel-item"); analysisImageDiv.classList.add("hidden"); }
                if ( analysisImageDiv.classList.contains("active") ) { analysisImageDiv.classList.remove("active"); }
            }

            if (objdetfile != null) {
                getFile(objdetfile, "objDetVideoSrc", "objDetVideo");
                totalCarousel ++;

                if ( !objDetVideoDiv.classList.contains("carousel-item") ) { objDetVideoDiv.classList.add("carousel-item"); objDetVideoDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(objDetVideoDiv); }
                
            } else {
                if ( objDetVideoDiv.classList.contains("carousel-item") ) { objDetVideoDiv.classList.remove("carousel-item"); objDetVideoDiv.classList.add("hidden"); }
                if ( objDetVideoDiv.classList.contains("active") ) { objDetVideoDiv.classList.remove("active"); }
            }

            if (slctRevVideo != null) {
                getFile(slctRevVideo, "analysisVideoSrc", "analysisVideo");
                totalCarousel ++;

                if ( !analysisVideoDiv.classList.contains("carousel-item") ) { analysisVideoDiv.classList.add("carousel-item"); analysisVideoDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(analysisVideoDiv); }

            } else {
                if ( analysisVideoDiv.classList.contains("carousel-item") ) { analysisVideoDiv.classList.remove("carousel-item"); analysisVideoDiv.classList.add("hidden"); }
                if ( analysisVideoDiv.classList.contains("active") ) { analysisVideoDiv.classList.remove("active"); }
            }

            if (detAudio != null) {
                getFile(detAudio, "analysisAudioSrc", "analysisAudio");
                totalCarousel ++;

                if ( !analysisAudioDiv.classList.contains("carousel-item") ) { analysisAudioDiv.classList.add("carousel-item"); analysisAudioDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(analysisAudioDiv); }

            } else {
                if ( analysisAudioDiv.classList.contains("carousel-item") ) { analysisAudioDiv.classList.remove("carousel-item"); analysisAudioDiv.classList.add("hidden"); }
                if ( analysisAudioDiv.classList.contains("active") ) { analysisAudioDiv.classList.remove("active"); }
            }

            if (totalCarousel == 1) {
                if ( !carouselPrev.classList.contains("hidden") ) {
                    carouselPrev.classList.add("hidden");
                    carouselNext.classList.add("hidden")
                }
            } else {
                if ( carouselPrev.classList.contains("hidden") ) {
                    carouselPrev.classList.remove("hidden");
                    carouselNext.classList.remove("hidden")
                }
            }
        }

        if (audiofile != null) {
            sensorVideo.style.display = "none";
            sensorAudio.style.display = "block";
            getFile(audiofile, "audioSource", "audioPlayer");

        } else {
            sensorAudio.style.display = "none";
            sensorVideo.style.display = "block";
            getFile(videofile, "videoSource", "videoPlayer");
        }

    } else {

        detailsID.innerHTML = json.complexID;
        detailsName.innerHTML = json.complexName;

        markerDetails.style.overflow = "auto";

        let i = 0;
        for (let item in timelineInfo) {

            let div0 = document.createElement("div");
            div0.classList.add("tcontainer");
            div0.classList.add((timelineInfo[item].priority == 4) ? "blue" : ((timelineInfo[item].priority == 3) ? "yellow" : ((timelineInfo[item].priority == 2) ? "orange" : "red")));
            div0.classList.add((i%2 == 0) ? "left" : "right");
            div0.setAttribute("onmouseover", "showHoveredEvent(" + timelineInfo[item].id + ")");
            div0.setAttribute("onmouseout", "showHoveredEvent(null)");
            div0.setAttribute("onclick", "openEventDetails(" + timelineInfo[item].id + ")");

            let div1 = document.createElement("div");
            div1.classList.add("content");

            let h2 = document.createElement("h2");
            let wbr = document.createElement("wbr");
            let datetime = timelineInfo[item].datetime.split("T"); 
            let date = document.createTextNode(datetime[0] + "T");
            let time = document.createTextNode(datetime[1]);
            h2.appendChild(date);
            h2.appendChild(wbr);
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

        sensorVideo.style.display = "none";
        sensorAudio.style.display = "none";
    }
};

function setActive(element) {
    element.classList.add("active"); 

    return true;
};

function addToCarouselList(id, active) {
    let item = document.createElement("li");
    item.dataset.target = "#analysisCarousel";
    item.setAttribute('data-slide-to', id);

    if (active) { item.classList.add("active"); }

    carouselItems.appendChild(item);
};

async function fillInElement(parsedMessage) {

    let file = parsedMessage.files[0];

    let source = document.getElementById(window.elementToFill[file.name].source);
    let player = null;
    if ( window.elementToFill[file.name].player != null ) { player = document.getElementById(window.elementToFill[file.name].player); }

    source.setAttribute('src', "data:" + file.type + ";base64," + file.value);
    if ( player != null ) { player.load(); }

    delete window.elementToFill[file.name];
};