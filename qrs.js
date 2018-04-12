var https = require('https');
var fs = require('fs');
var crypto = require('crypto');
var QRS = "4242";
var QPS = "4243";

module.exports = {
  getTicket: function(user, callbackFn) {
    var data = {
      UserDirectory: process.env.USER_DIRECTORY,
      UserId: user
    };

    this.qPost(QPS, ("/qps/" + process.env.SENSE_PROXY) + "/ticket/", data, function(err, ticketResponse) {
      if (err) {
        callbackFn(err);
      }
      else {
        var ticket = JSON.parse(ticketResponse);
        if (ticket.Ticket) {
          callbackFn(null, ticket);
        }
        else {
          callbackFn(null);
        }
      }
    });
  },
  logout: function(user, callbackFn) {
    var me = this;

    me.qGet(QPS, ("/qps/" + process.env.SENSE_PROXY) + "/session/", function(err, sessionsResponse) {
      if (err) {
        callbackFn(err);
      }
      else {
        var sessions = JSON.parse(sessionsResponse);
        var hasSessions = sessions.length > 0;

        if (hasSessions) {
          var sessionsUser = sessions.filter(s => s.UserDirectory === process.env.USER_DIRECTORY && s.UserId === user);
          var hasSessionsUser = sessionsUser.length > 0;

          if (hasSessionsUser) {
            sessionsUser.forEach(s => {
              me.qDelete(QPS, ("/qps/" + process.env.SENSE_PROXY) + "/session/" + s.SessionId, function(err, sessionsUserResponse) {
                var session = JSON.parse(sessionsUserResponse);

                if (session.Session) {
                  callbackFn(null, session.Session);
                }
                else {
                  callbackFn({ message: "Falha ao realizar a leitura da sessão." }, null);
                }        
              });
            });
          } else {
            callbackFn({ message: "Nenhuma sessão aberta para o usuário " + user + "." }, null);  
          }
        } else {
          callbackFn({ message: "Nenhuma sessão aberta." }, null);
        }
      }
    });
  },
  generateXrfkey: function(size, chars) {
    size = size || 16;
    chars = chars || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    var rnd = crypto.randomBytes(size), value = new Array(size), len = chars.length;
    for (var i = 0; i < size; i++) {
        value[i] = chars[rnd[i] % len]
    };
    return value.join('');
  },
  qGet: function(api, url, callbackFn) {
    var me = this;

    try {
      var cert = fs.readFileSync(process.env.certPath + '/client.pem');
      var key = fs.readFileSync(process.env.certPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate.');
      return;
    }

    var xrfkey = me.generateXrfkey();
    var settings = {
      method: 'GET',
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if (url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = process.env.SENSE_SERVER;
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }
    
    var data = "";
    
    https.get(settings, function(response) {
      response.on('data', function(chunk) {
        data+=chunk;
      });
      response.on('end', function() {
        callbackFn.call(null, null, data);
      });
    }).on('error', function(e) {
      callbackFn.call(null, e);
    });
  },
  qDelete: function(api, url, callbackFn) {
    var me = this;

    try {
      var cert = fs.readFileSync(process.env.certPath + '/client.pem');
      var key = fs.readFileSync(process.env.certPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate.');
      return;
    }

    var xrfkey = me.generateXrfkey();
    var settings = {
      method: 'DELETE',
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if (url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = process.env.SENSE_SERVER;
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }
    
    var data = "";
    
    https.get(settings, function(response) {
      response.on('data', function(chunk) {
        data+=chunk;
      });
      response.on('end', function() {
        callbackFn.call(null, null, data);
      });
    }).on('error', function(e) {
      callbackFn.call(null, e);
    });
  },
  qPost: function(api, url, data, callbackFn) {
    var me = this;
  
    try {
      var cert = fs.readFileSync(process.env.certPath + '/client.pem');
      var key = fs.readFileSync(process.env.certPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate');
      return;
    }

    var xrfkey = me.generateXrfkey();
    var settings = {
      method: 'POST',
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if(url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = process.env.SENSE_SERVER;
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }

    var output = "";
    var postReq = https.request(settings, function(postRes) {
      postRes.on('data', function(chunk) {
        output+=("" + chunk);
      });
      postRes.on('end', function() {
        callbackFn.call(null, null, output);
      });
    });

    postReq.write(JSON.stringify(data));
    postReq.end();

    postReq.on('error', function(e) {
      callbackFn.call(null, e);
    });
  }
};