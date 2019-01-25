const QRS = require("./qrs");

module.exports = app => { 
  app.get('/', (req, res) => {
    return res.redirect(process.env.REDIRECT_URL);
  });

  app.post('/ticket/login', (req, res) => {
    QRS.getTicket(req.body.username, (error, ticket) => {
      if (ticket) {
        return res.status(200).json({ status: true, result: { message: 'Ticket ' + ticket.Ticket + ' criado com sucesso.', ticket: ticket.Ticket }});
      }
      return res.status(500).json({ status: false, error: error });
    });
  });

  app.post('/session/login', (req, res) => {
    QRS.createSession(req.body.username, (error, session) => {
      if (session) {
        return res.status(200).json({ status: true, result: { message: 'Sessão ' + session.SessionId + ' criada com sucesso.', session: session.SessionId }});
      }
      return res.status(500).json({ status: false, error: error });
    });
  });

  app.get('/session/', (req, res) => {
    QRS.getSessions(null, (error, sessions) => {
      if (sessions) {
        return res.status(200).json({ status: true, result: sessions });  
      } 
      return res.status(500).json({ status: false, error: error }); 
    });
  });

  app.get('/session/:session_user', (req, res) => {
    QRS.getSessions(req.params.session_user, (error, sessions) => {
      if (sessions) {
        return res.status(200).json({ status: true, result: sessions });  
      } 
      return res.status(500).json({ status: false, error: error }); 
    });
  });

  app.delete('/logout/:session_id', (req, res) => {
    QRS.removeSession(req.params.session_id, (error, session) => {
      if (session) {
        return res.status(200).json({ status: true, result: { message: 'Sessão ' + session.SessionId + ' removida com sucesso.', session: session.sessionId }});
      }
      return res.status(500).json({ status: false, error: error });
    })
  });
};