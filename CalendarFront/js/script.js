let socket = new WebSocket("ws://localhost:8080");
var daysOfTheWeek = [];
var MonthsOfTheYear = [];
var DaysInYear = -1;
socket.onopen = function (e) {
    console.log("Connected to Backend");
}

socket.onmessage = function (event) {
    //console.log(event.data);
    if (typeof event.data === 'string' && event.data.startsWith('Calendar:')) {
        CreateCalendar(event.data);
    }

    if (typeof event.data === 'string' && event.data.startsWith('Date:')) {
        document.getElementById("CurrentDate").innerHTML = "The Current Date is " + event.data.replace("Date:", '');

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

    if (typeof event.data === 'string' && event.data.startsWith('Days:')) {
        daysOfTheWeek = event.data.replaceAll(',', ' ').replace('Days:', '').split(' ');
    }
    if (typeof event.data === 'string' && event.data.startsWith('Months:')) {
        MonthsOfTheYear = event.data.replaceAll(',', ' ').replace('Months:', '').split(' ');
    }
}

socket.onclose = function (e) {
    console.log("connection closed please refresh");
}

window.onload = function () {

    document.getElementById("nextDayButton").addEventListener("click", function () {
        socket.send("NextDay");
    });
    document.getElementById("rewindDayButton").addEventListener("click", function () {
        socket.send("RewindDay");
    });
    document.getElementById("setDayButton").addEventListener("click", function () {
        if(document.getElementById("DayInput").value <= DaysInYear){
        socket.send("SetDay" + document.getElementById("DayInput").value);
        }else{
            alert("Please Enter Valid Numbers!")
        }
    });

    document.getElementById("setDateButton").addEventListener("click", function () {
        if (document.getElementById("MonthInput").value <= MonthsOfTheYear.length && document.getElementById("DayInput").value <= DaysInYear && document.getElementById("YearInput").value > 0) {
            socket.send("SetYear" + document.getElementById("YearInput").value);
            socket.send("SetMonth" + document.getElementById("MonthInput").value);
            socket.send("SetDay" + document.getElementById("DayInput").value);
        }else{
            alert("Please Enter Valid Numbers!")
        }

    });
}

function CreateCalendar(data) {
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
                monthName = document.createElement("th");
                monthName.id = "MonthDiv" + monthNumber;
                monthName.innerHTML = "<p>" + MonthsOfTheYear[monthNumber] + "</p>";
                document.getElementById("CalendarTable").appendChild(monthName);

                //add the row to the month
                let tableRow = document.createElement("tr");
                tableRow.id = "tabler" + monthNumber;
                document.getElementById("MonthDiv" + monthNumber).appendChild(tableRow);


                AddWeekNamesToTable(monthNumber);

                AddBlankDays(weekNumber, monthNumber);
            }
        }

        let day = document.createElement("td");
        day.id = "Day";
        day.innerText = dayNumber;//daysOfTheWeek[parseInt(weekNumber)] + ' ' + 
        document.getElementById("MonthDiv" + monthNumber).appendChild(day);
    }
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