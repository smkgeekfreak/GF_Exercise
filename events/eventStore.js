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
 * Internal in memory storage for events - TODO:temporary
 * @type {Array}
 * @private
 */
const _eventStore = [];

/**
 * Handler to listen for eventOccurred as add to the
 */
const _handler = _emitterSource.on('eventStore', (data) => {
  Logger.debug(`Received event on ${Date.now()} with ${data} `);
  //TODO:replace this with Message Queue or DB
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
      Logger.debug(`${eventName}: ${JSON.stringify(data)} `);
      //TODO:replace this with Message Queue or DB
      _eventStore.push(createEventData(eventName, data));
      if (handler && typeof handler == "function") {
        Logger.debug("GOT HERE")
        handler(data);
      }
    })
  } catch (regError) {
    console.error('error' + regError);
  }
}

function createEventData(eventName, data) {
  return {
    id:      uuid(),
    name:    eventName,
    stamp:   Date.now(),
    payload: data,
  }
}

const initStore = async () => {
  try {
    const Events = require('./events');
    if (Events) {
      for (const event of Object.keys(Events)) {
        Logger.debug(Events[event]);
        await _register(Events[event]);
      }
    }
  } catch (eventsErr) {
    Logger.error(eventsErr);
    throw eventsErr;
  }
};
initStore();
module.exports = _emitterSource;
module.exports.Store = _eventStore;
module.exports.registerNewChannel = _register;




