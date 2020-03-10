function sortByTime() {
    var tbutton = document.getElementById("sortTime");
    var pbutton = document.getElementById("sortPriority");
    var arrow = document.getElementById("timeArrow");

    var list1 = document.getElementById("sensoralist");
    var list2 = document.getElementById("sensorclist");
    var list3 = document.getElementById("sensorplist");
    var list4 = document.getElementById("eventalist");
    var list5 = document.getElementById("eventplist");
    var list6 = document.getElementById("eventvlist");
    var list7 = document.getElementById("eventllist");
    var list8 = document.getElementById("complexalist");

    if (tbutton.classList.contains("selected") == false) {
        tbutton.classList.add("selected");  
        pbutton.classList.remove("selected");
    }

    if (arrow.classList.contains("fa-long-arrow-down")) {
        var direction = "desc";
        arrow.classList.remove("fa-long-arrow-down")
        arrow.classList.add("fa-long-arrow-up")
    } else {
        var direction = "asc";
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
    var tbutton = document.getElementById("sortTime");
    var pbutton = document.getElementById("sortPriority");
    var arrow = document.getElementById("priorityArrow");

    var list1 = document.getElementById("sensoralist");
    var list2 = document.getElementById("sensorclist");
    var list3 = document.getElementById("sensorplist");
    var list4 = document.getElementById("eventalist");
    var list5 = document.getElementById("eventplist");
    var list6 = document.getElementById("eventvlist");
    var list7 = document.getElementById("eventllist");
    var list8 = document.getElementById("complexalist");

    if (tbutton.classList.contains("selected") == false) {
        tbutton.classList.add("selected");  
        pbutton.classList.remove("selected");
    }

    if (arrow.classList.contains("fa-long-arrow-down")) {
        var direction = "desc";
        arrow.classList.remove("fa-long-arrow-down")
        arrow.classList.add("fa-long-arrow-up")
    } else {
        var direction = "asc";
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
        var switching = true;
        var shouldSwitch = false;

        var priorityLst = ["Planned", "Person", "Vehicle"];

        while (switching) {
            switching = false;

            let b = list.getElementsByTagName("div");
            
            for (i = 0; i < (b.length - 1); i++) {        
                shouldSwitch = false;
                var current = 0;
                var old = 0;

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
            }

            if (shouldSwitch) {
                b[i].parentNode.insertBefore(b[i + 1], b[i]);
                switching = true;
            }
        }
    }
}