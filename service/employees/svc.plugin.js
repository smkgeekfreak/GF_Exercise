/*************
 * @name Employees domain service plugin
 * @description Exposes and handles(or routes) commands related to employess
 */
'use strict';
const Joi = require('@hapi/joi');
const pkg = require('./package');
const Wreck = require('@hapi/wreck');
const WriteRepo = require('../../repo/writeRepo')
const Events = require('../../events/events')
const EventStore = require('../../events/eventStore');

const register = async (server, options) => {
  server.logger().debug(`options = ${JSON.stringify(options)}`)
  //TODO: Add routeOptions validate for writeModel
  //TODO: Add routeOptions validate for eventEmitter
  if (!options || !options.writeModel) {
    throw new Error('routeOptions must include writeModel ');
  }

  await server.expose('addEmployees', async (data) => {
    try {
      //TODO: Add routeOptions validate for writeModel
      if (!options || !options.writeModel) {
        throw new Error('routeOptions must include writeModel ');
      }
      //TODO: replace this with data passed in
      data = {
        email:'shawn@hired.com',
        id:' a643e681-df8c-43b2-854e-d816baca5827',
        role:'new employee',
        telephone: '615-540-4550',
        lastName:  'aname ' +Math.random(),
        firstName:'bname ' +Math.random()
      }

      // Register events with eventStore
      // DONE: Need to register outside here
//      await EventStore.registerNewChannel(Events.EVENT_PHOENIX_EMPLOYEES_ADDED );
      server.logger().debug(`expose a wreck with  ${JSON.stringify(data)}`)

      const employeeWriter = new WriteRepo({writeModel: options.writeModel});
      const result = await employeeWriter.create(data);
      // TODO: Send event for employee added
      // emit('Employee.Added', { data })
      await EventStore.emit(Events.EVENT_PHOENIX_EMPLOYEES_ADDED, data);
      server.logger().debug('store it', EventStore.Store);

      return result;
    } catch (writerError) {
      // emit('Employee.AddFailed', { data }) ???
      server.logger().error(writerError);
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

function SvcPlugin (pkg) {
  return {
    pkg:      pkg,
    register: register,
  }
};

module.exports = SvcPlugin;
