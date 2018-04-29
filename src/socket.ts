import {GDAXFeed} from 'gdax-trading-toolkit/build/src/exchanges';
import {getSubscribedFeeds} from 'gdax-trading-toolkit/build/src/factories/gdaxFactories';
import {options, product} from '../config';

// App level
import {logger} from '../utils/logger';
import {candleSwitch} from './candles';


/* GTT Functions
 =================================================================*/

/**
 * Starts GDAX live order-book and serves as main entry point to bot.
 * @returns {Promise<GDAXFeed>} - Main data-feed pipeline.
 */
export const initSocket = () => {
	return getSubscribedFeeds(options(logger), [product]).then((feed: GDAXFeed) => {
		feed.on('data', (msg: any) => {
			return msg.type.includes('trade') && candleSwitch(msg);
		});
	});
};
