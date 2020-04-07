const video = document.getElementById("videoPlayer");
const analysisCarousel = document.getElementById("analysisCarousel");
const analysisChart = document.getElementById("analysisChart");

video.onplay = function() {
    if (analysisCarousel.style.display != "none") {
        let dur = video.duration;

        let refreshInterval = setInterval( function() { 
            refreshChart(true);
            if (analysisCarousel.style.display === "none") {
                clearInterval(refreshInterval);
                clearTimeout(refreshTimeout);
            }
        }, 270);
        
        let refreshTimeout = setTimeout( function() { 
            clearInterval(refreshInterval); 
        }, dur * 1000);

    } else if (analysisChart.style.display != "none") {
        let dur = video.duration;

        let refreshInterval = setInterval( function() { 
            refreshChart(false);
            if (analysisChart.style.display === "none") {
                clearInterval(refreshInterval);
                clearTimeout(refreshTimeout);
            }
        }, 270);
        
        let refreshTimeout = setTimeout( function() { 
            clearInterval(refreshInterval); 
        }, dur * 1000);
    }
}

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

            } else {
                window.videoAndObjDet.unshift(dataset.data);
                window.videoAndObjDet = [];
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

            } else {
                window.videoAndObjDet.unshift(dataset.data);
                window.videoAndObjDet = [];
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

        if (key == "videoOnly") {
            window.videoOnly = val;
            colour = 'rgb(54, 162, 235)';
        } else {
            window.videoAndObjDet = val;
            colour = 'rgb(255, 159, 64)';
        }

        max = Math.ceil((val[val.length-1].x)/100)*100;

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