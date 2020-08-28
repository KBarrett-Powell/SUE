// * Find Details HTML Elements
// General
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

// Toggles marker page with information from selected map marker - sent from map
async function toggleDetailsFromMap(e){

    let info = await getProperties(this, false);

    if (this.options.open == false) {
        if (window.prvClickedMarker != null) { window.prvClickedMarker.options.open = false; }
        this.options.open = true;
 
        showPanel("marker");
        await showDetails(info, e.latlng.toString().slice(7, -1));
        window.prvClickedMarker = this;

    } else if (e != null) {
        this.options.open = false;

        clearDetailsMedia();
        showPanel("chat");
        window.prvClickedMarker = null;
    }
};

// Toggles marker page with information from selected map marker - sent from function
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

// Fills marker page with information from selected map marker
async function showDetails(json, coordinates){
    const videoLink = "http://localhost:8000/video/";
    const audioLink = "http://localhost:8000/audio/";

    let type = (json.eventID != null) ? "Event" : ((json.sensorID != null) ? "Sensor" : "Complex");

    let chartData = json.chartPoints;
    let objDetFile = ((json.objDetVideo != null) ? videoLink + json.objDetVideo : null);
    let slctRevFile = ((json.slctRevVideo != null) ? videoLink + json.slctRevVideo : null);
    let analysisAudioFile = ((json.detAudio != null) ? audioLink + json.detAudio : null);
    let analysisImgFile = ((json.detImage != null) ? videoLink + json.detImage : null);

    let sensorVideoFile = null;
    let sensorAudiofile = null; 

    if (type == "Event") {

        let sensor = await getProperties(await findSensor(json.sensorID), false);

        if (sensor != null) {
            sensorVideoFile = ((sensor.video != null) ? videoLink + sensor.video : null);
            sensorAudiofile = ((sensor.audio != null) ? audioLink + sensor.audio : null);
        }

    } else if (type == "Sensor") {
        sensorVideoFile = ((json.video != null) ? videoLink + json.video : null);
        sensorAudiofile = ((json.audio != null) ? audioLink + json.audio : null);
    }

    let timelineInfo = json.eventDetails;
       
    clearDetailsMedia();

    addDetailsMedia(json, coordinates, type, chartData, analysisImgFile, objDetFile, slctRevFile, analysisAudioFile, sensorVideoFile, sensorAudiofile, timelineInfo);
};

// Clears all media sources
function clearDetailsMedia() {

    detailsID.innerHTML = "";
    detailsName.innerHTML = "";
    detailsText.innerHTML = "";

    if (analysisCarousel.style.display != "none") {

        analysisCarousel.style.display = "none";

        if (analysisChartDiv.classList.contains("carousel-item")) {
            removeCarouselItem(analysisChartDiv);
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

// Fills in all media sources with information from a map marker
async function addDetailsMedia(json, coordinates, type, chartData, analysisImgFile, objDetFile, slctRevFile, analysisAudioFile, sensorVideoFile, sensorAudioFile, timelineInfo) {

    if (type === "Sensor" || type === "Event") {
        if (type === "Sensor") {

            detailsID.innerHTML = json.sensorID;
            detailsName.innerHTML = json.sensorName;
            detailsText.innerHTML = "Lat/Long: " + coordinates;

            if (sensorAudioFile != null) {
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

            if (sensorAudioFile != null) {
                audioDesc.innerHTML = "Audio From Microphone :";
                if (audioPlayer.classList.contains("sensorAudio")) { audioPlayer.classList.remove("sensorAudio"); }

            } else {
                videoDesc.innerHTML = "Footage From CCTV :";
                if (videoPlayer.classList.contains("sensorVideo")) { videoPlayer.classList.remove("sensorVideo"); }
            }

            analysisCarousel.style.display = "block";
            let activeSet = false;
            let totalCarousel = 0;

            if (chartData != null) {
                createChart(chartData);
                totalCarousel ++;

                activeSet = await setCarouselItem(analysisChartDiv, activeSet);

            } else {
                removeCarouselItem(analysisChartDiv);
            }

            if (analysisImgFile != null) {
                analysisImage.setAttribute('src', analysisImgFile);
                totalCarousel ++;

                activeSet = await setCarouselItem(analysisImageDiv, activeSet);

            } else {
                removeCarouselItem(analysisImageDiv);
            }

            if (objDetFile != null) {
                objDetVideoSrc.setAttribute('src', objDetFile);
                objDetVideo.load();
                totalCarousel ++;

                activeSet = await setCarouselItem(objDetVideoDiv, activeSet);
                
            } else {
                removeCarouselItem(objDetVideoDiv);
            }

            if (slctRevFile != null) {
                analysisVideoSrc.setAttribute('src', slctRevFile);
                analysisVideo.load();
                totalCarousel ++;

                activeSet = await setCarouselItem(analysisVideoDiv, activeSet);

            } else {
                removeCarouselItem(analysisVideoDiv);
            }

            if (analysisAudioFile != null) {
                analysisAudioSrc.setAttribute('src', analysisAudioFile);
                analysisAudio.load();
                totalCarousel ++;

                activeSet = await setCarouselItem(analysisAudioDiv, activeSet);

            } else {
                removeCarouselItem(analysisAudioDiv);
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

        if (sensorAudioFile != null) {
            sensorVideo.style.display = "none";
            sensorAudio.style.display = "block";
            audioSource.setAttribute('src', sensorAudioFile);
            audioPlayer.load();

        } else {
            sensorAudio.style.display = "none";
            sensorVideo.style.display = "block";
            videoSource.setAttribute('src', sensorVideoFile);
            videoPlayer.load();
        }

    } else {

        detailsID.innerHTML = json.complexID;
        detailsName.innerHTML = json.complexName;

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

// Add hidden class to element
function hideElement(element) {
    if ( !element.classList.contains("hidden") ) {
        element.classList.add("hidden")
    }
};

// Remove active class form element
function removeActive(element) {
    if ( element.classList.contains("active") ) {
        element.classList.remove("active")
    }
};

// Add element to the media carousel
function setCarouselItem(element, activeSet) {
    if ( !element.classList.contains("carousel-item") ) { 
        element.classList.add("carousel-item"); 
        element.classList.remove("hidden"); 
    }
                
    if ( activeSet == false ) { element.classList.add("active"); }
    
    return true;
};

// Remove element from the media carousel
function removeCarouselItem(element) {
    if ( element.classList.contains("carousel-item") ) { 
        element.classList.remove("carousel-item"); 
        element.classList.add("hidden"); 
    }

    if ( element.classList.contains("active") ) { 
        element.classList.remove("active"); 
    }
};

// Show details of an event map marker with specified id
async function openEventDetails(id) {
    let ids = [parseInt(id)];
    let events = await findEvents(ids);
    toggleDetailsFromFunction(events[0]);
};

// Show details of a complex event map marker with specified id
async function openComplexEventDetails(id) {
    let complex = await findComplex(parseInt(id));
    toggleDetailsFromFunction(complex);
};