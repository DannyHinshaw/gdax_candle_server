import * as winston from 'winston';
import * as GTT from 'gdax-trading-toolkit';
import {Logger} from 'gdax-trading-toolkit/build/src/utils';

// Application logger
export const logger: Logger = GTT.utils.ConsoleLoggerFactory({
	level: 'debug',
	transports: [
		new winston.transports.Console({
			colorize: 'all',
			json: false,
			timestamp: true
		}),
		new winston.transports.File({filename: 'error.log', level: 'error'}),
		// new winston.transports.File({ filename: 'debug.log', level: 'debug' })
	],
	colorize: true
});

/**
 * Utility to convert objects to string printable format for logging.
 * @param level - Log level.
 * @param obj - Any JSON stringify-able object.
 * @param {string} message - Message or label to prepend print string.
 * @returns {string} - String formatted for logger.
 */
export const prettyPrint: Function = (level: string, message: string, obj: any): void => {
	return logger.log(level, `${message}\n${JSON.stringify(obj, null, 2)}`);
};
