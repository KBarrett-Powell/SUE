function togglePage(e) {
    const toggle = document.getElementById(e.id);
    let panel = null;

    if (e.id === "toggleList") {
        panel = document.getElementById("listpanel");

        if ( !document.getElementById("searchpanel").classList.contains("hidden") ) {
            document.getElementById("searchpanel").classList.add("hidden")
        }
        if ( !document.getElementById("detailspanel").classList.contains("hidden") ) {
            document.getElementById("detailspanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleSearch").classList.contains("active") ) {
            document.getElementById("toggleSearch").classList.remove("active")
        }
        if ( document.getElementById("toggleMarker").classList.contains("active") ) {
            document.getElementById("toggleMarker").classList.remove("active")
        }

    } else if (e.id === "toggleMarker") {
        panel = document.getElementById("detailspanel");

        if ( !document.getElementById("listpanel").classList.contains("hidden") ) {
            document.getElementById("listpanel").classList.add("hidden")
        }
        if ( !document.getElementById("searchpanel").classList.contains("hidden") ) {
            document.getElementById("searchpanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleList").classList.contains("active") ) {
            document.getElementById("toggleList").classList.remove("active")
        }
        if ( document.getElementById("toggleSearch").classList.contains("active") ) {
            document.getElementById("toggleSearch").classList.remove("active")
        }

    } else {
        panel = document.getElementById("searchpanel");

        if ( !document.getElementById("listpanel").classList.contains("hidden") ) {
            document.getElementById("listpanel").classList.add("hidden")
        }
        if ( !document.getElementById("detailspanel").classList.contains("hidden") ) {
            document.getElementById("detailspanel").classList.add("hidden")
        }
        if ( document.getElementById("toggleList").classList.contains("active") ) {
            document.getElementById("toggleList").classList.remove("active")
        }
        if ( document.getElementById("toggleMarker").classList.contains("active") ) {
            document.getElementById("toggleMarker").classList.remove("active")
        }

    }

    if (!panel.classList.contains("hidden")) {
        panel.classList.add("hidden");

        toggle.classList.remove("active");

    } else {
        panel.classList.remove("hidden");

        toggle.classList.add("active");
    }
}

function sortByTime() {
    const tbutton = document.getElementById("sortTime");
    const pbutton = document.getElementById("sortPriority");
    const arrow = document.getElementById("timeArrow");

    const list1 = document.getElementById("sensoralist");
    const list2 = document.getElementById("sensorclist");
    const list3 = document.getElementById("sensorplist");
    const list4 = document.getElementById("eventalist");
    const list5 = document.getElementById("eventplist");
    const list6 = document.getElementById("eventvlist");
    const list7 = document.getElementById("eventllist");
    const list8 = document.getElementById("complexalist");

    if (tbutton.classList.contains("selected") == false) {
        tbutton.classList.add("selected");  
        pbutton.classList.remove("selected");
    }

    let direction = "desc";

    if (arrow.classList.contains("fa-long-arrow-down")) {    
        arrow.classList.remove("fa-long-arrow-down")
        arrow.classList.add("fa-long-arrow-up")
    } else {
        direction = "asc";
        arrow.classList.remove("fa-long-arrow-up")
        arrow.classList.add("fa-long-arrow-down")
    }

    sortlist(list1, direction, "time");
    sortlist(list2, direction, "time");
    sortlist(list3, direction, "time");
    sortlist(list4, direction, "time");
    sortlist(list5, direction, "time");
    sortlist(list6, direction, "time");
    sortlist(list7, direction, "time");
    sortlist(list8, direction, "time");
}

function sortByPriority() {
    const tbutton = document.getElementById("sortTime");
    const pbutton = document.getElementById("sortPriority");
    const arrow = document.getElementById("priorityArrow");

    const list1 = document.getElementById("sensoralist");
    const list2 = document.getElementById("sensorclist");
    const list3 = document.getElementById("sensorplist");
    const list4 = document.getElementById("eventalist");
    const list5 = document.getElementById("eventplist");
    const list6 = document.getElementById("eventvlist");
    const list7 = document.getElementById("eventllist");
    const list8 = document.getElementById("complexalist");

    if (tbutton.classList.contains("selected") == false) {
        tbutton.classList.add("selected");  
        pbutton.classList.remove("selected");
    }

    let direction = "desc";

    if (arrow.classList.contains("fa-long-arrow-down")) {
        arrow.classList.remove("fa-long-arrow-down")
        arrow.classList.add("fa-long-arrow-up")
    } else {
        direction = "asc";
        arrow.classList.remove("fa-long-arrow-up")
        arrow.classList.add("fa-long-arrow-down")
    }

    sortlist(list1, direction, "priority");
    sortlist(list2, direction, "priority");
    sortlist(list3, direction, "priority");
    sortlist(list4, direction, "priority");
    sortlist(list5, direction, "priority");
    sortlist(list6, direction, "priority");
    sortlist(list7, direction, "priority");
    sortlist(list8, direction, "priority");
}

function sortlist(list, order, type){
    if (list != null) {
        let switching = true;
        let shouldSwitch = false;

        //let priorityLst = ["Planned", "Person", "Vehicle"];

        while (switching) {
            switching = false;

            let b = list.getElementsByTagName("div");
            
            for (let i = 0; i < (b.length - 1); i++) {        
                shouldSwitch = false;
                let current = 0;
                let old = 0;

                let currentbutton = b[i].getElementsByTagName("button");
                let oldbutton = b[i + 1].getElementsByTagName("button");

                if (type == "time") {
                    current = new Date( JSON.parse( currentbutton[0].id).properties.datetime);
                    old = new Date( JSON.parse( oldbutton[0].id ).properties.datetime);

                } 
                // else {
                //     let currenttype = JSON.parse( currentbutton[0].id).properties;
                //     let oldtype = JSON.parse( oldbutton[0].id).properties;

                //     if (currenttype.type != "Event") {
                //         current = 0;
                //     } else {
                //         current = priorityLst.indexOf(currenttype.eventType) + 1;
                //     }

                //     if (oldtype.type != "Event") {
                //         old = 4;
                //     } else {
                //         old = priorityLst.indexOf(oldtype.eventType) + 1;
                //     }
                // }
                
                
                if (order == "desc") {
                    if (current < old) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (current > old) {
                        shouldSwitch = true;
                        break;
                    }
                }
            

                if (shouldSwitch) {
                    b[i].parentNode.insertBefore(b[i + 1], b[i]);
                    switching = true;
                }
            }
        }
    }
}