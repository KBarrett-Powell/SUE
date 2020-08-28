# Functions within SUE - WebInterface

## Chatbot
|Method|Returns|Description|
|------|-------|-----------|
|sendUpdateToChat (<br>&lt;String&gt; type, <br>&lt;Number&gt; id, <br>&lt;String&gt; name <br>)|-|Sends messages directly to the chat, without going through the Rasa AI. <br>Currently used for displaying &quot;Discovered New Event&quot; messages.|

## Complex
|Method|Returns|Description|
|------|-------|-----------|
|processComplexEvent (<br>&lt;Object&gt; json <br>)|-|Processes a list of complex events, only updating markers on the map if the list has changed from what is currently stored.|
|addComplexMarker (<br>&lt;Object&gt; complex <br>)|-|Adds a new marker to the map for the complex event described in the passed object.|
|refineList (<br>&lt;Array&gt; list <br>)|Array|Removes duplicates from the list of complex events, keeping the one with the most linked events within it.|

## Details
|Method|Returns|Description|
|------|-------|-----------|
|toggleDetailsFromMap (<br>&lt;Object&gt; e <br>)|-|Toggles marker page with information from selected map marker.Only works with map markers passed directly from the map.|
|toggleDetailsFromLayer (<br>&lt;Object&gt; layer <br>)|-|Toggles marker page with information from selected map marker.Works with map markers send from a function.|
|showDetails (<br>&lt;Object&gt; json, <br>&lt;String&gt; coordinates <br>)|-|Fills marker page with information from selected map marker.|
|clearDetailsMedia ( )|-|Clears all media sources to prevent information clashes when more information is added.|
|addDetailsMedia (<br>&lt;Object&gt; json, <br>&lt;String&gt; coordinates, <br>&lt;String&gt; type, <br>&lt;Object&gt; chartData, <br>&lt;String&gt; analysisImgFile, <br>&lt;String&gt; objDetFile, <br>&lt;String&gt; slctRevFile, <br>&lt;String&gt; analysisAudioFile, <br>&lt;String&gt; sensorVideoFile, <br>&lt;String&gt; sensorAudioFile, <br>&lt;Array&gt; timelineInfo <br>)|-|Fills in all media sources with the passed information.|
|hideElement (<br>&lt;Object&gt; element <br>)|-|Adds hidden class to element.|
|removeActive (<br>&lt;Object&gt; element <br>)|-|Removes active class form element.|
|setCarouselItem (<br>&lt;Object&gt; element <br>)|-|Adds element to the media carousel.|
|removeCarouselItem (<br>&lt;Object&gt; element <br>)|-|Removes element from the media carousel.|
|openEventDetails (<br>&lt;Number&gt; id <br>)|-|Shows the details of an event map marker with passed id.|
|openComplexEventDetails (<br>&lt;Number&gt; id <br>)|-|Shows the details of a complex event map marker with passed id.|

## Graph
|Method|Returns|Description|
|------|-------|-----------|
|plotChartPoints ( )|-|While the correct chart is visible, and has not been filled, update its values in time with the video/audio track from the sensor.|
|refreshChart ( )|-|Finds the next points on the line chart to be added and pushes them to the canvas.|
|clearChart ( )|-|Removes all data from the chart.|
|createChart (<br>&lt;Object&gt; chartData <br>)|-|Builds the analysis chart, resetting canvas and rebuilding with passed data.|
|buildPriorityChart ( )|-|Builds the priority chart on the analysis panel, resetting canvas, defining colours and filling with information gathered from map layers.|
|buildTimeChart ( )|-|Builds the time chart on the analysis panel, resetting canvas and filling with information gathered from map layers.|
|initiateTimeRefresh ( )|-|Refreshes time chart every 30 seconds.|
|buffEventTimes ( )|Array|Fills out dictionary with timepoints for the last 5 minutes, with 30 second intervals.|
|addTimeToDict (<br>&lt;Object&gt; dict, <br>&lt;Array&gt; layerGroup <br>)|Object|Increments value in dictionary, to indicate detection time of each layer in the passed layer group.|
|buildISOString (<br>&lt;Date&gt; date, <br>&lt;Number&gt; seconds <br>)|String|Creates a string in ISO form for the passed date, with optional specified seconds.|
|resetCanvas (<br>&lt;String&gt; canvasName <br>)|-|Resets passed HTML canvas by removing and re-adding it to the page.|
|handleBarClick (<br>&lt;Object&gt; e <br>)|-|Processes click on the priority bar chart, changes map view and bar colours as needed.|
|getBarBackgroundColours ( )|Array|Returns bar chart background colours based on accessibility mode being active or not, and whether any bars are selected.|
|getBarBorderColours ( )|Array|Returns bar chart border colours based on accessibility mode being active or not.|
|getHoverBackgroundColours ( )|Array|Returns bar chart hover background colours based on accessibility mode being active or not.|
|handleTimeClick (<br>&lt;Object&gt; e <br>)|-|Processes click on the time line chart, changes markers on map and point size/ colour as needed.|
|getTimeLineRadi (<br>&lt;Array&gt; labels <br>)|Array|Returns the radius of the points on the graph, based on whether they are selected or not.|
|getTimeLineColour (<br>&lt;Array&gt; labels <br>)|Array|Returns the colours of the points on the graph, based on whether they are selected or not.|

## Layer-Markers
|Method|Returns|Description|
|------|-------|-----------|
|updateMapMarkers (<br>&lt;Object&gt; request <br>)|-|For each object in a request, attempts to find and update it on the appropriate map layer.If the object is not found, a new map marker is added to that layer.|
|deleteMapMarkers (<br>&lt;Object&gt; request <br>)|-|For each object in a request, attempts to find and delete it from the appropriate map layer.|
|updateByLayer (<br>&lt;Object&gt; request, <br>&lt;String&gt; layerGroup, <br>&lt;Boolean&gt; ownerSensor, <br>&lt;Boolean&gt; isRange <br>)|-|Finds the relevant layer and updates its properties, and features of the map marker.|
|deleteByLayer (<br>&lt;Object&gt; request, <br>&lt;String&gt; layerGroup, <br>&lt;Array&gt; idsList <br>)|-|Attempts to find a map layer with a matching id to one specified in the passed list, deleting it from the layer group it&#39;s stored in, when found.|
|showTimePoint ( )|-|Refreshes markers on map to reflect their appearance at a certain time point.|
|findSensor (<br>&lt;Number&gt; id <br>)|-|Finds information about sensor with passed id.Used for event details.|
|findEvents (<br>&lt;Array&gt; list <br>)|-|Finds information about events with passed ids.Used for complex event details and chatbot view details functionality.|
|findComplex (<br>&lt;Number&gt; id <br>)|-|Finds information about complex event with passed id.Used for chatbot view details functionality.|
|showHoveredEvent (<br>&lt;Number&gt; id <br>)|-|Opens the Popup of a selected event with passed id.|

## Layers
|Method|Returns|Description|
|------|-------|-----------|
|initializeLayers ( )|-|Removes all layer groups from the map and adds the original set back.|
|alterLayers (<br>&lt;Object&gt; dict <br>)|-|Removes all layer groups and adds back the ones specified in the passed dictionary.|
|removeAllLayers ( )|-|Attempts to remove all layer groups from the map.|
|toggleLayer (<br>&lt;Object&gt; layerGroup <br>)|-|If a layer group is currently on the map, this removes it and adds it back.Used to refresh layer group on data change.|
|clearMap ( )|-|Removes all layers from each layer group and clears the marker sidebar.|
|showOnlyEvents (<br>&lt;Boolean&gt; lowPri, <br>&lt;Boolean&gt; medPri, <br>&lt;Boolean&gt; highPri, <br>&lt;Boolean&gt; critPri <br>)|-|Removes all layer groups from the map and adds back those related to the event priority selected.|
|refreshComplex ( )|-|Clears just the complex event layer.|

## Markers
|Method|Returns|Description|
|------|-------|-----------|
|addMarker (<br>&lt;Object&gt; json, <br>&lt;Boolean&gt; sensor, <br>&lt;String&gt; layerGroup <br>)|-|Creates a new map marker with information from the json, then adds it to a layer group on the map.|
|addMarkerToLayer (<br>&lt;Object&gt; marker, <br>&lt;Array&gt; ranges, <br>&lt;Object&gt; layerGroup, <br>&lt;Object&gt; rangeLayerGroup <br>)|-|Adds a newly created Marker object and its ranges to the specified map layer groups.|
|getProperties (<br>&lt;Object&gt; layer, <br>&lt;Boolean&gt; graph <br>)|Object|Creates a list of all the properties of the map marker stored by time, returning a compiled list of those properties.|
|compileProperties (<br>&lt;Object&gt; properties, <br>&lt;Array&gt; keys <br>)|Object|Compiles the properties list, containing all properties at various time points, to a list of properties at a certain time point.|
|showPopup (<br>&lt;Object&gt; layer <br>)|-|If passed item is not null, opens the popup for that map marker, else opens the popup for the previously selected marker.|
|getIcon (<br>&lt;Object&gt; properties, <br>&lt;Boolean&gt; ownerSensor <br>)|Object|Returns the correct icon to use for the map marker based on the sensor type or owner, the event priority, or the item being a complex event.|

## Settings
|Method|Returns|Description|
|------|-------|-----------|
|toggleAccessibility (<br>&lt;Boolean&gt; on <br>)|-|Toggles map marker colour scheme between normal view and colour-blindness support.|
|togglePage (<br>&lt;Object&gt; e <br>)|-|Toggles sidebar panel on button click.|
|showPanel (<br>&lt;String&gt; selectedPanel <br>)|-|Opens sidebar panel specified in selectedPanel, hiding all others.|
