const expect = require('chai').expect;
const Glue = require('@hapi/glue');
const pkgName = require('./package.json').name
const dotenv = require('dotenv').config({path:'../../.env'});
const Logger = require('../../logger')(pkgName+"-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL)

let getServer = async (manifest) => {
  Logger.debug(`Composing server in ${__dirname} ` );
  Logger.debug(`Manifest Destiny: ${JSON.stringify(manifest)}`);
  const server = await Glue. compose(manifest,{relativeTo:__dirname});
  getServer = () => {
    return server;
  };
  return server;
};
describe(`Employees Writes - Phoenix API Plugin Unit Testing`, ()=> {
  it('Call /employees', async () => {
    const TestManifest = {
      server:   {
        host: '127.0.0.1',
        port: 3009,
      },
      register: {
        plugins: [
          {
            plugin: 'laabr',
            options: {
//            formats: { onPostStart: ':time :start :level :message :host' },
              override:false,
              pino: {
                level: process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL,
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
              prefix: '/employees'
            },
            options: {
              writeModel: require('../../repo/employeeWriteDB'),
              service: require('../../integration/service/leviathan')
            }
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    Logger.debug(`Registrations: ${JSON.stringify(server.registrations)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.keys([pkgName]);
    expect(server.registrations).to.include.keys([pkgName,'laabr']);
    // Plugin should have the describe method
    expect(server.plugins[pkgName]).to.include.keys(['describe']);

    const response = await server.inject({
      method:         'POST',
      url:            '/employees',
//      allowInternals: true, // Is this necessary?
      headers:        {
//        ApiUser: "CHALLENGEUSER",
//        ApiKey:  "CHALLENGEKEY"
      }
    },);

    expect(response.statusCode).to.equal(200);
    expect(response.result).to.equal('success');
//    expect(response.result.payload[0]).to.include.keys(['email', 'id', 'role', 'telephone', 'lastName', 'firstName']);
  });

});
