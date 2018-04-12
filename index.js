const fs = require("fs");
const path = require('path');
const QRS = require("./qrs");
const cors = require('cors');
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

app.use(cors({ origin: '*'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect(process.env.REDIRECT_URL);
});

app.post('/login', (req, res) => {
  QRS.getTicket(req.body.username, (error, ticket) => {
    if (ticket) {
      return res.status(200).json({ status: true, result: { message: 'Autenticado com sucesso.', ticket: ticket.Ticket }});
    }
    return res.status(500).json({ status: false, error: error });
  })
});

app.delete('/logout/:session_user', (req, res) => {
  QRS.logout(req.params.session_user, (error, session) => {
    if (session) {
      return res.status(200).json({ status: true, result: { message: 'Você saiu do portal.', session: session.sessionId }});  
    }
    return res.status(500).json({ status: false, error: error }); 
  })
});

app.listen(process.env.APPLICATION_PORT, () => { console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', process.env.APPLICATION_PORT, process.env.APPLICATION_PORT); });