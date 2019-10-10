'use strict';
const Package = require('../package.json');

module.exports = {
  server:   {
    host: process.env.PHOENIX_GATEWAY_HOST,
    port: process.env.PHOENIX_GATEWAY_PORT,
//    debug: {
//      log: ['hapi', 'error', 'debug', 'info', 'warning', 'request', 'server', 'timeout', 'internal', 'implementation', 'tail', 'remove', 'last', 'add'],
//      request: ['hapi', 'error', 'debug', 'info', 'warning', 'request', 'server', 'timeout', 'internal', 'implementation', 'tail', 'remove', 'last', 'add', 'received', 'handler', 'response']
//    },

  },
  register: {
    plugins: [
//      //**************************************************************
//      //                                                             *
//      //                      COMMON PLUGINS                         *
//      //                                                             *
//      //**************************************************************
      {
        plugin: 'laabr',
        options: {
//            formats: { onPostStart: ':time :start :level :message :host' },
          override:false,
          pino: {
            level: process.env.PHOENIX_GATEWAY_SERVER_LOG_LEVEL
          },
          colored:true,
          formats: {
            onPostStart: 'server.info',
            log:':time :level :process :message'
          },
          tokens: { process:  () => '[main]' },
            indent: 0
          },
      },
//      {
//        plugin: 'blipp'
//      },
//      // Static file and directory handlers
//      {
//        plugin: '@hapi/inert'
//      },
//      {
//        plugin: '@hapi/vision'
//      },
//      // App context decorator
//      {
//        plugin:  'hapi-swagger',
//        options: {
//          info: {
//            title:   'Test API Documentation',
//            version: Package.version,
//          },
////          grouping: 'tags',
////          tags:     [
////            {
////              name:        'users',
////              description: 'Users data'
////            },
////            {
////              name:         'store',
////              description:  'Storing a sum',
////              externalDocs: {
////                description: 'Find out more about storage',
////                url:         'http://example.org'
////              }
////            },]
////        }
//        },
////        host:    process.env.SWAGGER_HOST,
//      },


//      //**************************************************************
//      //                                                             *
//      //                      APPLICATION PLUGINGS                   *
//      //                                                             *
//      //**************************************************************
//
//      /* ----------------- Integration Plugins-------------- */
      {
        plugin:  './integration/api/levi/index.js',
        routes:  {
          prefix: '/internal/levi'
        },
        options: {
          isInternal:true,
//              headers: {
//                ApiUser:"CHALLENGEUSER", // TODO: get from .env
//                ApiKey:"CHALLENGEKEY"    // TODO: get from .env
//              },
          baseURL: 'https://leviathan.challenge.growflow.com'
        }
      },
    ]
  },
}
