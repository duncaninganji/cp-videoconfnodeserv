const express = require('express');
const bodyParser =  require('body-parser');
const config = require('./config.js');
const router = require('./routes.js');
const nodeEnv = 'development';
const server = express();
server.use(bodyParser.json());
server.use('/', router);

server.set('view engine', 'ejs');

server.listen(config.development.port, config.development.host, () => {
  console.info(`Express listening on port${config.development.port} in ${nodeEnv} mode`);
  console.info(`Server running at ${config.development.serverUrl}`);
});
