import {GDAXFeed} from 'gdax-trading-toolkit/build/src/exchanges';
import {TradeMessage} from 'gdax-trading-toolkit/build/src/core';
import {getSubscribedFeeds} from 'gdax-trading-toolkit/build/src/factories/gdaxFactories';
import {auth, options, product} from '../config';

// App level
import {logger, prettyPrint} from '../utils/logger';


/* GTT Functions
 =================================================================*/

/**
 * Starts GDAX live order-book and serves as main entry point to bot.
 * @returns {Promise<GDAXFeed>} - Main data-feed pipeline.
 */
export const initSocket = () => {

	return getSubscribedFeeds(options(logger), [product]).then((feed: GDAXFeed) => {

		feed.on('data', (msg: any) => {
			// TODO: Manage late candles here
			// if (msg.type.includes('trade')) {
			//
			// 	// The lag.
			// 	const now = moment();
			// 	const m: number = moment(msg.time).valueOf();
			// 	const n: number = +new Date();
			// 	const diff: number = n - m;
			//
			// 	if (diff < 0) {
			// 		console.log('diff::', diff);
			// 		console.log('msg::', msg.time);
			// 		console.log('msg::', m);
			// 		console.log('now::', now);
			// 		console.log('now::', n);
			// 		throw Error('THE FUCKING TIME TRAVEL IS BACK AGAIN!')
			// 	}
			// }
			return msg.type.includes('trade') && console.log(`TRADE MESSAGE:: \n${msg}`);
		});
	});
};
