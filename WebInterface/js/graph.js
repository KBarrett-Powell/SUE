window.barIndex = null
window.timePoint = null;

// While the correct chart is visible, and has not been filled, update its values in time with the video/audio track from the sensor
function plotChartPoints(){
    if (analysisChartDiv.classList.contains("carousel-item")) {
        let duration = (sensorVideo.style.display != "none" ? videoPlayer.duration : audioPlayer.duration);
        let interval = (sensorAudio.style.display === "none" ? 270 : 1000);

        let id = document.getElementById("detailsID").textContent;

        let refreshInterval = setInterval( function() { 

            refreshChart();

            if (document.getElementById("detailsID").textContent != id) {
                clearInterval(refreshInterval);
                clearTimeout(refreshTimeout);
            }

        }, interval);
                
        let refreshTimeout = setTimeout( function() { 
            clearInterval(refreshInterval); 
        }, duration * 1000);
    }
};

// Find the next points on the line chart to be added, and push them to the canvas
function refreshChart() {
    window.analysisChart.config.data.datasets.forEach(function(dataset) {
        if (dataset.label === "videoOnly" && window.videoOnly.length > 0) {
            dataset.data.push({
                x: window.videoOnly[0].x,
                y: window.videoOnly[0].y
            });
            if (window.videoOnly[0].y > 0.0) {
                dataset.data[dataset.data.length - 1].fill =  true;
                dataset.data[dataset.data.length - 1].backgroundColor =  "blue";
            }
                
            window.videoOnly.shift();

        } else if (dataset.label === "videoAndObjDet" && window.videoAndObjDet.length > 0) {
            dataset.data.push({
                x: window.videoAndObjDet[0].x,
                y: window.videoAndObjDet[0].y
            });
                
            window.videoAndObjDet.shift();

        } else if (dataset.label === "audioOnly" && window.audioOnly.length > 0) {
            dataset.data.push({
                x: window.audioOnly[0].x,
                y: window.audioOnly[0].y
            });
                
            window.audioOnly.shift();
        }
    });

    window.analysisChart.update();
};

// Remove all data from the chart
function clearChart() {
    window.analysisChart.config.data.datasets.forEach(function(dataset) {
        if (dataset.label == "videoOnly") {
            window.videoOnly.unshift(dataset.data);
            window.videoOnly = [];
            dataset.data = [];

        } else if (dataset.label == "videoAndObjDet") {
            window.videoAndObjDet.unshift(dataset.data);
            window.videoAndObjDet = [];
            dataset.data = [];

        } else {
            window.audioOnly.unshift(dataset.data);
            window.audioOnly = [];
            dataset.data = [];
        }
    });

    window.analysisChart.update();
};

// Build the analysis chart on the marker panel, resetting canvas and rebuilding with specified data
async function createChart(chartData) {
    // operations on data
    // ' to "
    // {([0-9]+): ([0-9]+).([0-9]+e*-*[0-9]*)} to  [\1,\2.\3]
    // "videoAndObjDet": {"\(\)": \[([0-9]+),([0-9]+).([0-9]+e*-*[0-9]*)\]}  to x: \1, y: \2.\3 

    await resetCanvas("analysisChart");

    const ctx = document.getElementById("analysisChart").getContext('2d');

    let mydatasets = [];
    let max = 800;

    for (let i in chartData) {
        let key = Object.keys(chartData[i])[0];
        let val = Object.values(chartData[i])[0];
        let colour = "";

        if (key === "videoOnly") {
            window.videoOnly = val;
            colour = 'rgb(54, 162, 235)';
            max = Math.ceil((val[val.length-1].x)/100)*100;

        } else if (key === "videoAndObjDet") {
            window.videoAndObjDet = val;
            colour = 'rgb(255, 159, 64)';
            max = Math.ceil((val[val.length-1].x)/100)*100;

        } else if (key === "audioOnly") {
            window.audioOnly = val;
            colour = 'rgb(255, 159, 64)';
            max = 15;
        }

        let dataset = {
            label: key,
            backgroundColor: Chart.helpers.color(colour).alpha(0.5).rgbString(),
			borderColor: colour,
            fill: false,
            data: [],
            showLine: true
        };
        
        mydatasets.push(dataset)
    }

    let config = {
        type: 'scatter',
        data: {
            datasets: mydatasets
        },
        options: {
            elements: {
                point:{
                    radius: 0
                }
            },
            tooltips: {
                mode: 'index'
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        min: 0,
                        max: max
                    },
                    position: 'bottom',
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        min: 0.0,
                        max: 1.0,
                        stepSize: 0.2
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            responsive: true
        }
    };

    window.analysisChart = new Chart(ctx, config);
};

// Builds the priority chart on the analysis panel, resetting canvas, defining colours, and filling with information gathered from map layers
// Priority chart shows the number of events of each priority currently on the map
async function buildPriorityChart() {
    await resetCanvas("priorityChart");

    const pctx = document.getElementById('priorityChart').getContext('2d');

    let lowPriority = window.lowPriorityEvent.getLayers();
    let medPriority = window.medPriorityEvent.getLayers();
    let highPriority = window.highPriorityEvent.getLayers();
    let critPriority = window.critPriorityEvent.getLayers();

    let priorityData = [0, 0, 0, 0];
    priorityData[0] = lowPriority.length;
    priorityData[1] = medPriority.length;
    priorityData[2] = highPriority.length;
    priorityData[3] = critPriority.length;

    let backgroundColours = getBarBackgroundColours();

    let borderColours = getBarBorderColours();

    let hoverColours = getHoverBackgroundColours();

    window.priorityChart = new Chart(pctx, {
        type: 'bar',
        data: {
            labels: ["4", "3", "2", "1"],
            datasets: [{
                label: 'Events by Priority',
                data: priorityData,
                backgroundColor: backgroundColours,
                borderColor: borderColours,
                hoverBackgroundColor: hoverColours,
                borderWidth: [
                    1,
                    1,
                    1,
                    1
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontSize: 18,
                fontFamily: "Georgia, serif",
                fontStyle: 'normal',
                text: 'Events Sorted By Priority'
            },
            scales: {
                xAxes: [{
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });
};

// Builds the time chart on the analysis panel, resetting canvas and filling with information gathered from map layers
// Time chart describes the timepoints at which events occured, allowing users to view previous points in time
async function buildTimeChart() {
    await resetCanvas("timeChart");

    const tctx = document.getElementById('timeChart').getContext('2d');

    let lowPriority = window.lowPriorityEvent.getLayers();
    let medPriority = window.medPriorityEvent.getLayers();
    let highPriority = window.highPriorityEvent.getLayers();
    let critPriority = window.critPriorityEvent.getLayers();

    let eventTimes = buffEventTimes();

    eventTimes = await addTimeToDict(eventTimes, lowPriority);
    eventTimes = await addTimeToDict(eventTimes, medPriority);
    eventTimes = await addTimeToDict(eventTimes, highPriority);
    eventTimes = await addTimeToDict(eventTimes, critPriority);

    let labels = [];
    let data = [];

    for ( let key in eventTimes ) {
        let simpleTime = moment(key).format('HH:mm:ss');
        labels.push(simpleTime);

        let dataObj = {x: simpleTime, y: eventTimes[key]};
        data.push(dataObj);
    };

    let datasets = [{
        label: '# Of Events',
        backgroundColor: getTimeLineColour(labels),
        borderColor: 'rgba(255, 0, 0, 0.2)',
        data: data,
        fill: false,
        pointHitRadius: 15,
        pointRadius: getTimeLineRadi(labels),
        pointHoverRadius: 8
    }];

    window.timeChart = new Chart(tctx, {
        type: 'line',
		data: {
            labels: labels,
			datasets: datasets
		},
		options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
			tooltips: {
				mode: 'index',
				intersect: false,
			},
            title: {
                display: true,
                fontSize: 18,
                fontFamily: "Georgia, serif",
                fontStyle: 'normal',
                text: 'Timeline of Events in The Last 5 Minutes'
            },
            elements: {
                line: {
                    tension: 0
                }
            },
			scales: {
				xAxes: [{
                    display: true,
                    type: 'time',
                    time: {
                        unit: 'second',
                        unitStepSize: 30,
                        parser:'HH:mm:ss',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    distribution: 'linear',
					scaleLabel: {
						display: true,
					    labelString: 'Time'
                    }
				}],
				yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });
};

// Refresh time chart every 30 seconds
function initiateTimeRefresh() {
    setInterval( function() { 

        buildTimeChart();

    }, 30 * 1000);
};

// Fills out dictionary with timepoints for the last 5 minutes with 30 second intervals
function buffEventTimes() {
    let eventTimes = {};

    let current = new Date();
    let updatedCurrent = new Date(Math.floor(current.getTime() / 30000) * 30000);
    
    let earliestDate = updatedCurrent;
    earliestDate.setMinutes(earliestDate.getMinutes() - 5);

    while ( earliestDate <= current ) {
        let isoStr = buildISOString(earliestDate, null);
        if ( eventTimes[isoStr] == null )  {
            eventTimes[isoStr] = 0;
        };
        earliestDate.setSeconds(earliestDate.getSeconds() + 30);
    }
    
    return eventTimes;
};

// Increments value in dictionary, to indicate detection time of each layer in the specified layer group
async function addTimeToDict(dict, layerGroup) {
    for ( let i in layerGroup ) {
        let datetime = await getProperties(layerGroup[i], true);
        let date = new Date(datetime);
        let timeStr = "";

        if ( date.getSeconds() < 30 ) {
            timeStr = buildISOString(date, 30);
        } else {
            timeStr = buildISOString(date, 60);
        }
    
        if ( dict[timeStr] != null ) { dict[timeStr] = dict[timeStr] + 1; }
    }

    return dict;
};

// Takes a date and returns a string in ISO form
function buildISOString(date, seconds) {

    function pad(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }

    let minutes = date.getUTCMinutes();
    if ( seconds != null && seconds == 60 ) { minutes = minutes + 1; seconds = 0; }

    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) + ':' + pad(minutes) + ':' + (seconds != null ? pad(seconds) : pad(date.getUTCSeconds())) + 'Z';
};

// Resets HTML canvas by removing and re-adding it to the page
function resetCanvas(canvasName) {
    let containerName = canvasName  + "Container";
    let container = document.getElementById( containerName );

    let oldCanvas = document.getElementById( canvasName );
    if (oldCanvas != null) { oldCanvas.parentNode.removeChild( oldCanvas ); }

    let oldChart = container.getElementsByClassName( "chartjs-size-monitor" )[0];
    if (oldChart != null) { oldChart.parentNode.removeChild( oldChart ); }

    let newCanvas = document.createElement('canvas');     
    newCanvas.setAttribute('id', canvasName); 
    if ( canvasName == "priorityChart" ) { newCanvas.addEventListener('click', handleBarClick, false); }
    else if ( canvasName == "timeChart" ) { newCanvas.addEventListener('click', handleTimeClick, false); }

    container.appendChild(newCanvas);
};

// Processes click on the priority bar chart, changes map view and bar colours as needed
function handleBarClick(e) {
    const chart = window.priorityChart;
    let activeElement = chart.getElementAtEvent(e);

    if (activeElement[0] != null) {
        window.barIndex = activeElement[0]._index;

        let selectedBar = chart.data.labels[activeElement[0]._index];
        showOnlyEvents((selectedBar == "4" ? true : false), (selectedBar == "3" ? true : false), (selectedBar == "2" ? true : false), (selectedBar == "1" ? true : false));
        buildPriorityChart();

    } else {
        window.barIndex = null;

        initializeLayers();
        buildPriorityChart();
    }
};

// Returns bar background colours based on accessibility mode being active or not, and whether any bars are selected
function getBarBackgroundColours() {
    let colours = [];
    let darkerColours = [];
    if ( window.accessibility == false ) {
        colours = ['rgba(118, 202, 236, 0.5)', 'rgba(254, 221, 128, 0.5)', 'rgba(254, 160, 128, 0.5)', 'rgba(254, 127, 127, 0.5)'];
        darkerColours = ['rgba(118, 202, 236, 0.9)', 'rgba(254, 221, 128, 0.9)', 'rgba(254, 160, 128, 0.9)', 'rgba(254, 127, 127, 0.9)']; 
    } else {
        colours = ['rgba(108, 165, 214, 0.5)', 'rgba(112, 212, 229, 0.5)', 'rgba(254, 157, 133, 0.5)', 'rgba(236, 108, 113, 0.5)'];
        darkerColours = ['rgba(108, 165, 214, 0.9)', 'rgba(112, 212, 229, 0.9)', 'rgba(254, 157, 133, 0.9)', 'rgba(236, 108, 113, 0.9)']; 
    }

    if ( window.barIndex != null ) {
        colours[window.barIndex] = darkerColours[window.barIndex];
    }

    return colours;
};

// Returns bar chart border colours based on accessibility mode being active or not
function getBarBorderColours() {
    let colours = [];
    if ( window.accessibility == false ) {
        colours = ['rgba(118, 202, 236, 1)', 'rgba(254, 221, 128, 1)', 'rgba(254, 160, 128, 1)', 'rgba(254, 127, 127, 1)'] 
    } else {
        colours = ['rgba(108, 165, 214, 1)', 'rgba(112, 212, 229, 1)', 'rgba(254, 157, 133, 1)', 'rgba(236, 108, 113, 1)']
    }

    return colours;
};

// Returns bar chart hover background colours based on accessibility mode being active or not
function getHoverBackgroundColours() {
    let colours = [];
    if ( window.accessibility == false ) {
        colours = ['rgba(118, 202, 236, 0.9)', 'rgba(254, 221, 128, 0.9)', 'rgba(254, 160, 128, 0.9)', 'rgba(254, 127, 127, 0.9)']; 
    } else {
        colours = ['rgba(108, 165, 214, 0.9)', 'rgba(112, 212, 229, 0.9)', 'rgba(254, 157, 133, 0.9)', 'rgba(236, 108, 113, 0.9)']; 
    }

    return colours;
};

// Processes click on the time line chart, changes markers on map and point size/ colour as needed.
function handleTimeClick(e) {
    const chart = window.timeChart;
    let activeElement = chart.getElementAtEvent(e);

    if ( activeElement[0] != null ) {
        window.timePoint = chart.data.labels[activeElement[0]._index];

        buildTimeChart();
        showTimePoint();

    } else {
        window.timePoint = null;
        
        buildTimeChart();
        showTimePoint();
    }
};

// Returns the radius of the points on the graph, based on whether they're selected or not
function getTimeLineRadi(labels) {
    let radi = [];
    for ( let i = 0; i < 11; i ++ ) {
        radi.push(5);
    }

    let index = null;
    if ( window.timePoint != null ) { index = labels.indexOf(window.timePoint); }

    if ( index != null && index >= 0 ) {
        radi[index] = 8;
    }

    return radi;
};

// Returns the colours of the points on the graph, based on whether they're selected or not
function getTimeLineColour(labels) {
    let colours = [];
    for ( let i = 0; i < 11; i ++ ) {
        colours.push('rgba(255, 0, 0, 0.2)');
    }

    let index = null;
    if ( window.timePoint != null ) { index = labels.indexOf(window.timePoint); }

    if ( index != null && index >= 0 ) {
        colours[index] = 'rgba(255, 0, 0, 0.4)';
    }

    return colours;
};