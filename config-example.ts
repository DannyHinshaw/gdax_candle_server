const CONFIG = {
	// GDAX live credentials
	live: {
		key: 'YOUR_GDAX_SANDBOX_API_KEY',
		secret: 'YOUR_GDAX_SANDBOX_API_SECRET',
		passphrase: 'YOUR_GDAX_SANDBOX_API_PASSPHRASE',
		apiURI: 'https://api.pro.coinbase.com',
		websocketURI: 'wss://ws-feed.pro.coinbase.com'
	},
	// GDAX sandboxed environment credentials
	sandbox: {
		key: 'YOUR_GDAX_SANDBOX_API_KEY',
		secret: 'YOUR_GDAX_SANDBOX_API_SECRET',
		passphrase: 'YOUR_GDAX_SANDBOX_API_PASSPHRASE',
		apiURI: 'https://api-public.sandbox.gdax.com',
		websocketURI: 'wss://ws-feed-public.sandbox.gdax.com'
	}
};

// Switch between authed/sandbox credentials here
const config = CONFIG.live;

export const auth = {
	key: config.key,
	secret: config.secret,
	passphrase: config.passphrase
};

export const options = logger => ({
	auth: auth,
	logger: logger,
	channels: [
		'heartbeat',
		'level2',
		'matches',
		'ticker'
	],
	apiUrl: config.apiURI,
	wsUrl: config.websocketURI
});

export const product = 'ETH-USD';
