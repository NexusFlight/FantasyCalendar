class Event {
    constructor(title,description,day,month,isAnnual,year = -1,) {
        this.EventTitle = title;
        this.EventDescription = description;
        this.EventDay = day;
        this.EventMonth = month;
        this.EventYear = year;
        this.IsAnnual = isAnnual;
    }

    GetEventDate(){
        return this.EventDay+','+this.EventMonth+'.'+this.EventYear;
    }

}
module.exports = Event;
