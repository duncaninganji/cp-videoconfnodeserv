import express from 'express';
import bodyParser from 'body-parser';
import config, { nodeEnv } from './config.js';
import router from './routes.js';

const server = express();
server.use(bodyParser.json());
server.use('/', router);

server.set('view engine', 'ejs');

server.listen(config.port, config.host, () => {
  console.info(`Express listening on port${config.port} in ${nodeEnv} mode`);
  console.info(`Server running at ${config.serverUrl}`);
});
