/* eslint-disable radix */
// @flow
import moment from 'moment';

/**
 * Zero pad
 * @param string
 * @param pad
 * @param length
 * @returns {string}
 */
export const padLeft = (
    string: string | number,
    pad: string,
    length: number
) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
};

/**
 * Seconds to minutes string
 * @param time:int
 */
export const seconds = {
    toMinutesString: (time: number) => {
        const min: number = Math.floor(time / 60);
        const sec: number = time % 60;
        return `${padLeft(min, '0', 2)}:${padLeft(sec, '0', 2)}`;
    },

    toMinutes: (time: number) => {
        const min: number = Math.floor(time / 60);
        return padLeft(min, '0', 2);
    },

    toRemSeconds: (time: number) => {
        const sec = time % 60;
        return padLeft(sec, '0', 2);
    }
};

/**
 * Minutes to seconds
 * @param time:int
 */
export const minutes = {
    toSeconds: (min: number, sec: number = 0) => {
        const hMin = min ? parseInt(min) * 60 : 0;
        const hSec = sec ? parseInt(sec) : 0;
        return hMin + hSec;
    },

    toHours: (timer: number) => {
        let time = timer;
        if (time < 0) {
            time = Math.abs(time);
        }

        const hours = Math.floor(time / 60);
        const mins = time % 60;

        return {
            hours,
            minutes: mins
        };
    },

    toHoursString: (timer: number) => {
        let time = timer;
        let label = '';

        if (time < 0) {
            time = Math.abs(time);
            label = '-';
        }

        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${label}${padLeft(min, '0', 2)}:${padLeft(sec, '0', 2)}:00`;
    }
};

/**
 * Minutes to seconds
 * @param time:int
 */
export const hours = {
    toMinutes: (hrs: number | string, min: number | string = 0) => {
        const hSec = hrs ? parseInt(hrs) * 60 : 0;
        const hMin = min ? parseInt(min) : 0;

        return hSec + hMin;
    }
};

/**
 * Datetime to string methods
 */
export const datetime = {
    /**
     * Get a string 'YYYY-MM-DD' formatted, representating the date parameter or now
     * @param date: Date
     */
    toFormattedString: (date: Date = moment()) => {
        const now = moment(date);
        return now.format('YYYY-MM-DD');
    },

    toFormattedStringFiltered: (filter: string, date: Date = moment()) => {
        const now = moment(date);
        if (filter === 'today') return datetime.toFormattedString(now);
        const filterNumber = Math.abs(parseInt(filter, 10));

        now.subtract(filterNumber, 'days');

        return datetime.toFormattedString(now);
    },

    equals: (firstToCompare: Date, secondToCompare: Date) => {
        return moment(firstToCompare).isSame(moment(secondToCompare));
    },

    scheduleDateDisplay: (startDate: Date, endDate: Date) => {
        const start = moment(new Date(startDate));
        const end = moment(new Date(endDate));

        const singleDay = start.startOf('day').isSame(end.startOf('day'));

        if (!singleDay)
            return `${moment(new Date(startDate)).format('D MMM')} - ${moment(
                new Date(endDate)
            ).format('D MMM')}`;
        return `${moment(new Date(startDate)).format('D MMM')}`;
    },

    scheduleTimeDisplay: (startDate: Date, endDate?: Date) => {
        if (!endDate) return `${moment(new Date(startDate)).format('h:mm a')}`;

        const startTime = moment(new Date(startDate)).format('h:mm a');
        const endTime = moment(new Date(endDate)).format('h:mm a');

        if (startTime !== endTime)
            return `${moment(new Date(startDate)).format('h:mm a')} - ${moment(
                new Date(endDate)
            ).format('h:mm a')}`;
        return `${moment(new Date(startDate)).format('h:mm a')}`;
    }
};
