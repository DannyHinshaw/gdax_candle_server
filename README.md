# gdax_candle_server
Since the GDAX API only serves minute candles historically (usually with a 15min delay) and not real-time, I created this simple server API to build minute candles live (for the past 26ish days) and serve them for my GDAX Bot to use on application startup. There may be other uses for this as well but either way I figured I'd open it up for others to use.

## Setup

### Configuration

- You will need to create your own configuration file with your API credentials. To do this simply fill out `config-example.ts` with your API info and resave it as `config.ts`.
- Run `npm run setup` to install the necessary types and packages.
- Run `npm start` to start the server.

## Endpoints

As of now there are only two endpoints.

1. GET `/`, Application root and healthcheck endpoint. If healthy will respond with 200 and `Express server working` message

2. GET `/candles`, This will send down the candle data in the request body.
