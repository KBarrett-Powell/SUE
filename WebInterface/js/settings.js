window.accessibility = false; 

// Toggle map marker colour scheme between normal view and colour-blindness support
function toggleAccessibility(on) {
    if (on) {
        window.accessibility = true; 
        window.critPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbRedIcon);
        });
        window.highPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbOrangeIcon);
        });
        window.medPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbYellowIcon);
        });
        window.lowPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(cbBlueIcon);
        });

        window.critPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#EC6C71', color: '#EC6C71'});
        });
        window.highPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FE9D85', color: '#FE9D85'});
        });
        window.medPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#70D4E5', color: '#70D4E5'});
        });
        window.lowPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#6CA5D6', color: '#6CA5D6'});
        });

        buildPriorityChart();

    } else {
        window.accessibility = false; 
        window.critPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(redIcon);
        });
        window.highPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(orangeIcon);
        });
        window.medPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(yellowIcon);
        });
        window.lowPriorityEvent.eachLayer(function (layer) {
            layer.setIcon(blueIcon);
        });

        window.critPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FE7F7F', color: '#FE7F7F'});
        });
        window.highPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FEA080', color: '#FEA080'});
        });
        window.medPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#FEDD80', color: '#FEDD80'});
        });
        window.lowPriorityEventRange.eachLayer(function (layer) {
            layer.setStyle({fillColor: '#76CAEC', color: '#76CAEC'});
        });

        buildPriorityChart();

    }
};

// Toggle sidebar panel on button click
function togglePage(e) {
    if (e.id === "analysisToggle") {
        showPanel("analysis");

    } else if (e.id === "markerToggle") {
        showPanel("marker");

    } else {
        showPanel("chat");
    }
};

// Open sidebar panel specified in selectedPanel
function showPanel(selectedPanel) {

    // Find Panel HTML Elements
    const chatPanel = document.getElementById("chatPanel");
    const chatToggle = document.getElementById("chatToggle");

    const analysisPanel = document.getElementById("analysisPanel");
    const analysisToggle = document.getElementById("analysisToggle");

    const markerPanel = document.getElementById("markerPanel");
    const markerToggle = document.getElementById("markerToggle");

    let panel = (selectedPanel.toLowerCase() == "chat" ? chatPanel : (selectedPanel == "analysis" ? analysisPanel : markerPanel));
    let toggle = (selectedPanel.toLowerCase() == "chat" ? chatToggle : (selectedPanel == "analysis" ? analysisToggle : markerToggle));;

    if ( selectedPanel.toLowerCase() != "chat" ) {
        hideElement(chatPanel);
        removeActive(chatToggle);
    }

    if ( selectedPanel.toLowerCase() != "analysis" ) {
        hideElement(analysisPanel);
        removeActive(analysisToggle);
    }

    if ( selectedPanel.toLowerCase() != "marker" ) {
        hideElement(markerPanel);
        removeActive(markerToggle);
    }

    if ( panel.classList.contains("hidden") ) {
        panel.classList.remove("hidden")
    }
    if ( !toggle.classList.contains("active") ) {
        toggle.classList.add("active")
    }
};

const minOffset = 400;
const maxOffset = 800;

$('.slider').mousedown( function( ev, handler ) {
  $(document).mousemove( function( ev, handler ) {
    let offset = ev.pageX;
    
    offset = offset < minOffset ? minOffset : offset;
    offset = offset > maxOffset ? maxOffset : offset;

    let fontSize = Math.round((offset * 11) / 200);
    let paddingSize = Math.round(offset * 3 / 80);
    let canvasHeight = $('canvas#analysisChart').height();
    
    $('.sidebar').css('width', offset);
    $('.slider').css('marginLeft', offset);
    $('.title').css({'font-size': Math.min(fontSize, 32), 'paddingTop': (32 - fontSize) / 2, 'paddingBottom': (32 - fontSize) / 2});
    $('.title b').css('font-size', Math.min(Math.round((offset * 27) / 400), 38));
    $('.sidebar-header h3').css({'font-size': Math.min(fontSize, 28), 'paddingTop': Math.max(5 + ((28 - fontSize) / 2), 5), 'paddingBottom': Math.max(5 + ((28 - fontSize) / 2), 5)});
    $('.tcontainer').css('paddingLeft', Math.min(paddingSize, 20));
    $('.tcontainer').css('paddingRight', Math.min(paddingSize, 20));
    $('.content').css('paddingLeft', Math.min(paddingSize, 30));
    $('.content').css('paddingRight', Math.min(paddingSize, 30));
    $('canvas#analysisChart').css('marginTop', -Math.min(canvasHeight / 2, 110));
    $('.map-wrapper').css('marginLeft', offset + 10);

    window.leafletmap.invalidateSize();
  });
});

$(document).mouseup( function(e) {
  $(document).unbind('mousemove');
});