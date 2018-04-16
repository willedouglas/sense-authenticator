const cors = require('cors');

module.exports = app => {
  const corsOptions = {
    origin: '*'
  }

  app.use(cors(corsOptions));
}