import {CronJob} from 'cron';
import {closeCandle} from './candles';


/**
 * Cron task function wrapper.
 */
export const initCron = (): void => {

	// Update candle history in db from CurrentCandle, every minute on the minute.
	const minuteCandleWorker: CronJob = new CronJob('0 * * * * *', () => {
		return closeCandle()
	});

	return minuteCandleWorker.start();
};
