import * as moment from 'moment';
import {Moment} from 'moment';

/* Time related functions */

/**
 * Utility function to convert timestamp to date.
 * @param {number} ts - Timestamp in seconds.
 * @returns {Date} - JavaScript Date object for timestamp.
 */
export const tsToDate = (ts: number): Date => new Date(ts*1000);

/**
 * Takes a Moment time object, subtracts n seconds and returns the result in ISO format.
 * @param {moment.Moment} t - Time to subtract from.
 * @param {number} s - Seconds to subtract.
 * @returns {string} - ISO string of time - n seconds.
 */
export const subSecondsToISO = (t: Moment, s: number): string => t.subtract(s, 'seconds').toISOString();

/**
 * Tests a timestamp to see if it is within the current running minute.
 * @param {number} time - Unix timestamp or time string.
 * @returns {boolean} - True if ts in current minute, else false.
 */
export const isCurrentMinute = (ts: number): boolean => {
	const now        = moment().unix();
	const currMinute = now - (now % 60);

	return ts > currMinute && ts < currMinute + 60;
};

/**
 * Takes a unix timestamp and rounds it down to the currently running minute.
 * @param {number} unixTS - Unix timestamp
 * @returns {number} - Unix timestamp rounded down to current minute.
 */
export const roundToCurrentMinute = (unixTS: number) => Math.floor((unixTS - 1) / 60) * 60;

/**
 * Takes a millisecond unix timestamp and rounds it down to the currently running minute.
 * @param {number} unixTS - Unix timestamp
 * @returns {number} - Unix timestamp rounded down to current minute.
 */
export const roundToCurrentMinuteMS = (unixTS: number) => Math.floor((unixTS - 1) / 600000) * 600000;

/**
 * Takes a 2D candles array and groups them by days.
 * @param {number[][]} candles - 2D candles data array (items have unix timestamps in first position).
 * @returns {number[][][]} - 3D array[days][candles][candleData].
 */
export const groupCandleDays = (candles: number[][]): number[][][] => {
	// Defaults
	let position : number       = 0; // Represents day in newArr by array index (position).
	let currDay  : Date         = tsToDate(candles[0][0]);
	const newArr : number[][][] = [[]];

	for (let i: number = 0; i < candles.length; i++) {

		// If ever checking data for more that 12 months this will need adjusted.
		const day    : Date    = tsToDate(candles[i][0]);
		const sameDay: boolean = currDay.getMonth() === day.getMonth() && currDay.getDate() === day.getDate();

		if (sameDay) {
			newArr[position].push(candles[i]);
		} else {
			position++;
			currDay = tsToDate(candles[i][0]);
			newArr.push([candles[i]]);
		}
	}
	return newArr;
};
