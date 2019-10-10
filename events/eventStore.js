const Podium = require('@hapi/podium');
const uuid = require('uuid/v4');

/**
 * Create a new Podium Event Emitter to act as the central EventStore
 * @type {internals.Podium}
 */
const _emitterSource = new Podium({name: 'eventStore', channels: ['eventOccurred', 'unknownEvent']});
const __Handle = _emitterSource.addListener('eventStore', () => {
  console.log('GOT HANDLE');
})

//console.log('event list ' + JSON.stringify(a._eventListeners['eventStore'], null, 2));

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
  console.log(`called external ${Date.now()}`);
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

    console.log(`register external event ${eventName} with ${JSON.stringify(options)}`)
    await _emitterSource.registerEvent({name: eventName, shared: true}, options)

    await _emitterSource.on(eventName, (data) => {
      console.log("EmitterSource handler proxy");
      _eventStore.push(createEventData(data));
      if (handler && typeof handler == "function") {
        console.log("GOT HERE")
        handler(data);
      }
    })
    console.log('event list ' + JSON.stringify(Object.keys(__Handle._eventListeners), null, 2));
    console.log('event' + JSON.stringify(__Handle._eventListeners["newEvent"], null, 2));
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




