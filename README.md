# sense-authenticator
Module to authenticate in anyone Qlik Sense Enterprise server using Certificates. This project provide tokens/sessions to be used in external web applications to expand the power of Qlik Sense.

## Prerequisites

1. Qlik Sense Server Enterprise Installed;
2. Virtual Proxy created and configured.

## How to use?

1. Clone the project `git clone https://github.com/willedouglas/sense-authenticator`;
2. Run the following command: `npm install` at the cloned directory to install all dependencies;
3. Open the project with your preffered code editor;
4. Edit the file config/config.js with the correct configurations of your Qlik Sense Enterprise Server;
5. In folder config/certificates move the certificates from your server;
6. Run the following command: `npm start` to run the server.

## Routes

| Route                                            | Method | What Do?                                                       |
| ------------------------------------------------ |:------:| --------------------------------------------------------------:|
| localhost:port/                                  | GET    | Redirect to path defined in config/config.js REDIRECT_URL.     |
| localhost:port/session/:user_id                  | POST   | Request new session to user defined in URL parameter.          |
| localhost:port/session/:session_id               | GET    | Get details from specified session defined in URL parameter.   |
| localhost:port/session/                          | GET    | Get all opened sessions from specified server.                 |
| localhost:port/ticket/:user_id                   | POST   | Request new ticket to user defined in URL parameter.           |
| localhost:port/logout/:session_id                | DELETE | Delete session specified in URL parameter.                     |
