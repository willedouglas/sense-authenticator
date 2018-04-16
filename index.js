const fs = require("fs");
const path = require('path');
const https = require('https');
const app = require('express')();
const session = require('./src/session');
const routes = require('./src/routes');
const bodyParser = require('body-parser');

try {
  const config = require('./config/config');
  if (config) {
    for (var c in config) {
      process.env[c] = config[c];
    }
  }
}
catch(err) {
  console.error(err);
}

process.env.appRoot = __dirname;
process.env.certPath = path.join(__dirname, 'config/certificates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
session(app);
routes(app);

app.listen(process.env.APPLICATION_PORT, () => { console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', process.env.APPLICATION_PORT, process.env.APPLICATION_PORT); });