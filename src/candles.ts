import * as moment from 'moment';
import {TradeMessage} from 'gdax-trading-toolkit/build/src/core';
import {roundToCurrentMinute, roundToCurrentMinuteMS} from '../utils/time';


let CURRENT_CANDLE: number[] = [];
let NEXT_CANDLE: number[] = [];
const candles: number[][] = [];

interface CandlePayloadInterface {
	time: number
	price: number
	size: number
}


/**
 * Return uncached candles history with the latest current running candle.
 * @returns {number[][]}
 */
export const getCandles = (): number[][] => {
	return candles.concat([CURRENT_CANDLE]);
};

/**
 * Close out the current minute candle and ready state for next.
 */
export const closeCandle = (): any => {

	// If there's not data and it's the first candle, skip storage
	if (!CURRENT_CANDLE.length && !candles.length) return;

	// Only store 30 days max
	if (candles.length > 43200) candles.shift();

	// If no trades happen we resubmit the previous candle data with new timestamp.
	const candle: number[] = CURRENT_CANDLE.length
		? CURRENT_CANDLE
		: updateCandle([], {
			time: moment().unix() - 5, // Current time with 5 second buffer
			price: candles[candles.length - 1][4], // Last candle close price
			size: 0
		});

	candles.push(candle);

	// Reset the current candle
	if (NEXT_CANDLE && NEXT_CANDLE.length) {
		CURRENT_CANDLE = NEXT_CANDLE;
	} else {
		CURRENT_CANDLE = [];
	}
	NEXT_CANDLE = [];
};

/**
 * Create an updated or new minute candle.
 * @param {number[]} cc - The current candle to update.
 * @param {number} time
 * @param {number} price
 * @param {number} size
 * @returns {number[]}
 */
const updateCandle = (cc: number[], {time, price, size}): number[] => {
	const returnCandle: number[] = [
		roundToCurrentMinute(time),

		// low
		cc.length
			? cc[1] > price
			? price : cc[1]
			: price,

		// high
		cc.length
			? cc[2] < price
			? price : cc[2]
			: price,

		// open
		cc.length
			? cc[3]
			: price,

		// close
		cc.length && cc[0] === time
			? cc[4]
			: price,

		// volume
		cc.length && cc[5]
			? cc[5] + size
			: size
	];
	return returnCandle;
};

/**
 * Test if the current trade belongs to the previous minute candle.
 * @param {number} ts - TradeMessage timestamp (in ms).
 * @returns {boolean}
 */
const isLate = (ts: number): boolean => {
	const currMinuteMS: number = roundToCurrentMinuteMS(+new Date());
	const assertIsLate: boolean = ts < currMinuteMS;

	// if (assertIsLate) console.log('Lateness in seconds (if negative):: ', (currMinuteMS - ts) / 1000);

	return CURRENT_CANDLE.length && assertIsLate;
};

/**
 * Test if the current trade belongs to the next minute candle (cron job lag).
 * @param {number} time - TradeMessage timestamp (in ms).
 * @returns {boolean}
 */
const isEarly = (time: number): boolean => {
	const currMinute: number = CURRENT_CANDLE[0];
	const assertIsEarly: boolean = time > currMinute + 60;

	return CURRENT_CANDLE.length && assertIsEarly;
};

/**
 * Amend the last candle in running history,
 * @param {CandlePayloadInterface} payload
 * @returns {number}
 */
const amendCandle = (payload: CandlePayloadInterface): number => {
	const lastCandle: number[] = candles[candles.length - 1];
	return candles.push(updateCandle(lastCandle, payload));
};

/**
 * Maintain the current running minute candle.
 * @param {CandlePayloadInterface} payload
 * @returns {number[]}
 */
const maintainCurrentCandle = (payload: CandlePayloadInterface): number[] => {
	return CURRENT_CANDLE = updateCandle(CURRENT_CANDLE, payload);
};

/**
 * Updates the NEXT_CANDLE objects to fix cron time drift.
 * @param {CandlePayloadInterface} payload
 * @returns {number[]}
 */
const maintainNextCandle = (payload: CandlePayloadInterface): number[] => {
	return NEXT_CANDLE = updateCandle(NEXT_CANDLE, payload);
};

/**
 * Route the data to the proper candle handler function.
 * @param {TradeMessage} msg
 * @returns {number | number[]}
 */
export const candleSwitch = (msg: TradeMessage) => {
	const ts: number = moment(msg.time).valueOf();
	const time: number = moment(msg.time).unix();
	const price: number = +msg.price;
	const size: number = +msg.size;
	const payload: CandlePayloadInterface = {time: time, price: price, size: size};

	return isLate(ts)
		? amendCandle(payload)
		: isEarly(time)
			? maintainNextCandle(payload)
			: maintainCurrentCandle(payload);
};