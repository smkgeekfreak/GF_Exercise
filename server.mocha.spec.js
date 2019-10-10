const pkgName = require('./package.json').name
const dotenv = require('dotenv').config({path:'./env'});
const  expect = require('chai').expect;
const Glue = require('@hapi/glue');;
const Manifest = require('./config/manifest');
const Logger = require('./logger')("phoenix-gateway-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL);

let getServer = async () => {
  Logger.debug("Composing server:" + __dirname);
  const server = await Glue.compose(Manifest,{relativeTo:__dirname});

  getServer = () => {
    return server;
  };
  return server ;
};

describe('Gateway Server Tests', async () => {

  it('startup', async () => {
    const server = await getServer();
  });

  it(`Check plugins`, async () => {
    const server = await getServer();
    Logger.debug(`Plugins: ${JSON.stringify(server.plugins)} `);
//    expect(server.plugins).to.be.empty;
    expect(server.plugins).to.include.keys(['Integration.API.Leviathan','h2o2'] );
  })
  it('Check registrations', async () => {
    const server = await getServer();

    Logger.debug(`Registrations: ${JSON.stringify(server.registrations)}`);
//    expect(server.registrations).to.be.empty;
    expect(server.registrations).to.include.keys(['Integration.API.Leviathan','h2o2'] );
  });

});
