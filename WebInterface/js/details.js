const videoLink = "http://localhost:8000/video/";
const audioLink = "http://localhost:8000/audio/";

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
        this.options.open = true;
        if (window.prvClickedMarker != null) { window.prvClickedMarker.options.open = false; }

        showPanel("marker");
        await toggleDetails(info, e.latlng.toString().slice(7, -1));
        window.prvClickedMarker = this;

    } else {
        this.options.open = false;

        await toggleDetails(info, e.latlng.toString().slice(7, -1));
        showPanel("chat");
        window.prvClickedMarker = null;
    }
};

function showPanel(selectedPanel) {
    let panel = (selectedPanel.toLowerCase() == "chat" ? chatPanel : (selectedPanel == "analysis" ? analysisPanel : markerPanel));
    let toggle = (selectedPanel.toLowerCase() == "chat" ? chatToggle : (selectedPanel == "analysis" ? analysisToggle : markerToggle));;

    if (panel.classList.contains("hidden")) {
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
    let detAudio = ((json.detAudio != null) ? audioLink + json.detAudio : null);
    let detImage = ((json.detImage != null) ? videoLink + json.detImage : null);

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

    if (detailsID.innerHTML != id && markerPanel.classList.contains('hidden') === false) {
       
        clearDetailsMedia()

        AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, detImage, detAudio, videofile, audiofile, timelineInfo)

    } else if (markerPanel.classList.contains('hidden') === false) {

        markerPanel.classList.add('hidden');

        clearDetailsMedia()

    } else {

        markerPanel.classList.remove('hidden');

        clearDetailsMedia()

        AddDetailsMedia(json, coordinates, type, chartdata, objdetfile, slctRevVideo, detImage, detAudio, videofile, audiofile, timelineInfo)
    }
};

function clearDetailsMedia() {
    detailsID.innerHTML = "";
    detailsName.innerHTML = "";
    detailsText.innerHTML = "";

    if (analysisCarousel.style.display != "none") {

        analysisCarousel.style.display = "none";

        if (analysisChart.style.display != "none") {
            analysisChart.style.display = "none";
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
                analysisImage.setAttribute('src', detImage);
                totalCarousel ++;

                if ( !analysisImageDiv.classList.contains("carousel-item") ) { analysisImageDiv.classList.add("carousel-item"); analysisImageDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(analysisImageDiv); }

            } else {
                if ( analysisImageDiv.classList.contains("carousel-item") ) { analysisImageDiv.classList.remove("carousel-item"); analysisImageDiv.classList.add("hidden"); }
                if ( analysisImageDiv.classList.contains("active") ) { analysisImageDiv.classList.remove("active"); }
            }

            if (objdetfile != null) {
                objDetVideoSrc.setAttribute('src', objdetfile);
                objDetVideo.load();
                totalCarousel ++;

                if ( !objDetVideoDiv.classList.contains("carousel-item") ) { objDetVideoDiv.classList.add("carousel-item"); objDetVideoDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(objDetVideoDiv); }
                
            } else {
                if ( objDetVideoDiv.classList.contains("carousel-item") ) { objDetVideoDiv.classList.remove("carousel-item"); objDetVideoDiv.classList.add("hidden"); }
                if ( objDetVideoDiv.classList.contains("active") ) { objDetVideoDiv.classList.remove("active"); }
            }

            if (slctRevVideo != null) {
                analysisVideoSrc.setAttribute('src', slctRevVideo);
                analysisVideo.load();
                totalCarousel ++;

                if ( !analysisVideoDiv.classList.contains("carousel-item") ) { analysisVideoDiv.classList.add("carousel-item"); analysisVideoDiv.classList.remove("hidden"); }
                if ( activeSet == false ) { activeSet = await setActive(analysisVideoDiv); }

            } else {
                if ( analysisVideoDiv.classList.contains("carousel-item") ) { analysisVideoDiv.classList.remove("carousel-item"); analysisVideoDiv.classList.add("hidden"); }
                if ( analysisVideoDiv.classList.contains("active") ) { analysisVideoDiv.classList.remove("active"); }
            }

            if (detAudio != null) {
                analysisAudioSrc.setAttribute('src', detAudio);
                analysisAudio.load();
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
            audioSource.setAttribute('src', audiofile);
            audioPlayer.load();

        } else {
            sensorAudio.style.display = "none";
            sensorVideo.style.display = "block";
            videoSource.setAttribute('src', videofile);
            videoPlayer.load();
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