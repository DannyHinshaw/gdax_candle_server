import * as moment from 'moment';
import {TradeMessage} from 'gdax-trading-toolkit/build/src/core';
import {roundToCurrentMinute, roundToCurrentMinuteMS} from '../utils/time';


let CURRENT_CANDLE: number[] = [];
export const candles: number[][] = [];

export const closeCandle = () => {
	candles.push(CURRENT_CANDLE);
	return CURRENT_CANDLE = [];
};

/**
 * Test if the current trade belongs to the previous minute candle.
 * @param ts - TradeMessage timestamp (in ms).
 * @returns {boolean}
 */
const isLatent = (ts: number) => {
	const curr: number = roundToCurrentMinuteMS(+new Date());

	if (ts < curr) console.log('Latency (if negative):: ', curr - ts);

	return CURRENT_CANDLE.length && ts < curr;
};

/**
 * Amend the last candle in running history,
 * @param payload
 * @returns {number}
 */
const amendCandle = (payload) => {
	const lastCandle: number[] = candles.pop();
	return candles.push(updateCandle(lastCandle, payload));
};

/**
 * Maintain the current running minute candle.
 * @param payload
 * @returns {number[]}
 */
const maintainCandle = (payload) => {
	return CURRENT_CANDLE = updateCandle(CURRENT_CANDLE, payload);
};

/**
 * Create an updated or new minute candle.
 * @param {number[]} cc - The current candle to update.
 * @param {any} time
 * @param {any} price
 * @param {any} size
 * @returns {number[]}
 */
export const updateCandle = (cc: number[], {time, price, size}) => {
	const returnCandle: number[] = [

		// time
		roundToCurrentMinute(cc.length ? cc[0] : time),

		// low
		cc.length
			? cc[1] > price ? price : cc[1]
			: price,

		// high
		cc.length
			? cc[2] < price ? price : cc[2]
			: price,

		// open
		cc.length ? cc[3] : price,

		// close
		price,

		// volume
		cc.length ? cc[5] += size : cc[5]
	];

	console.log('time::', time);
	console.log('price::', price);
	console.log('price::', size);
	console.log(returnCandle);

	return returnCandle;
};

/**
 * Route the data to the proper candle handler function.
 * @param {TradeMessage} msg
 */
export const candleSwitch = (msg: TradeMessage) => {
	const ts   : number = moment(msg.time).valueOf();
	const time : number = ts / 1000;
	const price: number = +msg.price;
	const size : number = +msg.size;
	const payload: any = {time: time, price: price, size: size};

	return isLatent(ts)
		? amendCandle(payload)
		: maintainCandle(payload);
};