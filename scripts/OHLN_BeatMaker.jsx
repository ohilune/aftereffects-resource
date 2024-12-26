/*
    author: OHILUNE    
    name: Beat Maker
    version: v1.0.1
*/

(function () {
    // Create the UI
    var win = new Window("palette", "OHILUNE - Beat Maker", undefined);
    win.orientation = "column";

    // Helper function to create a labeled input group
    function createLabeledInput(parent, label, defaultValue) {
        var group = parent.add("group");
        group.orientation = "row";
        group.alignment = "left";

        var labelText = group.add("statictext", undefined, label);
        labelText.justify = "right";
        labelText.preferredSize = [150, 20]; // Align labels to the right

        var inputField = group.add("edittext", undefined, defaultValue);
        inputField.characters = 10;
        inputField.preferredSize = [100, 20]; // Align input fields to the left

        return inputField;
    }

    // BPM input
    var bpmInput = createLabeledInput(win, "Beats per Minute:", "120");

    // Beats per Bar input
    var beatsPerBarInput = createLabeledInput(win, "Beats per Bar:", "4");

    // Offset input
    var offsetInput = createLabeledInput(win, "Offset (frames):", "0");

    // Create button group for horizontal alignment
    var buttonGroup = win.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignment = "center";

    // Add Bar and Beat Markers to Timeline button
    var addTimelineMarkersButton = buttonGroup.add("button", undefined, "Add Markers to Timeline");

    // Add Bar and Beat Markers to Layer button
    var addLayerMarkersButton = buttonGroup.add("button", undefined, "Add Markers to Layer");

    // Show the UI
    win.center();
    win.show();

    // Function to add markers (common logic for timeline and layer)
    function addMarkers(markerTarget, fps, bpm, offset, beatsPerBar, isLayer) {
        var beatInterval = 60 / bpm; // Time interval for one beat in seconds
        var currentTime = offset / fps; // Convert offset frames to seconds
        var barCounter = 1;

        // For layers, adjust currentTime to start at the layer's inPoint
        if (isLayer) {
            currentTime += markerTarget.inPoint;
        }

        app.beginUndoGroup("Add Markers");

        var endTime = isLayer ? markerTarget.outPoint : markerTarget.duration;
        var markerProperty = isLayer ? markerTarget.property("Marker") : markerTarget.markerProperty;

        while (currentTime < endTime) {
            // Add bar marker
            var barMarkerValue = new MarkerValue(barCounter.toString());
            barMarkerValue.label = 14; // Cyan color for bar markers
            markerProperty.setValueAtTime(currentTime, barMarkerValue);

            // Add beat markers within the bar
            for (var i = 1; i < beatsPerBar; i++) {
                currentTime += beatInterval;
                if (currentTime >= endTime) break;
                var beatMarkerValue = new MarkerValue("");
                markerProperty.setValueAtTime(currentTime, beatMarkerValue);
            }

            // Increment to the next bar
            currentTime += beatInterval;
            barCounter++;
        }

        app.endUndoGroup();
    }

    // Add markers to the timeline
    addTimelineMarkersButton.onClick = function () {
        var bpm = parseFloat(bpmInput.text);
        var offset = parseFloat(offsetInput.text);
        var beatsPerBar = parseInt(beatsPerBarInput.text);

        if (isNaN(bpm) || bpm <= 0 || isNaN(offset) || isNaN(beatsPerBar) || beatsPerBar <= 0) {
            alert("Please enter valid numbers.");
            return;
        }

        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        addMarkers(comp, comp.frameRate, bpm, offset, beatsPerBar, false);
    };

    // Add markers to the selected layer
    addLayerMarkersButton.onClick = function () {
        var bpm = parseFloat(bpmInput.text);
        var offset = parseFloat(offsetInput.text);
        var beatsPerBar = parseInt(beatsPerBarInput.text);

        if (isNaN(bpm) || bpm <= 0 || isNaN(offset) || isNaN(beatsPerBar) || beatsPerBar <= 0) {
            alert("Please enter valid numbers.");
            return;
        }

        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select at least one layer.");
            return;
        }

        addMarkers(selectedLayers[0], comp.frameRate, bpm, offset, beatsPerBar, true);
    };
})();