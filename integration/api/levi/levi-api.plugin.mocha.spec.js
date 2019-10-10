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
describe(`API - Levi Plugin Unit Testing`, ()=> {

  it('Load from index ', async () => {
    const leviPlugin = require('.');
    console.log(`Plugins: ${JSON.stringify(leviPlugin)}`);
    expect(leviPlugin.pkg.name).to.exist;
    expect(leviPlugin.pkg.name).to.equal(pkgName);
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
//    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
    expect(server.plugins).to.include.keys([pkgName, 'h2o2']);
    // Check the plugin exposes a 'describe' method
    expect(server.plugins[pkgName]).to.have.keys(['describe']);
  });

});

