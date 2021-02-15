import WebSocket from './ws/index.js';
import Calendar from './Calendar.js';
import Event from './Event.js';

const wss = new WebSocket.Server({
    port: 8080,
});
var calendar = new Calendar();
var Events = [];

Events.push(new Event('New Dawn', 'Celebration of the dawn of a new year', 1, 0, true));
Events.push(new Event('Hillsgold', 'The passing of the light over the golden hills', 27, 0, true));

Events.push(new Event('Day of Challenging', 'FIGHT!', 7, 1, true));

Events.push(new Event('Renewal Festival', 'The festival marking the start of spring', 13, 2, true));
Events.push(new Event('Wild\'s Grandeur', 'Witness the Magjesty of nature!', 20, 2, true));

Events.push(new Event('Harvest\'s Ride', '', 11, 3, true));
Events.push(new Event('Merryfrond\'s Day', 'This is a couple of lines of text just to test the box', 31, 3, true));
Events.push(new Event('Andrews Day', 'This is a couple of lines of text just to test the box', 31, 3, true));
Events.push(new Event('france Day', 'This is a couple of lines of text just to test the box', 31, 3, false, 1));


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

