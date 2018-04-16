const session = require('express-session');
const cookieParser = require('cookie-parser');

module.exports = app => {
	app.use(cookieParser());
	// app.use(session({
	// 	secret: process.env.SENSE_PROXY,
	// 	resave: false,
	// 	saveUninitialized: true,
	// 	name: 'X-Qlik-Session-Hefesto',
	// 	value: '123456789ABCEFGH',
	// 	genid: () => '123456789',
	// 	cookie: {
	// 		path: '/',
	// 		domain: process.env.SENSE_SERVER,
	// 		maxAge: 1000 * 60 * 24,
	// 	}
	// }));

	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
		next();
	});
};