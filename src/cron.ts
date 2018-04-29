import {CronJob} from 'cron';
import {closeCandle} from './candles';
import {logger} from '../utils/logger';


/**
 * Cron task function wrapper.
 */
export const initCron = (): void => {

	// Update candle history in db from CurrentCandle, every minute on the minute.
	const minuteCandleWorker: CronJob = new CronJob('0 * * * * *', () => {
		logger.log('debug', `Cron: Closing current minute candle at ${new Date()}`);
		return closeCandle()
	});

	return minuteCandleWorker.start();
};
