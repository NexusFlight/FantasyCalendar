import WebSocket from './ws/index.js';
import FileHander from './FileHandler.js';
import User from './User.js';
import Event from './Event.js';
import { Guid } from 'js-guid';

const wss = new WebSocket.Server({
    port: 8080,
});
var fileHander = new FileHander();
var calendar = fileHander.ReadCalendarFromFile("Exandria");
var Events = fileHander.ReadEventsFromFile("Events");
var Users = [];

wss.on('connection', (ws) => {

    SendCalendarData(ws);

    ws.on('close', (data) => {
        fileHander.SaveCalendarToFile(calendar, calendar.CalendarName);
    });

    ws.on('message', (data) => {
        let guid = data.replace(/(.+,,,)/gi, "");
        let location = data.indexOf(guid);
        if (location != 0) {
            data = data.substring(0, location - 3);
        }
        if (Users.length > 0) {

            let user = Users.find(element => element.UserClient === guid);

            if (typeof user !== "undefined" && user.IsUserDM()) {

                if (data === 'NextDay') {
                    calendar.ProgressOneDay();
                } else if (data.startsWith("RewindDay")) {
                    calendar.RewindOneDay();
                } else if (data.startsWith("HopBack")) {
                    calendar.RewindDays(data.replace('HopBack', ''));
                } else if (data.startsWith("HopDay")) {
                    calendar.ProgressDays(data.replace('HopDay', ''));
                } else if (data.startsWith("SetDay")) {
                    calendar.SetDayOfCurrentMonth(data.replace('SetDay', ''));
                } else if (data.startsWith("SetMonth")) {
                    calendar.SetMonth(data.replace('SetMonth', ''));
                } else if (data.startsWith("SetYear")) {
                    calendar.SetYear(data.replace('SetYear', ''));
                }

            }
            if (typeof user !== "undefined" && (user.IsUserPlayer() || user.IsUserDM())) {
                console.log(user);
                if (data.startsWith("CreateEvent")) {
                    var json = JSON.parse(data.replace('CreateEvent', ''));
                    Events.push(new Event(json.EventTitle, json.EventDescription, json.EventDay, json.EventMonth, json.IsAnnual, json.EventYear));
                    fileHander.SaveEventsToFile(Events, "Events");
                } else if (data.startsWith("CheckLogin")) {
                    let user = Users.find(element => element.UserClient === guid);
                    if (typeof user !== "undefined") {
                        ws.send("Login Successful.." + user.UserRole + "," + user.UserClient);
                    }
                }
            }
        }
        if (data.startsWith("Login")) {
            let userAndCode = data.replace("Login", '');
            if (userAndCode !== ".") {
                let userName = userAndCode.replace(/(\.[a-z0-9]+)/gi, '');
                let userCode = userAndCode.replace(/([a-z0-9]+\.)/gi, '');

                if (userName !== "" && userCode !== "") {
                    var user = fileHander.ReadUserFromFile(userName, userCode);

                    if (user !== -1) {
                        user.SetUserClient(Guid.newGuid().toString());
                        Users.push(user);
                        ws.send("Login Successful.." + user.UserRole + "," + user.UserClient);
                    } else {
                        ws.send("Login Unsuccessful.");
                    }
                }
            }
        } else if (data.startsWith("LogOut")) {
            let user = Users.find(element => element.UserClient === guid);
            let status = -1;
            if (typeof user !== "undefined") {
                let index = Users.indexOf(user);
                status = Users.splice(index, 1);
            }
            if (status.length !== 0 && status != -1) {
                ws.send("Logout Successful.");
            } else {
                ws.send("Logout Unsuccessful.");
            }
        } else if (data.startsWith("GetEvent")) {
            let date = data.replace("GetEvent:", '');
            let annualDate = date.replace(/(\.[0-9]+)/g, ".-1");
            let eventSent = false;
            for (let i = 0; i < Events.length; i++) {
                let event = Events[i];
                if (event.GetEventDate() === date || event.GetEventDate() === annualDate) {
                    ws.send("EventData:" + JSON.stringify(event));
                    eventSent = true;
                }

            }
            if (!eventSent) {
                let day = date.replace(/(,[0-9]+\.[A-Z]+)/gi, "");
                let month = date.replace(/([0-9]+,)/g, "").replace(/(\.[A-Z]+)/gi, "");


                ws.send("EventData:" + JSON.stringify({ "EventTitle": "No Events", "EventDescription": "Use the Button at the top to add a new event", "EventDay": day, "EventMonth": month, "EventYear": -1, "IsAnnual": false }));

            }
        }

        wss.clients.forEach((client) => {
            SendCalendarData(client);
        });

    });
});

function SendCalendarData(client) {
    client.send(calendar.GetCurrentDayAndMonth());
    client.send("Days:" + calendar.GetDaysOfTheWeek());
    client.send("Months:" + calendar.GetMonthsOfTheYear());
    client.send(calendar.GetDayMonth());
    client.send("CurrentDate:" + calendar.GetDayMonthNumber());
    client.send("Year:" + calendar.CurrentYear);
    for (let i = 0; i < Events.length; i++) {
        client.send("EventDate:" + Events[i].GetEventDate());
    }
}