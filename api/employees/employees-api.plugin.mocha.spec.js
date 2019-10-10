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
describe(`Employees - Phoenix API Plugin Unit Testing`, ()=> {

  it('Load from index ', async () => {
    const apiPlugin = require('.');
    console.log(`Plugins: ${JSON.stringify(apiPlugin)}`);
    expect(apiPlugin.pkg.name).to.exist;
    expect(apiPlugin.pkg.name).to.equal(pkgName);
  });

  it('Load from Manifest', async () => {
    const TestManifest = {
      server:   {
        host: '127.0.0.1',
        port: 3009
      },
      register: {
        plugins: [
          {
            plugin:  './index.js',
            routes:  {
              prefix: '/employees'
            },
            options: {
              writeModel: require('../../repo/employeeWriteDB'),
            }
          },
        ]
      },
    };

    const server = await getServer(TestManifest);
    expect(server.plugins).to.include.keys([pkgName]);
    // Check the plugin exposes a 'describe' method
    expect(server.plugins[pkgName]).to.have.keys(['describe']);
  });

});

