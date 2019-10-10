const expect = require('chai').expect;
const Glue = require('@hapi/glue');
const pkgName = require('./package.json').name

let getServer = async (manifest) => {
  console.log(`Composing server in ${__dirname} ` );
  console.log(`Manifest Destiny: ${JSON.stringify(manifest)}`);
  const server = await Glue.compose(manifest,{relativeTo:__dirname});
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
        port: 3009
      },
      register: {
        plugins: [
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
    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
    // Should have the plugin loaded
    expect(server.plugins).to.include.keys([pkgName]);
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
