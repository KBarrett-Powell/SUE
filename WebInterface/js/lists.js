function togglePage(e) {
    const toggle = document.getElementById(e.id);
    //let panel = null;

    if (e.id === "toggleAnalysis") {
        showAnalysisPanel();

    } else if (e.id === "toggleMarker") {
        showDetailsPanel();

    } else {
        showSUEPanel();

    }

    // if (!panel.classList.contains("hidden")) {
    //     panel.classList.add("hidden");

    //     toggle.classList.remove("active");

    // } else {
    //     panel.classList.remove("hidden");

    //     toggle.classList.add("active");
    // }
}