const fs = require("fs");
const path = require('path');
const QRS = require("./qrs");
const https = require("https");
const app = require('express')();
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');  
  next();
});

app.post('/login', function(req, res) {
  QRS.getTicket(req.body.username, function(error, ticket) {
    if (ticket) {
      return res.status(200).json({ status: true, result: { message: 'Autenticado com sucesso.', ticket: ticket.Ticket }});
    }
    return res.status(500).send({ status: false, error: error });
  })
});

app.post('/logout', function(req, res) {
  QRS.logout(req.body.username, function(error) {
    if (error) {
      return res.status(500).send({ status: false, error: error });  
    }

    return res.status(200).json({ status: true, result: { message: 'Você saiu do portal.' }});
  })
});

app.listen(process.env.APPLICATION_PORT, () => { console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', process.env.APPLICATION_PORT, process.env.APPLICATION_PORT); });