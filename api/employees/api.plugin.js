'use strict';
const Joi = require('@hapi/joi');
const pkg = require('./package');
const Wreck = require('@hapi/wreck');
const WriteRepo = require('../../repo/writeRepo')

/**
 * Temporary fix to store server and service for use outside register. There's
 * a better way to do this but it will take a little rework
 */
let _service;
let _server;
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
      isInternal:false,
      description: `Returns ping for ${pkg.name}`,
      notes:       "Returns a ping response",
      tags:        ['api'], // include 'api' tag to show in swagger
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

/**
 *
 * @param routeOptions
 * @returns {{path: string, method: string, options: {handler: {proxy: {onResponse: (function(*, *=, *, *, *, *): {payload: *, statusCode: *}), mapUri: (function(*): {uri: string})}}, tags: string[]}}}
 */
const getEmployees = (routeOptions) => {
  _server.log('debug','getemployees');
  _server.log('debug',routeOptions);
  //TODO: Add routeOptions for user/key
  return {
    method:  'GET',
    path:    '/',
    options: {
      tags:    ['employee','api', 'get'],
      handler: function (request, h) {
        return {"info": {version: pkg.version}};
      }
    },
  }
}
/**
 *
 * @param routeOptions
 * @returns {{path: string, method: string, options: {handler: (function(*, *): string), tags: string[]}}}
 */
const addEmployee= (routeOptions) => {
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
        request.log('debug',"add employee handler");
        request.log('debug',routeOptions);
        //DONE: replace with command to employees service
        const result = await _server.plugins['Service.Employees'].addEmployees({name:"not used yet"})
        _server.logger().debug(pkg.name, result);
        return result;
      }
    },
  }
}

const register = async (server, options) => {
  _server = server;
  server.logger().debug('register')
  _server.logger().debug('re-register')
  _service = options.service;
  await server.register(require('@hapi/h2o2'), { once: true });
  server.dependency(['Service.Employees']);
  //Push all
  let routes = [];
  routes.push(pingRoute());
  routes.push(getEmployees(options));
  routes.push(addEmployee({writeModel:options.writeModel}));
  // Load all routes into server
  server.route(routes);

  await server.expose('describe', async () => {
    server.log('debug', `expose yourself to something else in ${options.name}`)
    return {}
  });
}

function ApiPlugin (pkg) {
  return {
    pkg:      pkg,
    register: register,
  }
};

module.exports = ApiPlugin;
