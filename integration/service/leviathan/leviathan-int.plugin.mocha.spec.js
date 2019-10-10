const expect = require('chai').expect;
const Glue = require('@hapi/glue');

const getServer = async (manifest) => {
  console.log(`Composing server in ${__dirname} ` );
  console.log(`Manifest Destiny: ${JSON.stringify(manifest)}`);
  const server = await Glue.compose(manifest,{relativeTo:__dirname});
//  getServer = () => {
//    return server;
//  };
  return server;
};

describe(`Leviathan Integration Plugin Testing`, ()=> {

  it('Load from index ', async () => {
    const leviathanPlugin = require('.');
    console.log(`Plugins: ${JSON.stringify(leviathanPlugin)}`);
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
            plugin:  './index.js',
          },
        ]
      },
    };

    const server = await getServer(TestManifest);
//    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
    expect(server.plugins).to.include.keys(['Integration.Service.Leviathan'] );
    // Check the plugin exposes a 'describe' method
    expect(server.plugins[require('./package.json').name]).to.include.keys(['describe'] );
//    expect(server.plugins[require('./package.json').name]).to.have.keys(['describe'] );
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
            plugin:  './index.js',
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.property(pkgName);
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe'] );

    const response = await server.plugins[pkgName].asyncReqWithData({id:2});
    console.log(`resp: ${JSON.stringify(response.statusCode)}`);
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
            plugin:  './index.js',
          },
        ]
      },
    };
    const pkgName = require('./package.json').name
    const server = await getServer(TestManifest);
    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.property(pkgName);
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe'] );
    expect(server.plugins[pkgName]).to.include.keys(['getEmployees']);

    const response = await server.plugins[pkgName].getEmployees();
    console.log(`resp: ${JSON.stringify(response.payload,null, 2)}`);
    expect(response.statusCode).to.equal(200);
    expect(response.payload.length).to.be.gt(0);
    expect(response.payload[0]).to.include.keys(['email', 'id','role', 'telephone','lastName','firstName']);
//    expect(response.payload).to.include.keys(['userId', 'completed']);
  });

  it.skip('Call plugin getEmployeesWeb (Internal api call)', async () => {
    const TestManifest= {
      server:   {
        host: '127.0.0.1',
        port: 3009
      },
      register: {
        plugins: [
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
    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
//    expect(server.plugins).to.include.property(pkgName);
    expect(server.plugins).to.include.keys([pkgName,'Integration.API.Leviathan','h2o2'] );
    // Plugin should have the util method

    expect(server.plugins[pkgName]).to.include.keys(['describe'] );
    expect(server.plugins[pkgName]).to.include.keys(['getEmployeesWeb']);

    const response = await server.plugins[pkgName].getEmployeesWeb();
//    console.log(`resp: ${JSON.stringify(response.payload,null, 2)}`);
    console.log("got");
    console.log(response);
    expect(response.statusCode).to.equal(200);
    expect(response.payload.length).to.be.gt(0);
    expect(response.payload[0]).to.include.keys(['email', 'id','role', 'telephone','lastName','firstName']);
//    expect(response.payload).to.include.keys(['userId', 'completed']);
  });
});
