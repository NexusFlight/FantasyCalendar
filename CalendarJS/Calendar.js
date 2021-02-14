class Calendar {
    constructor() {
        this.CurrentYear = 1;
        this.DaysInMonths = [29, 30, 30, 31, 28, 31, 32, 29, 27, 29, 32]
        this.MonthsInYear = this.DaysInMonths.length;
        this.DaysInYear = this.DaysInMonths.reduce((a, b) => { return a + b; }, 0);
        this.MonthNames = ['Horisal', 'Misuthar', 'Dualahei', 'Thunsheer', 'Unndilar', 'Brussendar', 'Sydenstar', 'Fessuran', 'Quen\'pillar', 'Cuersaar', 'Duscar'];
        this.DayNames = ['Miresen', 'Crissen', 'Whelsen', 'Conthsen', 'Folson', 'Yulisen', 'Da\'leysen'];
        this.DaysInWeek = this.DayNames.length;
        this.MonthDays = [];
        this.LeapYearMonths = [];

        this.CurrentDay = 1;

        this.SetMonthDays();
    }


    SetMonthDays(firstDayofYear) {

        let trackedDays = 0;
        for (let i = 0; i < this.MonthsInYear; i++) {

            if (typeof LeapYearMonths !== 'undefined' && this.CurrentYear % this.LeapYearMonths[0][0] == 0 && i == this.LeapYearMonths[0][1] - 1) {
                for (let j = 0; j < this.LeapYearMonths[0][2]; j++) {
                    if (typeof firstDayofYear !== 'undefined') {
                        this.MonthDays.push([(trackedDays + firstDayofYear) % this.DaysInWeek, i]);
                    } else {
                        this.MonthDays.push([trackedDays % this.DaysInWeek, i]);
                    }
                    trackedDays++;
                }
            } else {
                for (let j = 0; j < this.DaysInMonths[i]; j++) {
                    if (typeof firstDayofYear !== 'undefined') {
                        this.MonthDays.push([(trackedDays + firstDayofYear) % this.DaysInWeek, i]);
                    }
                    else {
                        this.MonthDays.push([trackedDays % this.DaysInWeek, i]);
                    }
                    trackedDays++;
                }
            }
        }
    }

    SetYear(newYear) {
        newYear = parseInt(newYear);
        this.CurrentYear = newYear;
        let totalLeaps = 0;
        if (typeof LeapYearMonths !== 'undefined') {
            totalLeaps = Math.floor(newYear / this.LeapYearMonths[0][0]);
        }
        let sumOfDays = (this.DaysInYear * newYear) + totalLeaps;
        sumOfDays -= this.DaysInYear;
        this.MonthDays = [];
        let firstDayOfYear = sumOfDays % (this.DaysInWeek);

        this.SetMonthDays(firstDayOfYear);
    }

    GetCurrentDay() {
        return this.DayNames[this.MonthDays[this.CurrentDay - 1][0]];
    }

    GetDayMonthNumber(){
        return this.GetDayNumberFromCurrentDay()+','+this.MonthDays[this.CurrentDay - 1][1];
    }

    GetDayNumberFromCurrentDay() {
        return this.GetDayFromNumber(this.CurrentDay);
    }

    GetDayFromNumber(dayNumber){
        let monthDayTotal = this.DaysInMonths[0];
        let finalIndex = -1;
        if (dayNumber <= this.DaysInMonths[0]) {
            return dayNumber;
        } else {
            for (let i = 1; dayNumber > monthDayTotal; i++) {
                monthDayTotal += this.DaysInMonths[i];
                finalIndex = i;
            }

            return this.DaysInMonths[finalIndex] - (monthDayTotal - dayNumber);
        }
    }

    GetDayNumberWithOrdinal(){
        let dayNumber = this.GetDayNumberFromCurrentDay();
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

    GetCurrentDayAndMonth() {
        return "Date:"+this.GetCurrentDay() + " The " + this.GetDayNumberWithOrdinal() + " of " + this.MonthNames[this.MonthDays[this.CurrentDay - 1][1]]+" of Year "+this.CurrentYear;
    }

    RewindOneDay(){
        
        this.CurrentDay -= 1;
        

        if (this.CurrentDay <= 0 && this.CurrentYear > 1) {
            this.CurrentYear -= 1;
            this.CurrentDay = this.DaysInYear;
            this.SetYear(this.CurrentYear);
        } else if (this.CurrentYear == 1 && this.CurrentDay == 0){
            this.CurrentDay = 1;
        }
    }

    RewindDays(days){
        days = parseInt(days);
        for (let i = 0; i < days; i++) {
            this.RewindOneDay();
        }
    }

    ProgressOneDay() {
        this.CurrentDay += 1;
        if (this.CurrentDay > this.DaysInYear) {
            this.CurrentYear += 1;
            this.CurrentDay = 1;
            this.SetYear(this.CurrentYear);
        }
    }

    ProgressDays(days) {
        days = parseInt(days);
        for (let i = 0; i < days; i++) {
            this.ProgressOneDay();
        }
    }

    SetDayOfCurrentMonth(day){
        let currentDay = this.GetDayNumberFromCurrentDay();
        day = parseInt(day);
        if(day < 0){
            return;
        }
        if(day < currentDay){
            this.CurrentDay -= currentDay-day;
        }else if (day > currentDay){
            this.CurrentDay += day-currentDay;
        }
    }

    SetMonth(month){
        month = parseInt(month)-1;
        let currentMonth = this.MonthDays[this.CurrentDay - 1][1];
        if(month > currentMonth){

            for (let i = currentMonth; i < month; i++) {
                this.CurrentDay += this.DaysInMonths[i];
                
            }
        }else if (month < currentMonth){

            for (let i = currentMonth; i > month ; i--) {
                this.CurrentDay -= this.DaysInMonths[i];
            }
        }
        //Fixes random moments when currentday goes to -1
        if(this.CurrentDay <= 0){
            this.CurrentDay = 1;
        }
    }

    GetDaysOfTheWeek(){
        return this.DayNames;
    }

    GetMonthsOfTheYear(){
        return this.MonthNames;
    }

    GetDayMonth(){
        let formatted = 'Calendar:';

        for (let i = 1; i <= this.MonthDays.length; i++) {
            
            if(i > 2 && this.MonthDays[i-1][1] > this.MonthDays[i-2][1]){
                formatted += '\n\n';
            }
            formatted += this.GetDayFromNumber(i)+'.'+ this.MonthDays[i-1][0]+','; //Day number, Week day
            if(this.MonthDays[i-1][0] == this.DaysInWeek-1){
                formatted += '\n';
            }
        }
        
        return formatted;
    }
}
module.exports = Calendar;








