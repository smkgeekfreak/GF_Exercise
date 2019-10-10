const Podium = require('@hapi/podium');
const uuid = require('uuid/v4');
const Logger = require('../logger')('eventstore',process.env.PHOENIX_GATEWAY_SERVER_LOG_LEVEL);

/**
 * Create a new Podium Event Emitter to act as the central EventStore
 * @type {internals.Podium}
 */
const _emitterSource = new Podium({name: 'eventStore', channels: ['eventOccurred', 'unknownEvent']});
/**
 * Gives access to the listeners collection
 */
const __Handle = _emitterSource.addListener('eventStore', () => {
})


/**
 * Internal in memory storage for events
 * @type {Array}
 * @private
 */
const _eventStore = [];

/**
 * Handler to listen for eventOccurred as add to the
 */
const _handler = _emitterSource.on('eventStore', (data) => {
  Logger.debug(`called external ${Date.now()}`);
  _eventStore.push(createEventData(data));
});

/**
 *
 * @param eventName
 * @param options
 * @param handler
 * @returns {Promise<void>}
 * @private
 */
const _register = async (eventName, options, handler) => {
  try {

    Logger.debug(`register external event ${eventName} with ${JSON.stringify(options)}`)
    await _emitterSource.registerEvent({name: eventName, shared: true}, options)

    await _emitterSource.on(eventName, (data) => {
      Logger.debug("EmitterSource handler proxy");
      _eventStore.push(createEventData(data));
      if (handler && typeof handler == "function") {
        Logger.debug("GOT HERE")
        handler(data);
      }
    })
  } catch (regError) {
    console.error('error' + regError);
  }
}

function createEventData(data) {
  return {
    id:      uuid(),
    name:    data.name,
    stamp:   Date.now(),
    payload: data.payload,
  }
}

module.exports = _emitterSource;
module.exports.Store = _eventStore;
module.exports.registerNewChannel = _register;




