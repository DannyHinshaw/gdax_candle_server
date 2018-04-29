import * as express from 'express';
import {initSocket} from './src/socket';
import {logger} from './utils/logger';
import {routes} from './src/routes';
import {initCron} from './src/cron';

console.log('WORKING');

const app: express.Application = express();
routes(app);

initSocket().then(() => {

	// Start cron worker
	initCron();

	// Start api listener
	const server = app.listen(5000, () => {
		console.log("app running on port.", server.address().port);
	});

	return logger.log('debug', '******Application initialized******');
}).catch(err => {
	return logger.log('error', `InitSocket Error: \n${err}`)
});