'use strict';
const Joi = require('@hapi/joi');
const pkg = require('./package');
const Wreck = require('@hapi/wreck');
const WriteRepo = require('../../repo/writeRepo')

const register = async (server, options) => {
  server.logger().debug(`options = ${JSON.stringify(options)}`)
  //TODO: Add routeOptions validate for writeModel
  if (!options || !options.writeModel) {
    throw new Error('routeOptions must include writeModel ');
  }

  await server.expose('addEmployees', async (data) => {
    try {
      //TODO: Add routeOptions validate for writeModel
      if (!options || !options.writeModel) {
        throw new Error('routeOptions must include writeModel ');
      }
      server.logger().debug(`expose a wreck with  ${JSON.stringify(data)}`)
      const employeeWriter = new WriteRepo({writeModel: options.writeModel});
      await employeeWriter.create({
        email:'shawn@hired.com',
        id:' d643e381-df8c-43b2-844e-d816baca5828',
        role:'new employee',
        telephone: '615-540-4550',
        lastName:  'aname',
        firstName:'bname'
      });
      //
      // TODO: Send event for employee added
      // emit('Employee.Added', { data })
      return 'success';
    } catch (writerError) {
      // emit('Employee.AddFailed', { data }) ???
      server.logger().debug(writerError);
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
