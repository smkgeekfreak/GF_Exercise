'use strict';
const Joi = require('@hapi/joi');
const pkg = require('./package');
const Wreck = require('@hapi/wreck');

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
      isInternal:false, // DON'T EXPOSE to external clients will return 404 except from server.inject calls
      description: `Returns ping for ${pkg.name}`,
      notes:       "Returns a ping response",
      tags:        ['internal','api'], // include 'api' tag to show in swagger
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
  //TODO: Add routeOptions for user/key
  return {
    method:  'GET',
    path:    '/employees',
    options: {
//      isInternal:true, // DON'T EXPOSE to external clients will return 404 except from server.inject calls
//      tags:        ['internal'], // include 'api' tag to show in swagger
      tags:    ['api', 'get'],
      handler: {
        proxy: {
//          passThrough: true, //
          mapUri: function (request) {
            console.log('doing some additional stuff before redirecting');
            let {path, headers} = request;
            const uri = `${routeOptions.baseURL}/employee/?ApiUser=${headers.apiuser}&ApiKey=${headers.apikey}`
            console.log(uri)
            return {
              uri: uri
            }
          },
          onResponse: async function (err, res, request, h, settings, ttl) {
            let {headers} = request;
//            console.log(headers)
            console.log('receiving the response from the upstream.');
            const payload = await Wreck.read(res, {json:true, timeout:500});
//            console.log(payload);
            return {statusCode:res.statusCode, payload:payload, headers:res.headers};
//              const response = h.response(payload);
//              response.headers = res.headers;
//              return response;
//            });
          }
        }
      }
    },
  }
}
//const createOrderRoute = (routeOptions) => {
//  //TODO: Add routeOptions validate for writeModel
//  if (!routeOptions || !routeOptions.writeModel) {
//    throw new Error('routeOptions must include writeModel ');
//  }
//  return {
//    method:  'POST',
//    path:    '/',
//    options: {
//      tags:    ['api', 'post'],
//      handler: async function (request, h) {
//        const orderWriter = new writeModel({userDB: routeOptions.writeModel});
//        await orderWriter.create({name: "my name"});
//        return h.response().code(200);
//      }
//    },
//  }
//}

const register = async (server, options) => {
  server.logger().debug(JSON.stringify(options))
  let routes = [];
  //Push all
  await server.register(require('@hapi/h2o2'), { once: true });
  routes.push(pingRoute());
  routes.push(getEmployees(options));
//  routes.push(createOrderRoute({writeModel:options.writeModel}));
  // Load all routes into server
  server.route(routes);

  await server.expose('describe', async () => {
    server.logger().debug(`expose yourself to something else in ${options.name}`)
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
