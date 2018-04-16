const session = require('express-session');
const cookieParser = require('cookie-parser');

module.exports = app => {
	app.use(cookieParser());

	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
		next();
	});
};