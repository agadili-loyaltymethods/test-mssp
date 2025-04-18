import { GeneralConstants } from "../../constants/general-constants";

export class Utils {
    static addLeadingZero(val: number): string {
        return val <= 9 ? `0${val}` : val.toString();
    }
    static calculateTax(val: string = '0') {
        const taxAmount = Number(val) * GeneralConstants.taxPercentage / 100;
        return taxAmount > 5 ? taxAmount : GeneralConstants.minTaxAmount;
    }
    static convertToNumber(val?: string | number): number {
        return val ? Number(val) : 0;
    }
    static getUid() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    static generateRandomPNR() {
        let pnr = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const pnrLength = 6;
        for (let i = 0; i < pnrLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            pnr += characters[randomIndex];
        }
        return pnr;
    }

    static getCurrentYear() {
        return new Date().getFullYear();
    }

    static getDateWeek(date = new Date()) {
        const currentDate = date;
        const januaryFirst =
            new Date(currentDate.getFullYear(), 0, 1);
        const daysToNextMonday =
            (januaryFirst.getDay() === 1) ? 0 :
                (7 - januaryFirst.getDay()) % 7;
        const nextMonday =
            new Date(currentDate.getFullYear(), 0,
                januaryFirst.getDate() + daysToNextMonday);

        return (currentDate < nextMonday) ? 52 :
            (currentDate > nextMonday ? Math.ceil(
                (+currentDate - +nextMonday) / (24 * 3600 * 1000) / 7) : 1);
    }
}
