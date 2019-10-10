'use strict';
const dotenv = require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Glue = require('@hapi/glue');
console.log('**************************************')
console.log('ENV');
console.log(`${process.env.PHOENIX_GATEWAY_HOST}`)
console.log(`${process.env.PHOENIX_GATEWAY_PORT}`)
console.log('**************************************')
const Manifest = require('./config/manifest');

const start = async () => {
  const server = await Glue.compose(Manifest, {relativeTo:__dirname});
  await server.route({
    method:  'GET',
    path:    '/',
    handler: (request, h) => {
      return 'Hello, world!';
    }
  });
  await server.start();
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

start();
