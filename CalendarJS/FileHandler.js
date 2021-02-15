class FileHander {

    SaveCalendarToFile(calendar,fileName){
        let fs = require('fs');
        let dir ="./calendars/";
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
        let contents = JSON.stringify(calendar);
        fs.writeFile(dir+fileName+".txt",contents, function (err){
            if(err){
                console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    ReadCalendarFromFile(fileName){
        let fs = require('fs');
        let Calendar = require('./Calendar.js')
        let dir ="./calendars/";
        
        let data = fs.readFileSync(dir+fileName+".txt");
        let json = JSON.parse(data);
        return new Calendar(json.CalendarName,json.CurrentYear,json.DaysInMonths,json.MonthsInYear,json.DaysInYear,json.MonthNames,json.DayNames,json.DaysInWeek,json.MonthDays,json.LeapYearMonths,json.CurrentDay);
        
    }

    SaveEventsToFile(events,fileName){
        let fs = require('fs');
        let dir ="./events/";
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
        let contents = JSON.stringify(events);
        fs.writeFile(dir+fileName+".txt",contents, function (err){
            if(err){
                console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    ReadEventsFromFile(fileName){
        let fs = require('fs');
        let Event = require('./Event.js')
        let dir ="./events/";
        
        let data = fs.readFileSync(dir+fileName+".txt");
        let json = JSON.parse(data);
        let events = [];
        for (let i = 0; i < json.length; i++) {
            let jsonEle = json[i];
            events.push(new Event(jsonEle.EventTitle,jsonEle.EventDescription,jsonEle.EventDay,jsonEle.EventMonth,jsonEle.IsAnnual,jsonEle.EventYear));
            
        }
        return events;
    }
}

module.exports = FileHander;