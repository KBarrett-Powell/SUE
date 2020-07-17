function plotChartPoints(){
    if (analysisCarousel.style.display != "none" || analysisChart.style.display != "none") {
        let duration = (mainAudio.style.display === "none" ? videoPlayer.duration : audioPlayer.duration);
        let interval = (mainAudio.style.display === "none" ? 270 : 1000);
        let chartChoice = (analysisCarousel.style.display === "none" ? false : true);

        let refreshInterval = setInterval( function() { 

            refreshChart(chartChoice);

            if ((chartChoice && analysisCarousel.style.display === "none") || (!chartChoice && analysisChart.style.display === "none")) {
                clearInterval(refreshInterval);
                clearTimeout(refreshTimeout);
            }

        }, interval);
                
        let refreshTimeout = setTimeout( function() { 
            clearInterval(refreshInterval); 
        }, duration * 1000);
    }
};

function refreshChart(isCarousel) {
    if (isCarousel === true) {
        window.caroGraph.config.data.datasets.forEach(function(dataset) {
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

        window.caroGraph.update();

    } else {
        window.lineGraph.config.data.datasets.forEach(function(dataset) {
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

        window.lineGraph.update();
    }
}

function clearChart(isCarousel) {
    if (isCarousel === true) {
        window.caroGraph.config.data.datasets.forEach(function(dataset) {
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

        window.caroGraph.update();
    } else {
        window.lineGraph.config.data.datasets.forEach(function(dataset) {
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

        window.lineGraph.update();
    }
}

function createChart(chartData, isCarousel) {
    // operations on data
    // ' to "
    // {([0-9]+): ([0-9]+).([0-9]+e*-*[0-9]*)} to  [\1,\2.\3]
    // "videoAndObjDet": {"\(\)": \[([0-9]+),([0-9]+).([0-9]+e*-*[0-9]*)\]}  to x: \1, y: \2.\3 

    let chart = null;

    if (isCarousel === true) {chart = document.getElementById("carochart");}
    else {chart = document.getElementById("analysischart");}
    
    const ctx = chart.getContext('2d');

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

    if (isCarousel === true) { window.caroGraph = new Chart(ctx, config); }
    else { window.lineGraph = new Chart(ctx, config); }
}

async function buildAnalysisCharts() {

    await resetCanvas("priorityChart");
    await resetCanvas("timeChart");

    const pctx = document.getElementById('priorityChart').getContext('2d');
    const tctx = document.getElementById('timeChart').getContext('2d');

    let lowPriority = window.lowPriorityEvent.getLayers();
    let medPriority = window.medPriorityEvent.getLayers();
    let highPriority = window.highPriorityEvent.getLayers();
    let critPriority = window.critPriorityEvent.getLayers();

    let priorityData = [0, 0, 0, 0];
    priorityData[0] = lowPriority.length;
    priorityData[1] = medPriority.length;
    priorityData[2] = highPriority.length;
    priorityData[3] = critPriority.length;

    new Chart(pctx, {
        type: 'bar',
        data: {
            labels: ["4", "3", "2", "1"],
            datasets: [{
                label: 'Events by Priority',
                data: priorityData,
                backgroundColor: [
                    'rgba(0, 106, 255, 0.2)',
                    'rgba(255, 255, 0, 0.2)',
                    'rgba(255, 80, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 106, 255, 1)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(255, 80, 0, 1)',
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
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
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    let eventTimes = {};
    eventTimes = addTimeToDict(eventTimes, lowPriority);
    eventTimes = addTimeToDict(eventTimes, medPriority);
    eventTimes = addTimeToDict(eventTimes, highPriority);
    eventTimes = addTimeToDict(eventTimes, critPriority);

    let labels = [];
    let data = [];
    for ( let key in eventTimes ) {
        let simpleTime = moment(key).format('HH:mm:ss');
        labels.push(simpleTime);

        let dataObj = {x: simpleTime, y: eventTimes[key]};
        data.push(dataObj);
    };

    new Chart(tctx, {
        type: 'line',
		data: {
            labels: labels,
			datasets: [{
				label: '# Of Events',
				backgroundColor: 'rgba(255, 0, 0, 0.2)',
				borderColor: 'rgba(255, 0, 0, 0.2)',
				data: data,
				fill: false
			}]
		},
		options: {
            responsive: true,
            legend: {
                display: false
            },
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
            },
            title: {
                display: true,
                fontSize: 18,
                fontFamily: "Georgia, serif",
                fontStyle: 'normal',
                text: 'Timeline of Events'
            },
            elements: {
                line: {
                    tension: 0.2
                }
            },
			scales: {
				xAxes: [{
                    display: true,
                    type: 'time',
                    time: {
                        unit: 'second',
                        unitStepSize: 10,
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
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });	
};

function addTimeToDict(dict, list) {
    for ( let i in list ) {
        let event = JSON.parse(list[i].options.properties);
        let dateTime = new Date(event.datetime);

        if (dateTime.getSeconds() < 20) {
            dateTime.setSeconds(0);
        } else if (dateTime.getSeconds() < 40) {
            dateTime.setSeconds(20);
        } else {
            dateTime.setSeconds(40);
        }

        let timestr = buildISOString(dateTime);
    
        if (dict[timestr] != null) { dict[timestr] = dict[timestr] + 1; }
            else { dict[timestr] = 1; }
    }

    return dict;
};

function buildISOString(date) {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z';
};

function resetCanvas(canvasName){
    let oldCanvas = document.getElementById( canvasName );
    oldCanvas.parentNode.removeChild(oldCanvas); 

    let newCanvas = document.createElement('canvas');     
    newCanvas.setAttribute('id', canvasName); 

    let containerName = canvasName  + "Container";
    document.getElementById(containerName).appendChild(newCanvas);
};