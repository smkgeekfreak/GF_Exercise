const pino = require('pino')

/**
 * Provide logger for instances where the Hapi logger system doesn't exist or is inaccessible
 * @param name
 * @param level
 * @constructor
 */
const Logger = (name, level) => pino({
        name:        name,
        level:       level|| 'info',
        prettyPrint: {
          colorize:true,
          levelFirst: false,
          ignore:'hostname'
        }
      })
module.exports = Logger;
