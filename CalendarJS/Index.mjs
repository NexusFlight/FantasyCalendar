import WebSocket from './ws/index.js';
import FileHander from './FileHandler.js';

const wss = new WebSocket.Server({
    port: 8080,
});
var fileHander = new FileHander();
var calendar = fileHander.ReadCalendarFromFile("Exandria");
var Events = fileHander.ReadEventsFromFile("Events");

//fileHander.SaveEventsToFile(Events,"Events");


wss.on('connection', (ws) => {
    ws.send(calendar.GetCurrentDayAndMonth());
    ws.send("Days:" + calendar.GetDaysOfTheWeek());
    ws.send("Months:" + calendar.GetMonthsOfTheYear());
    ws.send(calendar.GetDayMonth());
    ws.send("CurrentDate:" + calendar.GetDayMonthNumber());
    ws.send("Year:" + calendar.CurrentYear);
    for (let i = 0; i < Events.length; i++) {
        ws.send("EventDate:" + Events[i].GetEventDate());
    }


    ws.on('message', (data) => {
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
            let annualDate = date.replace(/(\.[0-9]+)/g,".-1");
            for (let i = 0; i < Events.length; i++) {
                let event = Events[i];
                if(event.GetEventDate() === date || event.GetEventDate()=== annualDate){
                    ws.send("EventData:"+JSON.stringify(event));
                }
                
            }
        }
        fileHander.SaveCalendarToFile(calendar,calendar.CalendarName);


        wss.clients.forEach((client) => {
            client.send(calendar.GetCurrentDayAndMonth());
            client.send(calendar.GetDayMonth());
            client.send("CurrentDate:" + calendar.GetDayMonthNumber());
            client.send("Year:" + calendar.CurrentYear);
            for (let i = 0; i < Events.length; i++) {
                client.send("EventDate:" + Events[i].GetEventDate());
            }
        });

    });
});

