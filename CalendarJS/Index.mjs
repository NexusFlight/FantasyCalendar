import WebSocket from './ws/index.js';
import Calendar from './Calendar.js';

const wss = new WebSocket.Server({
    port:8080,
});
var calendar = new Calendar();

wss.on('connection', (ws) => {
    ws.send(calendar.GetCurrentDayAndMonth());
    ws.send("Days:"+calendar.GetDaysOfTheWeek());
    
    ws.send("Months:"+calendar.GetMonthsOfTheYear());
    ws.send(calendar.GetDayMonth());

    ws.send("CurrentDate:"+calendar.GetDayMonthNumber());

    ws.on('message', (data) => {
            if(data === 'NextDay'){
                calendar.ProgressOneDay();
            }else if (data.includes("RewindDay")){
                calendar.RewindOneDay();
            }else if (data.includes("HopBack")){
                calendar.RewindDays(data.replace('HopBack',''));
            }else if (data.includes("HopDay")){
                calendar.ProgressDays(data.replace('HopDay',''));
            }else if (data.includes("SetDay")){
                calendar.SetDayOfCurrentMonth(data.replace('SetDay',''));
            }else if (data.includes("SetMonth")){
                calendar.SetMonth(data.replace('SetMonth',''));
            }else if (data.includes("SetYear")){
                calendar.SetYear(data.replace('SetYear',''));
            }
            
        
            wss.clients.forEach((client) => {
                client.send(calendar.GetCurrentDayAndMonth());
                client.send(calendar.GetDayMonth());
                client.send("CurrentDate:"+calendar.GetDayMonthNumber());
            });
       
    });
});

