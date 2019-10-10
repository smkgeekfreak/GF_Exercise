'use strict';
const Joi = require('@hapi/joi');
const pkg = require('./package');
const Wreck = require('@hapi/wreck');
const WriteRepo = require('../../repo/writeRepo')

//TODO: could move route definitions to separate files to reduce clutter
/**
 * Route defintions
 * @param routeOptions
 * @returns {{path: string, method: string, options: {handler: (function(*, *): {message: string, info: {version}}), notes: string, plugins: {"hapi-swagger": {responses: {"200": {schema: *, description: string}, "400": {description: string}}}}, description: string, tags: string[]}}}
 */
const pingRoute = (routeOptions) => {
  //TODO: Add routeOptions validate for writeModel
  return {
    method:  'GET',
    path:    '/ping',
    options: {
      description: "Returns ping for PhoenixOrderProxy",
      notes:       "Returns a ping response",
      tags:        ['api', 'ping'],
      handler:     function (request, h) {
        return {"info": {version: pkg.version}, "message": "PONG"};
      },
      plugins:     {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Smooth sail',
              schema:      Joi.object({
                equals: Joi.any()
              }).label('Result')
            },
            400: {
              description: 'Something wrong happened'
            }
          }
        }
      },
    }
  }
}
const getOrderRoute = (routeOptions) => {
  //TODO: Add routeOptions validate for writeModel
  return {
    method:  'GET',
    path:    '/',
    options: {
      tags:    ['api', 'get'],
      handler: function (request, h) {
        return {"info": {version: pkg.version}, "user": options.name};
      }
    },
  }
}
const addEmployees = (routeOptions) => {
  //TODO: Add routeOptions validate for writeModel
  if (!routeOptions || !routeOptions.writeModel) {
    throw new Error('routeOptions must include writeModel ');
  }
  return {
    method:  'POST',
    path:    '/',
    options: {
      tags:    ['api', 'post'],
      handler: async function (request, h) {
        const orderWriter = new writeModel({userDB: routeOptions.writeModel});
        await orderWriter.create({name: "my name"});
        return h.response().code(200);
      }
    },
  }
}

const otherRegister = async (server, options) => {
  let routes = [];
  //Push all
  routes.push(pingRoute());
  routes.push(getOrderRoute());
  routes.push(createOrderRoute({writeModel:options.writeModel}));
  // Load all routes into server
  server.route(routes);

  await server.expose('describe', async () => {
    console.log(`expose yourself to something else in ${options.name}`)
    return {}
  });
}

const register = async (server, options) => {
  console.log(`options = ${JSON.stringify(options)}`)
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
      console.log(`expose a wreck with  ${JSON.stringify(data)}`)
      const employeeWriter = new WriteRepo({writeModel: options.writeModel});
      await employeeWriter.create({name: "my name"});
      //
      // Send event for employee added
      return 'success';
    } catch (writerError) {
      console.log(writerError);
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

function SvcPlugin (pkg) {
  return {
    pkg:      pkg,
    register: register,
  }
};

module.exports = SvcPlugin;
