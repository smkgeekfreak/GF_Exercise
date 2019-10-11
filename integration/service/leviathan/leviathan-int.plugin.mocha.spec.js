const pkgName = require('./package.json').name
const dotenv = require('dotenv').config({path:'../../.env'});
const Logger = require('../../../logger')(pkgName+"-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL)
const expect = require('chai').expect;
const Glue = require('@hapi/glue');
const EventStore = require('../../../events/eventStore');
const Events = require('../../../events/events');

const getServer = async (manifest) => {
  Logger.debug(`Composing server in ${__dirname} ` );
  Logger.debug(`Manifest Destiny: ${JSON.stringify(manifest)}`);
  const server = await Glue.compose(manifest,{relativeTo:__dirname});
//  getServer = () => {
//    return server;
//  };
  return server;
};

describe(`Leviathan Integration Plugin Testing`, ()=> {

  it('Load from index ', async () => {
    const leviathanPlugin = require('.');
    Logger.debug(`Plugins: ${JSON.stringify(leviathanPlugin)}`);
    expect(leviathanPlugin.pkg.name).to.exist;
    expect(leviathanPlugin.pkg.name).to.equal('Integration.Service.Leviathan');
  });

  it('Load from Manifest', async () => {
    const TestManifest= {
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
//                level: 'debug' //env not working
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
          },
        ]
      },
    };

    const server = await getServer(TestManifest);
//    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    expect(server.plugins).to.include.keys(['Integration.Service.Leviathan'] );
    expect(server.registrations).to.include.keys([pkgName,'laabr']);
    // Check the plugin exposes a 'describe' method
    expect(server.plugins[require('./package.json').name]).to.include.keys(['describe'] );
//    expect(server.plugins[require('./package.json').name]).to.have.keys(['describe'] );
  });

  it('Trigger addEmployees Event', async () => {
    const TestManifest= {
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
//                level: 'debug'
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
            plugin:  '../../api/levi/index.js',
//            dependencies: '@hapi/h2o2',
            routes:  {
              prefix: '/internal/levi'
            },
            options: {
              isInternal:true,
//              headers: {
//                ApiUser:"CHALLENGEUSER",
//                ApiKey:"CHALLENGEKEY"
//              },
              baseURL: 'https://leviathan.challenge.growflow.com'
            }
          },
          {
            plugin:  './index.js',
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
//    expect(server.plugins).to.include.property(pkgName);
    expect(server.plugins).to.include.keys([pkgName,'Integration.API.Leviathan','h2o2'] );
    expect(server.registrations).to.include.keys([pkgName,'laabr']);

    await EventStore.emit(Events.EVENT_PHOENIX_EMPLOYEES_ADDED, {name:'test'});
    //TODO; how to validate event
  });

  it.skip('Call plugin method w/data', async () => {
    const TestManifest= {
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
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.property(pkgName);
    expect(server.registrations).to.include.keys([pkgName,'laabr']);
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe'] );

    const response = await server.plugins[pkgName].asyncReqWithData({id:2});
    Logger.debug(`resp: ${JSON.stringify(response.statusCode)}`);
    expect(response.statusCode).to.equal(200);
    expect(response.payload).to.include.keys(['userId', 'completed']);
  });

  it.skip('Call plugin getEmployees', async () => {
    const TestManifest= {
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
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.property(pkgName);
    expect(server.registrations).to.include.keys([pkgName,'laabr']);
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe'] );
    expect(server.plugins[pkgName]).to.include.keys(['getEmployees']);

    const response = await server.plugins[pkgName].getEmployees();
    Logger.debug(`resp: ${JSON.stringify(response.payload,null, 2)}`);
    expect(response.statusCode).to.equal(200);
    expect(response.payload.length).to.be.gt(0);
    expect(response.payload[0]).to.include.keys(['email', 'id','role', 'telephone','lastName','firstName']);
//    expect(response.payload).to.include.keys(['userId', 'completed']);
  });

  //TODO: skipping to reduce calls to actual Leviathan api
  it.skip('Call plugin getEmployeesWeb (Internal api call)', async () => {
    const TestManifest= {
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
            plugin:  '../../api/levi/index.js',
//            dependencies: '@hapi/h2o2',
            routes:  {
              prefix: '/internal/levi'
            },
            options: {
              isInternal:true,
//              headers: {
//                ApiUser:"CHALLENGEUSER",
//                ApiKey:"CHALLENGEKEY"
//              },
              baseURL: 'https://leviathan.challenge.growflow.com'
            }
          },
          {
            plugin:  './index.js',
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
//    expect(server.plugins).to.include.property(pkgName);
    expect(server.plugins).to.include.keys([pkgName,'Integration.API.Leviathan','h2o2'] );
    expect(server.registrations).to.include.keys([pkgName,'laabr']);
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe'] );
    expect(server.plugins[pkgName]).to.include.keys(['getEmployeesWeb']);

    const response = await server.plugins[pkgName].getEmployeesWeb();
//    Logger.debug(`resp: ${JSON.stringify(response.payload,null, 2)}`);
    Logger.debug("got");
    Logger.debug(response);
    expect(response.statusCode).to.equal(200);
    expect(response.payload.length).to.be.gt(0);
    expect(response.payload[0]).to.include.keys(['email', 'id','role', 'telephone','lastName','firstName']);
//    expect(response.payload).to.include.keys(['userId', 'completed']);
  });
});
