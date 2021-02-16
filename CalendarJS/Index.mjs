import WebSocket from './ws/index.js';
import FileHander from './FileHandler.js';
import User from './User.js';

const wss = new WebSocket.Server({
    port: 8080,
});
var fileHander = new FileHander();
var calendar = fileHander.ReadCalendarFromFile("Exandria");
var Events = fileHander.ReadEventsFromFile("Events");
var Users = [];

//fileHander.SaveEventsToFile(Events,"Events");


wss.on('connection', (ws) => {

    SendCalendarData(ws);

    ws.on('close', (data) => {
        fileHander.SaveCalendarToFile(calendar, calendar.CalendarName);
    });

    ws.on('message', (data) => {
        if (Users.length > 0) {
            let user = Users.find(element => element.UserClient === wss.client);
            if (user.UserRole === "DM") {

                if (data === 'NextDay') {
                    calendar.ProgressOneDay();
                } else if (data.includes("RewindDay")) {
                    calendar.RewindOneDay();
                } else if (data.includes("HopBack")) {
                    calendar.RewindDays(data.replace('HopBack', ''));
                } else if (data.includes("HopDay")) {
                    calendar.ProgressDays(data.replace('HopDay', ''));
                } else if (data.includes("SetDay")) {
                    calendar.SetDayOfCurrentMonth(data.replace('SetDay', ''));
                } else if (data.includes("SetMonth")) {
                    calendar.SetMonth(data.replace('SetMonth', ''));
                } else if (data.includes("SetYear")) {
                    calendar.SetYear(data.replace('SetYear', ''));
                } else if (data.includes("GetEvent")) {
                    let date = data.replace("GetEvent:", '');
                    let annualDate = date.replace(/(\.[0-9]+)/g, ".-1");
                    for (let i = 0; i < Events.length; i++) {
                        let event = Events[i];
                        if (event.GetEventDate() === date || event.GetEventDate() === annualDate) {
                            ws.send("EventData:" + JSON.stringify(event));
                        }

                    }
                }
            }
        }
        if (data.startsWith("Login:")) {
            let userAndCode = data.replace("Login:", '');
            let userName = userAndCode.replace(/(\.[a-z0-9]+)/gi, '');
            let userCode = userAndCode.replace(/([a-z0-9]+\.)/gi, '');
            var user = fileHander.ReadUserFromFile(userName, userCode);

            if (user !== -1) {
                ws.send("Welcome " + user.UserName);
                user.SetUserClient(wss.client);
                Users.push(user);
            } else {
                ws.send("Login Unsuccessful");
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

