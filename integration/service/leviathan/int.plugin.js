'use strict';
const pkg = require('./package');
const Wreck = require('@hapi/wreck');
const Events = require('../../../events/events')
const EventStore = require('../../../events/eventStore');

/**
 * Add employee to Leviathan api
 * @param server
 * @param options
 * @param data
 * @returns {Promise<{error: *, statusCode: *}|{message: string, statusCode: *}|*>}
 */
const addLeviathanEmployee = async (server,options,data) => {
  try {
    server.logger().debug(`expose an inject soultion for ${pkg.name} with ${JSON.stringify(data)}`)
    const response = await server.inject({
      method: 'POST',
      url:    '/internal/levi/employees',
      allowInternals: true, // Is this necessary?
      headers: {
        ApiUser:"CHALLENGEUSER",
        ApiKey:"CHALLENGEKEY"
      }
    }, );

    switch (response.statusCode) {
      case 200 : return response.result
      default: return {
        statusCode:response.statusCode,
        message:`${response.statusCode} returned from ${pkg.name}`}
    }
  } catch (levError) {
    console.error(`error calling ${pkg.name}`,levError)
    return {statusCode: levError.output.statusCode, error: levError }
  }
};


/**
 * Register this Service Plugin with the server and expose command methods
 * @param server
 * @param options
 * @returns {Promise<void>}
 */
const register = async (server, options) => {
  server.logger().debug(`options = ${JSON.stringify(options)}`)

  // Register listener to Events.EVENT_PHOENIX_EMPLOYEES_ADDED event
  EventStore.addListener(Events.EVENT_PHOENIX_EMPLOYEES_ADDED, async (data)=> {
    server.logger().info(pkg.name, `${Events.EVENT_PHOENIX_EMPLOYEES_ADDED} Listener called`)
    const response = await addLeviathanEmployee(server,options,data)
    server.logger().info(Events.EVENT_PHOENIX_EMPLOYEES_ADDED, response)
    //TODO: handle response
  })

  await server.register(require('@hapi/h2o2'), { once: true });

  await server.expose('getEmployees', async (data) => {
    try {
      server.logger().debug(`expose a wreck with ${options.name} with ${JSON.stringify(data)}`)
      const { res, payload } = await Wreck.get(`https://leviathan.challenge.growflow.com/employee/?ApiUser=CHALLENGEUSER&ApiKey=CHALLENGEKEY`, {
        json:true
      })
//      server.logger().debug(`body: ${JSON.stringify(payload)}`);
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
      server.logger().debug(`expose an inject soultion for ${pkg.name} with ${JSON.stringify(data)}`)
      const response = await server.inject({
        method: 'GET',
        url:    '/internal/levi/employees',
        allowInternals: true, // Is this necessary?
        headers: {
          ApiUser:"CHALLENGEUSER",
          ApiKey:"CHALLENGEKEY"
        }
      }, );

      server.logger().debug("internal call returned:")
      server.logger().debug(response.result);
//      server.logger().debug(`body: ${JSON.stringify(response.result)}`);
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
    server.logger().debug(`expose yourself to something else in ${options.name}`)
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
