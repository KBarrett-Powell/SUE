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

function buildStaticCharts() {

    const pctx = document.getElementById('priorityChart').getContext('2d');
    const tctx = document.getElementById('timeChart').getContext('2d');

    let priorityChart = new Chart(pctx, {
        type: 'bar',
        data: {
            labels: ["4", "3", "2", "1"],
            datasets: [{
                label: 'Events by Priority',
                data: [1, 2, 1, 1],
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
                    display: true,
					// scaleLabel: {
					// 	display: true,
					//     labelString: 'Priority'
					// }
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

    let timeChart = new Chart(tctx, {
        type: 'line',
		data: {
            labels: [moment('2020-03-04T16:10:20Z').format('HH:mm:ss'), moment('2020-03-04T16:10:30Z').format('HH:mm:ss'), moment('2020-03-04T16:10:40Z').format('HH:mm:ss'), moment('2020-03-04T16:10:50Z').format('HH:mm:ss'), moment('2020-03-04T16:11:00Z').format('HH:mm:ss')],
			datasets: [{
				label: '# Of Events',
				backgroundColor: 'rgba(255, 0, 0, 0.2)',
				borderColor: 'rgba(255, 0, 0, 0.2)',
				data: [{
                    x: moment('2020-03-04T16:10:20Z').format('HH:mm:ss'),
                    y: 1
                },{
                    x: moment('2020-03-04T16:10:25Z').format('HH:mm:ss'),
                    y: 1
                },{
                    x: moment('2020-03-04T16:10:30Z').format('HH:mm:ss'),
                    y: 0
                },{
                    x: moment('2020-03-04T16:10:35Z').format('HH:mm:ss'),
                    y: 1
                },{
                    x: moment('2020-03-04T16:10:40Z').format('HH:mm:ss'),
                    y: 0
                },{
                    x: moment('2020-03-04T16:10:45Z').format('HH:mm:ss'),
                    y: 0
                },{
                    x: moment('2020-03-04T16:10:50Z').format('HH:mm:ss'),
                    y: 1
                },{
                    x: moment('2020-03-04T16:10:55Z').format('HH:mm:ss'),
                    y: 0
                },{
                    x: moment('2020-03-04T16:11:00Z').format('HH:mm:ss'),
                    y: 1
                }],
				fill: false
			}, {
				label: '# Of Events Total',
				backgroundColor: 'rgba(0, 106, 255, 0.2)',
				borderColor: 'rgba(0, 106, 255, 0.2)',
				data: [{
                    x: moment('2020-03-04T16:10:20Z').format('HH:mm:ss'),
                    y: 1
                },{
                    x: moment('2020-03-04T16:10:25Z').format('HH:mm:ss'),
                    y: 2
                },{
                    x: moment('2020-03-04T16:10:30Z').format('HH:mm:ss'),
                    y: 2
                },{
                    x: moment('2020-03-04T16:10:35Z').format('HH:mm:ss'),
                    y: 3
                },{
                    x: moment('2020-03-04T16:10:40Z').format('HH:mm:ss'),
                    y: 3
                },{
                    x: moment('2020-03-04T16:10:45Z').format('HH:mm:ss'),
                    y: 3
                },{
                    x: moment('2020-03-04T16:10:50Z').format('HH:mm:ss'),
                    y: 4
                },{
                    x: moment('2020-03-04T16:10:55Z').format('HH:mm:ss'),
                    y: 4
                },{
                    x: moment('2020-03-04T16:11:00Z').format('HH:mm:ss'),
                    y: 5
                }],
                fill: false
			}]
		},
		options: {
            responsive: true,
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
					// display: true,
					// scaleLabel: {
					// 	display: true,
					// 	labelString: '# of Events'
                    // },
                    beginAtZero: true,
                    stepSize: 1
				}]
            }
        }
    });	
}