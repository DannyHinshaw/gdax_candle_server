import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Request, RequestHandler, Response} from 'express-serve-static-core';
import {logger} from '../utils/logger';
import {getCandles} from './candles';


// create application/json parser
const jsonParser: RequestHandler = bodyParser.json();

/**
 * Define the express server api routes.
 * @param app
 */
export const routes = (app: express.Application) => {

	// GET Root (api health check)
	app.get('/', (req: Request, res: Response) => {
		return res.status(200).send('Express server working.')
	});

	// GET Candles
	app.get('/candles', jsonParser, (req: Request, res: Response) => {
		logger.log('info', `Express::GET::Candles::\n${JSON.stringify(req.headers, null, 2)}`);
		res.setHeader('Content-Type', 'application/json');

		return res.status(200).send({candles: getCandles()});
	});
};