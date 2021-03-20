let socket = new WebSocket("ws://217.155.205.250:8081");
var daysOfTheWeek = [];
var MonthsOfTheYear = [];
var DaysInYear = -1;
var CurrentYear = -1;
var userRole = "";
var isCalendarDrawn = false;

socket.onopen = function(e) {
    console.log("Connected to Backend");
    if (localStorage.getItem("guid") !== null) {
        SendWithGUID("CheckLogin");
    }
}

socket.onmessage = function(event) {

    //console.log(event.data);
    if (typeof event.data === 'string' && event.data.startsWith('Calendar:')) {
        CreateCalendar(event.data);
    }
    if (typeof event.data === 'string' && (event.data.startsWith('Login') || event.data.startsWith('Logout'))) {
        let role = event.data.replace(/(,[0-9a-z]+)/gi, "").replace(/(-[0-9a-z]+)/gi, "").replace(/([a-z]+\s[a-z]+\.\.)/gi, "");
        let loginStatus = event.data.replace(/(,[0-9a-z]+)/gi, "").replace(/(-[0-9a-z]+)/gi, "").replace(/(\.[a-z]+)/gi, "");
        let guid = event.data.replace(/([0-9a-z]+\s[0-9a-z]+..[0-9a-z]+,)/gi, "");
        if (guid !== "") {
            console.log(guid);
            localStorage.setItem("guid", guid);
        }
        if (role === "DM") {
            document.getElementById("DMControls").style.visibility = "visible";
        } else {
            document.getElementById("DMControls").style.visibility = "hidden";
        }
        if (role !== "Logout Successful.") {
            userRole = role;
        } else {
            userRole = "";
        }

        document.getElementById("LoginStatus").innerText = loginStatus;
    }
    if (typeof event.data === 'string' && event.data.startsWith('Date:')) {
        document.getElementById("CurrentDate").innerHTML = "The Current Date is " + event.data.replace("Date:", '');

    }
    if (typeof event.data === 'string' && event.data.startsWith('Year:')) {
        CurrentYear = event.data.replace("Year:", '');

    }
    if (typeof event.data === 'string' && event.data.startsWith('CurrentDate:')) {
        let date = event.data.replace("CurrentDate:", '');
        let day = date.replace(/(,[0-9]+)/g, '');
        let month = date.replace(/([0-9]+,)/g, '');

        let monthDiv = document.getElementById("MonthDiv" + month);
        let childIndex = -1;

        for (let i = 0; i < monthDiv.childElementCount; i++) {
            if (monthDiv.children[i].innerHTML == day) {
                childIndex = i;
                break;
            }
        }

        monthDiv.children[childIndex].style.backgroundColor = "red";
    }
    if (typeof event.data === 'string' && event.data.startsWith('Event Deleted')) {
        isCalendarDrawn = false;
    }
    if (typeof event.data === 'string' && event.data.startsWith('Days:')) {
        daysOfTheWeek = event.data.replaceAll(',', ' ').replace('Days:', '').split(' ');
    }
    if (typeof event.data === 'string' && event.data.startsWith('Months:')) {
        MonthsOfTheYear = event.data.replaceAll(',', ' ').replace('Months:', '').split(' ');
    }
    if (typeof event.data === 'string' && event.data.startsWith('EventData:')) {
        let data = event.data.replace("EventData:", '');
        CreateEventOnMessage(data);
    }
    if (typeof event.data === 'string' && event.data.startsWith('EventDate:')) {
        let date = event.data.replace("EventDate:", '');
        let day = date.replace(/(,[0-9]+)/g, '').replace(/(\.[0-9]+)/g, '').replace(/(\.-[0-9]+)/g, '');
        let month = date.replace(/([0-9]+,)/g, '').replace(/(\.[0-9]+)/g, '').replace(/(\.-[0-9]+)/g, '');
        let year = date.replace(/([0-9]+,[0-9]+\.)/g, '');
        let monthDiv = document.getElementById("MonthDiv" + month);
        let childIndex = -1;

        if (year == CurrentYear || year == -1) {
            for (let i = 0; i < monthDiv.childElementCount; i++) {
                if (monthDiv.children[i].innerHTML == day) {
                    childIndex = i;
                    break;
                }
            }

            monthDiv.children[childIndex].style.borderColor = "green";
            monthDiv.children[childIndex].style.borderWidth = "thick";
            monthDiv.children[childIndex].setAttribute("Year", year);

        }
    }

}

socket.onclose = function(e) {
    console.log("connection closed please refresh");
}

window.onload = function() {

    document.getElementById("nextDayButton").addEventListener("click", function() {
        SendWithGUID("NextDay");
    });

    document.getElementById("rewindDayButton").addEventListener("click", function() {
        SendWithGUID("RewindDay");
    });

    document.getElementById("Login").addEventListener("click", function() {
        socket.send("Login" + document.getElementById("UserName").value + "." + document.getElementById("Password").value);
    });

    document.getElementById("Logout").addEventListener("click", function() {

        SendWithGUID("LogOut");
    });

    document.getElementById("setDayButton").addEventListener("click", function() {
        if (document.getElementById("DayInput").value <= DaysInYear) {
            SendWithGUID("SetDay" + document.getElementById("DayInput").value);
        } else {
            alert("Please Enter Valid Numbers!")
        }
    });

    document.getElementById("AddEvent").addEventListener("click", function() {
        var newEvent = document.getElementsByClassName("NewEventSpace")[0];
        if (newEvent.classList.contains("active")) {
            newEvent.classList.remove("active");
        } else {
            newEvent.classList.add("active");
        }
    });

    document.getElementById("SubmitEvent").addEventListener("click", function() { SubmitEvent(); });

    document.getElementById("setDateButton").addEventListener("click", function() {
        if (document.getElementById("MonthInput").value <= MonthsOfTheYear.length && document.getElementById("DayInput").value <= DaysInYear && document.getElementById("YearInput").value > 0) {
            SendWithGUID("SetYear" + document.getElementById("YearInput").value);
            SendWithGUID("SetMonth" + document.getElementById("MonthInput").value);
            SendWithGUID("SetDay" + document.getElementById("DayInput").value);
        } else {
            alert("Please Enter Valid Numbers!")
        }

    });

    SliderSetup();



}

function SliderSetup() {
    let slider = document.getElementsByClassName('slider-parent')[0];
    let slidertrigger = document.getElementsByClassName("slider-trigger");
    for (let i = 0; i < slidertrigger.length; i++) {
        let element = slidertrigger[i];
        element.addEventListener("click", function(el) {
            if (slider.classList.contains("active")) {
                slider.classList.remove("active");

                for (let j = 0; j < MonthsOfTheYear.length; j++) {
                    let monthDiv = document.getElementById("MonthDiv" + j);
                    for (let i = 0; i < monthDiv.childElementCount; i++) {
                        if (monthDiv.children[i].getAttribute("event") == "Created") {
                            monthDiv.children[i].setAttribute("event", "");
                        }
                    }
                }

                let eventTag = document.getElementById("event")
                eventTag.innerHTML = "<h1 id='Title'></h1><a href='#' class='DeleteEvent'>Delete Event</a><p id='Date'></p><p id='Occurance'></p><p class='Description'></p>";


            } else {
                slider.classList.add("active");
            }
        });

    }
}

function SubmitEvent() {
    var newEvent = document.getElementsByClassName("NewEventSpace")[0];
    let slider = document.getElementsByClassName('slider-parent')[0];


    if (userRole !== "") {
        let title = document.getElementById("NewEventTitle").value;
        let description = document.getElementById("NewEventDesc").value;
        let isAnnual = document.getElementById("NewEventAnnual").checked;
        let day = slider.getAttribute("day");
        let month = slider.getAttribute("month");

        SendWithGUID("CreateEvent " + JSON.stringify({ "EventTitle": title, "EventDescription": description, "EventDay": parseInt(day), "EventMonth": parseInt(month), "EventYear": isAnnual ? -1 : CurrentYear, "IsAnnual": isAnnual }));

        if (slider.classList.contains("active")) {
            slider.classList.remove("active");
        } else {
            slider.classList.add("active");
        }
        if (newEvent.classList.contains("active")) {
            newEvent.classList.remove("active");
        } else {
            newEvent.classList.add("active");
        }
    } else {
        alert("You need to be logged in to create events");
    }
}

function CreateCalendar(data) {
    if (!isCalendarDrawn) {

        if (document.getElementById("CalendarTable") !== null) {
            document.getElementById("Calendar").innerHTML = "";
        }

        let calendarData = data.replace("Calendar:", "").split(',');
        DaysInYear = calendarData.length;
        calendarData.pop();
        let dayNumReg = /(\.[0-9])/g;
        let weekNumReg = /([0-9]+\.)/g;
        let monthNumber = 0;
        //Create Master Table
        let table = document.createElement("table");
        table.id = "CalendarTable";
        document.getElementById("Calendar").appendChild(table);

        //Add first month to table headers
        let monthName = document.createElement("th");
        monthName.id = "MonthDiv" + monthNumber;
        monthName.innerHTML = "<p>" + MonthsOfTheYear[monthNumber] + "</p>";
        document.getElementById("CalendarTable").appendChild(monthName);

        //Add row for weeknames
        let tableRow = document.createElement("tr");
        tableRow.id = "tabler" + monthNumber;
        document.getElementById("MonthDiv" + monthNumber).appendChild(tableRow);


        AddWeekNamesToTable(monthNumber);

        //align the calendar
        let weekNumber = calendarData[0].replace(weekNumReg, "");
        AddBlankDays(weekNumber, monthNumber);

        for (let i = 0; i < calendarData.length; i++) {
            //add new row per week
            if (calendarData[i].includes('\n')) {
                calendarData[i] = calendarData[i].replaceAll("\n", "");
                let weekGap = document.createElement("tr");
                weekGap.id = "weekGap";
                document.getElementById("MonthDiv" + monthNumber).appendChild(weekGap);
            }

            let dayNumber = calendarData[i].replace(dayNumReg, "");
            weekNumber = calendarData[i].replace(weekNumReg, "");


            if (i > 1) {
                //deal with end of month
                let lastDayNumber = calendarData[i - 1].replace(dayNumReg, "");
                if (parseInt(lastDayNumber) > parseInt(dayNumber)) {
                    //add new month header

                    monthNumber++;
                    if (monthNumber % 3 == 0) {
                        let NewRow = document.getElementById("CalendarTable")
                        NewRow = document.createElement("tr");
                        document.getElementById("CalendarTable").appendChild(NewRow);

                        monthName = document.createElement("th");
                        monthName.id = "MonthDiv" + monthNumber;
                        monthName.innerHTML = "<p>" + MonthsOfTheYear[monthNumber] + "</p>";
                        document.getElementById("CalendarTable").appendChild(monthName);

                        let tableRow = document.createElement("tr");
                        tableRow.id = "tabler" + monthNumber;
                        document.getElementById("MonthDiv" + monthNumber).appendChild(tableRow);


                        AddWeekNamesToTable(monthNumber);

                        AddBlankDays(weekNumber, monthNumber);
                    } else {
                        monthName = document.createElement("th");
                        monthName.id = "MonthDiv" + monthNumber;
                        monthName.innerHTML = "<p>" + MonthsOfTheYear[monthNumber] + "</p>";
                        document.getElementById("CalendarTable").appendChild(monthName);
                        let tableRow = document.createElement("tr");
                        tableRow.id = "tabler" + monthNumber;
                        document.getElementById("MonthDiv" + monthNumber).appendChild(tableRow);


                        AddWeekNamesToTable(monthNumber);

                        AddBlankDays(weekNumber, monthNumber);
                    }

                }
            }

            let day = document.createElement("td");
            day.id = "Day";
            day.innerText = dayNumber;
            day.addEventListener("click", clickDay);
            document.getElementById("MonthDiv" + monthNumber).appendChild(day);
        }
        isCalendarDrawn = true;
    }
}




function CreateEventOnMessage(data) {
    let slider = document.getElementsByClassName('slider-parent')[0];


    let eventTag = document.getElementById("event")
    eventTag.innerHTML = "<h1 id='Title'></h1><a href='#' class='DeleteEvent'>Delete Event</a><p id='Date'></p><p id='Occurance'></p><p class='Description'></p>";

    let deleteButton = document.getElementsByClassName('DeleteEvent')[0];
    let title = document.getElementById("Title");
    let date = document.getElementById("Date");
    let occurance = document.getElementById("Occurance");
    let description = document.getElementsByClassName("Description")[0];


    data = JSON.parse(data);
    let day = data.EventDay;
    let month = data.EventMonth;
    let year = data.EventYear;

    slider.setAttribute("day", day);
    slider.setAttribute("month", month);


    let monthDiv = document.getElementById("MonthDiv" + month);
    let childIndex = -1;

    if (year == CurrentYear || year == -1) {
        for (let i = 0; i < monthDiv.childElementCount; i++) {
            if (monthDiv.children[i].innerHTML == day) {
                childIndex = i;
            }
        }
    }

    if (monthDiv.children[childIndex].getAttribute("event") !== "Created") {
        title.innerText = data.EventTitle;
        date.innerText = "Date: " + GetDayNumberWithOrdinal(data.EventDay) + " of " + MonthsOfTheYear[parseInt(data.EventMonth)];
        occurance.innerText = data.IsAnnual ? "Occurs Annually" : "Occurs Once";
        description.innerText = data.EventDescription;
        deleteButton.setAttribute("onClick", "sendDeleteEvent(this)");
        deleteButton.setAttribute("EventID", data.EventID);

        slider.classList.add("active");
        monthDiv.children[childIndex].setAttribute("event", "Created");
    } else {
        let oldDescriptions = document.getElementsByClassName("Description");
        let oldDescription = oldDescriptions[oldDescriptions.length - 1];



        let otherTitle = document.createElement("h1");
        otherTitle.id = "Title";
        otherTitle.innerText = data.EventTitle;
        oldDescription.appendChild(otherTitle);

        let deleteEvent = document.createElement("a");
        deleteEvent.className = "DeleteEvent";
        deleteEvent.setAttribute("onClick", "sendDeleteEvent(this)");
        deleteEvent.setAttribute("EventID", data.EventID);
        deleteEvent.innerHTML = "Delete Event";
        deleteEvent.href = "#";
        otherTitle.parentNode.appendChild(deleteEvent);

        let otherOccurance = document.createElement("p");
        otherOccurance.id = "Occurance";
        otherOccurance.innerText = data.IsAnnual ? "Occurs Annually" : "Occurs Once";
        otherTitle.parentNode.appendChild(otherOccurance);

        let otherDescription = document.createElement("p");
        otherDescription.className = "Description";
        otherDescription.innerText = data.EventDescription;
        otherOccurance.appendChild(otherDescription);

    }

    monthDiv.children[childIndex].setAttribute("event", "");
}



function sendDeleteEvent(deleteButton) {
    let slider = document.getElementsByClassName('slider-parent')[0];
    let day = slider.getAttribute("day");
    let month = slider.getAttribute("month")

    let eventID = deleteButton.getAttribute("EventID");
    if (userRole !== "") {
        let json = JSON.stringify({ "Day": day, "Month": month, "ID": eventID });
        let confirmr = confirm("Are you sure you want to delete this event?")
        if (confirmr) {
            socket.send("DeleteEvent " + json + ",,," + localStorage.getItem("guid"))

            if (slider.classList.contains("active")) {
                slider.classList.remove("active");
            } else {
                slider.classList.add("active");
            }
        }
    } else {
        alert("You need to be logged into delete an event");
    }

}

function clickDay(e) {

    let day = e.target.innerText;
    let month = e.target.parentElement.id.replace(/([a-z]|[A-Z])/g, '');


    socket.send("GetEvent:" + day + ',' + month + '.' + CurrentYear);
}

function AddBlankDays(weekNumber, monthNumber) {
    if (weekNumber != 0) {
        for (let j = weekNumber; j > 0; j--) {
            let day = document.createElement("td");
            day.id = "Day";
            document.getElementById("MonthDiv" + monthNumber).appendChild(day);
        }
    }
}

function AddWeekNamesToTable(monthNumber) {
    for (let i = 0; i < daysOfTheWeek.length; i++) {
        let dayNames = document.createElement("th");
        dayNames.innerHTML = "<p>" + daysOfTheWeek[i] + "</p>";
        document.getElementById("tabler" + monthNumber).appendChild(dayNames);
    }
}


function SendWithGUID(message) {
    socket.send(message + ",,," + localStorage.getItem("guid"));
}

function GetDayNumberWithOrdinal(dayNumber) {
    dayNumber = parseInt(dayNumber);
    let lastDigitOfDay = parseInt(dayNumber.toString().split('').pop());
    let dayPlusOrdinal = '';
    if (dayNumber > 10 && dayNumber < 14) {
        switch (lastDigitOfDay) {
            case 1:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 2:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 3:
                dayPlusOrdinal = dayNumber + 'th';
                break;
        }
    } else {
        switch (lastDigitOfDay) {
            case 0:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 1:
                dayPlusOrdinal = dayNumber + 'st';
                break;
            case 2:
                dayPlusOrdinal = dayNumber + 'nd';
                break;
            case 3:
                dayPlusOrdinal = dayNumber + 'rd';
                break;
            case 4:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 5:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 6:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 7:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 8:
                dayPlusOrdinal = dayNumber + 'th';
                break;
            case 9:
                dayPlusOrdinal = dayNumber + 'th';
                break;
        }
    }
    return dayPlusOrdinal;
}