const expect = require('chai').expect;
const Glue = require('@hapi/glue');
const pkgName = require('./package.json').name
const dotenv = require('dotenv').config({path:'../../../.env'});
const Logger = require('../../../logger')(pkgName+"-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL);

let getServer = async (manifest) => {
  Logger.debug(`Composing server in ${__dirname} ` );
  Logger.debug(`Manifest Destiny: ${JSON.stringify(manifest)}`);
  const server = await Glue.compose(manifest,{relativeTo:__dirname});
  getServer = () => {
    return server;
  };
  return server;
};
describe(`Employee API - Levi Plugin Unit Testing`, ()=> {
  it.skip('Call /employees', async () => {
    const TestManifest = {
      server:   {
        host: '127.0.0.1',
        port: 3009
      },
      register: {
        plugins: [
          {
            plugin: 'laabr',
            options: {
//            formats: { onPostStart: ':time :start :level :message :host' },
              override:false,
              pino: {
                level: process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL
              },
              colored:true,
              formats: {
                onPostStart: 'server.info',
                log:':time :level :test :message'
              },
              tokens: { test:  () => '[test]' },
              indent: 1
            },
          },
          {
            plugin:  './index.js',
//            dependencies: '@hapi/h2o2',
            routes:  {
              prefix: '/internal/levi'
            },
            options: {
              isInternal: true,
//              headers: {
//                ApiUser:"CHALLENGEUSER",
//                ApiKey:"CHALLENGEKEY"
//              },
              baseURL:    'https://leviathan.challenge.growflow.com'
            }
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.keys([pkgName, 'h2o2']);
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe']);
//    expect(server.plugins[pkgName]).to.include.keys(['getEmployeesWeb']);

    const response = await server.inject({
      method:         'GET',
      url:            '/internal/levi/employees',
      allowInternals: true, // Is this necessary?
      headers:        {
        ApiUser: "CHALLENGEUSER",
        ApiKey:  "CHALLENGEKEY"
      }
    },);

//    Logger.debug("got");
    Logger.debug(response.result);
    expect(response.result.statusCode).to.equal(200);
    expect(response.result.payload.length).to.be.gt(0);
    expect(response.result.payload[0]).to.include.keys(['email', 'id', 'role', 'telephone', 'lastName', 'firstName']);
  });

});
