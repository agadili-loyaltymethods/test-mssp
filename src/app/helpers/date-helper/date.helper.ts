import { Utils } from "../../classes/utils/utils";

export class DateHelper {

    static getCurrentTimeWithZeroSeconds(date: Date = new Date()){
        const d = new Date(date);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }

    static formatDate(d: Date) {
        const month = d.getMonth() + 1;
        return `${d.getFullYear()}-${Utils.addLeadingZero(month)}-${Utils.addLeadingZero(d.getDate())}`;
    }

    static convertToMinutes(hourMinutes: string): number {
        var splitHours = hourMinutes.split(":");
        return Number(splitHours[0]) * 60 + Number(splitHours[1])
    }

    static getHourMinutes(d: Date){
        return `${Utils.addLeadingZero(d.getHours())}:${Utils.addLeadingZero(d.getMinutes())}:00.000Z`
    }

}
