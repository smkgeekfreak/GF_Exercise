'use strict';
const Package = require('../package.json');

module.exports = {
  server:   {
      host: process.env.PHOENIX_GATEWAY_HOST,
      port: process.env.PHOENIX_GATEWAY_PORT
  },
}
