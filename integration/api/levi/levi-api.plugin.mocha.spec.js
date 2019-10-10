const pkgName = require('./package.json').name;
const dotenv = require('dotenv').config({path:'../../../.env'});
const Logger = require('../../../logger')(pkgName +"-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL);
const expect = require('chai').expect;
const Glue = require('@hapi/glue');

let getServer = async (manifest) => {
  Logger.debug(`Composing server in ${__dirname} ` );
  Logger.debug(`Manifest Destiny: ${JSON.stringify(manifest)}`);
  const server = await Glue.compose(manifest,{relativeTo:__dirname});
  getServer = () => {
    return server;
  };
  return server;
};
describe(`API - Levi Plugin Unit Testing`, ()=> {

  it('Load from index ', async () => {
    const leviPlugin = require('.');
    Logger.debug(`Plugins: ${JSON.stringify(leviPlugin)}`);
    expect(leviPlugin.pkg.name).to.exist;
    expect(leviPlugin.pkg.name).to.equal(pkgName);
  });

  it('Load from Manifest', async () => {
    const TestManifest = {
      server:   {
        host: '127.0.0.1',
        port: 3019
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
                log:':time :level :test  :message'
              },
              tokens: { test:  () => '[test]' },
              indent: 1
            },
          },
          {
            plugin:  './index.js',
//            dependencies: '@hapi/h2o2',
            routes:  {
              prefix: '/internal'
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

    const server = await getServer(TestManifest);
    const pkgName = require('./package.json').name;
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    expect(server.plugins).to.include.keys([pkgName, 'h2o2']);
    expect(server.registrations).to.include.keys([pkgName,'laabr']);
    // Check the plugin exposes a 'describe' method
    expect(server.plugins[pkgName]).to.have.keys(['describe']);
  });

});

