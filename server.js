'use strict';
const dotenv = require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Glue = require('@hapi/glue');
const Logger = require('./logger')("phoenix-gateway-server",process.env.PHOENIX_GATEWAY_SERVER_LOG_LEVEL);
Logger.debug('**************************************')
Logger.debug('ENV');
Logger.debug(`${process.env.PHOENIX_GATEWAY_HOST}`)
Logger.debug(`${process.env.PHOENIX_GATEWAY_PORT}`)
Logger.debug('**************************************')
const Manifest = require('./config/manifest');

const start = async () => {
  try {
    const server = await Glue.compose(Manifest, {relativeTo: __dirname});
    await server.route({
      method:  'GET',
      path:    '/',
      handler: (request, h) => {
        return 'Hello, world!';
      }
    });
    server.log('debug', '-d gets logged');
    server.log('info', 'gets logged');
    server.logger().debug('pino log debug')
    server.logger().info('pino info')
    server.log(['subsystem'], 'third way for accessing it')
    await server.start();
//    Logger.info(`Server running at: ${server.info.uri}`)

  } catch (err) {
    console.error(err)
  }
}

process.on('unhandledRejection', (err) => {
  Logger.debug(err);
  process.exit(1);
});

start();
