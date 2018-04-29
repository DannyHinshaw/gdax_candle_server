import * as moment from 'moment';
import {TradeMessage} from 'gdax-trading-toolkit/build/src/core';
import {roundToCurrentMinute, roundToCurrentMinuteMS} from '../utils/time';
import {logger} from '../utils/logger';


let CURRENT_CANDLE: number[] = [];
const candles: number[][] = [];

/**
 * Return uncached candles history.
 * @returns {number[][]}
 */
export const getCandles = (): number[][] => {
	return candles;
};

/**
 * Close out the current minute candle and ready state for next.
 */
export const closeCandle = () => {
	// Only store 30 days max
	if (candles.length > 43200) candles.shift();

	candles.push(CURRENT_CANDLE);
	CURRENT_CANDLE = [];

	return logger.log('info', `CurrentCandle: ${CURRENT_CANDLE}`);
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
 * Create an updated or new minute candle.
 * @param {number[]} cc - The current candle to update.
 * @param {any} time
 * @param {any} price
 * @param {any} size
 * @returns {number[]}
 */
const updateCandle = (cc: number[], {time, price, size}) => {
	const returnCandle: number[] = [

		// time
		cc.length ? cc[0] : roundToCurrentMinute(time),

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
		cc.length && cc[5] ? cc[5] + size : size
	];
	console.log(returnCandle);

	return returnCandle;
};

/**
 * Amend the last candle in running history,
 * @param payload
 * @returns {number}
 */
const amendCandle = (payload) => {
	const lastCandle: number[] = candles[candles.length - 1];
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
 * Route the data to the proper candle handler function.
 * @param {TradeMessage} msg
 */
export const candleSwitch = (msg: TradeMessage) => {
	const ts   : number = moment(msg.time).valueOf();
	const time : number = moment(msg.time).unix();
	const price: number = +msg.price;
	const size : number = +msg.size;
	const payload: any = {time: time, price: price, size: size};

	return isLatent(ts)
		? amendCandle(payload)
		: maintainCandle(payload);
};