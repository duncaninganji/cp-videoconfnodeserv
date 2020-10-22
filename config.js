const { env } = process.env || 'development';
const port = env ? env.PORT || 8081 : 8081;
const host = env ? env.host || 'localhost': 'localhost'

const options = {
  development: {
    serviceTimeout: 30,
    port,
    host,
    serverUrl: `http://${host}:${port}`,
  },
  production: {
    serviceTimeout: 30,
    port,
    host,
    serverUrl: `http://${host}:${port}`,
  },
  test: {
    serviceTimeout: 30,
    port,
    host,
    serverUrl: `http://${host}:${port}`,
  },
};

export const nodeEnv = env ? env.NODE_ENV || 'development': 'development';

export default options[nodeEnv];
