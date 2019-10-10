'use strict';
const pkg = require('./package');
const Wreck = require('@hapi/wreck');

/**
 * Register this Service Plugin with the server and expose command methods
 * @param server
 * @param options
 * @returns {Promise<void>}
 */
const register = async (server, options) => {
  console.log(`options = ${JSON.stringify(options)}`)

  await server.register(require('@hapi/h2o2'), { once: true });

  await server.expose('getEmployees', async (data) => {
    try {
      console.log(`expose a wreck with ${options.name} with ${JSON.stringify(data)}`)
      const { res, payload } = await Wreck.get(`https://leviathan.challenge.growflow.com/employee/?ApiUser=CHALLENGEUSER&ApiKey=CHALLENGEKEY`, {
        json:true
      })
//      console.log(`body: ${JSON.stringify(payload)}`);
      switch (res.statusCode) {
        case 200 : return ({statusCode:res.statusCode, payload:payload})
        default: throw new Error(`${res.statusCode} returned from  ${pkg.name}`)
      }
    } catch (levError) {
      console.error(`error calling ${pkg.name}`,levError)
      return ({statusCode: levError.output.statusCode, error: levError })
    }
  });

  await server.expose('getEmployeesWeb', async (data) => {
    try {
      console.log(`expose an inject soultion for ${pkg.name} with ${JSON.stringify(data)}`)
      const response = await server.inject({
        method: 'GET',
        url:    '/internal/levi/employees',
        allowInternals: true, // Is this necessary?
        headers: {
          ApiUser:"CHALLENGEUSER",
          ApiKey:"CHALLENGEKEY"
        }
      }, );

      console.log("internal call returned:")
      console.log(response.result);
//      console.log(`body: ${JSON.stringify(response.result)}`);
      switch (response.statusCode) {
        case 200 : return response.result
//        case 403 : return {statusCode: 402, payload:"Invalid auth"}
//        default: throw new Error(`${response.statusCode} returned from  ${pkg.name}`)
        default: return {
          statusCode:response.statusCode,
          message:`${response.statusCode} returned from ${pkg.name}`}
      }
    } catch (levError) {
      console.error(`error calling ${pkg.name}`,levError)
//      return 200;
//      return levError;
      return {statusCode: levError.output.statusCode, error: levError }
    }
  });

  await server.expose('describe', async () => {
    console.log(`expose yourself to something else in ${options.name}`)
    return {}
  });
};

function IntPlugin (pkg) {
  return {
    pkg:      pkg,
    register: register,
  }
};

module.exports = IntPlugin;
