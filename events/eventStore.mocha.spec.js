const  expect = require('chai').expect;
const Podium = require('@hapi/podium');

describe('eventStore-sample', async () => {


  it('Local Emit Event', async () => {
    const emitterStore = new Podium('eventOccurred');
    const _eventStore = [];
    const emitter = new Podium('eventOccurred');
    const once = emitterStore.once('eventOccurred');
    const emitterSource = new Podium([emitterStore,emitter]);
    emitterSource.on('eventOccurred', (data) => {
      console.log("called "+ Date.now())
      _eventStore.push({event: data, stamp: Date.now()});
    });
    await emitterStore.emit('eventOccurred', JSON.stringify({name:"userAddRequested", payload:{user: {name:'shawn'}}}));

    await emitterSource.emit('eventOccurred', JSON.stringify({name:"userAddRequested", payload:{user: {name:'source'}}}));
    console.log(_eventStore);
    await emitter.emit('eventOccurred', JSON.stringify({name:"userAddRequested", payload:{user: {name:'ansley'}}}));
    console.log(_eventStore);
  });
  it('combines multiple sources', async () => {

    const source1 = new Podium('test');
    const source2 = new Podium('test');

    const emitter = new Podium();
    emitter.registerPodium(source1);
    emitter.registerPodium(source2);

    let counter = 0;
    emitter.on('test', (data) => {

      console.log('called ' + Date.now());
      ++counter;
      expect(data).to.equal(1);
    });

    source1.emit('test', 1);
    await source2.emit('test', 1);
    expect(counter).to.equal(2);
  });
  it('invokes a handler with context', async () => {

    const emitter = new Podium('test');
    const context = { count: 0 };
    const handler = function () {

      ++this.count;
    };

    emitter.on('test', handler, context);

    emitter.emit('test');
    emitter.emit('test');
    await emitter.emit('test', null);
    expect(context.count).to.equal(3);
  });
  it('Emit Event', async () => {
//    const server = await getServer();

//    console.log(`Plugins: ${JSON.stringify(server.plugins)}`);
//    expect(server.plugins).to.have.keys(['Leviathan API', 'PhoenixProxy','PhoenixUserProxy'] );

    const EventStore = await require('./eventStore');

    const emitterStore = new Podium('eventOccurred');
    const emitter = new Podium('eventOccurred');
    EventStore.registerPodium(emitterStore);
    EventStore.registerPodium(emitter);
//    emitterStore.emit('eventOccurred', 123);
//    await emitterStore.emit('eventOccurred', 456);
//    const [result] = await once;
//    console.log(result);
//    emitterSource.on('eventOccurred', (data) => {
//      console.log("called "+ Date.now())
//      _eventStore.push({event: data, stamp: Date.now()});
//    });
    await emitterStore.emit('eventOccurred', JSON.stringify({name:"userAddRequested", payload:{user: {name:'shawn'}}}));
//    console.log(_eventStore);
    await emitter.emit('eventOccurred', JSON.stringify({name:"userAddRequested", payload:{user: {name:'ansley'}}}));
    console.log(EventStore.Store);
  });

  it('Add external event', async () => {
    const EventStore = await require('./eventStore');

    const emitterStore = new Podium('eventOccurred');
    const emitter = new Podium(['eventOccurred']);

    const newEventHandler = async () => {
      console.log ("called newEventHandler")
    }
    const newEventHandler2 = async () => {
      console.log ("called newEventHandler2")
    }

    await EventStore.registerPodium(emitterStore);
    await EventStore.registerPodium(emitter);
    await EventStore.registerEvent('newEvent');
    await EventStore.registerNewChannel('newEvent', {}, newEventHandler);
    emitter.registerEvent('newEvent');
//    emitter.on('newEvent', (data)=>{
//      console.log("emitter new Event");
//    })
    await emitterStore.emit('eventOccurred', {name:"userAddRequested", payload:{user: {name:'shawn'}}});
//    console.log(_eventStore);
    await emitter.emit('eventOccurred', {name:"userAddRequested", payload:{user: {name:'ansley'}}});
    console.log(JSON.stringify(EventStore.Store,null, 2));
    await emitter.emit('newEvent',  {name:"userSuspended", payload:{user: {name:'parkey'}}});

    await EventStore.registerNewChannel('newEvent2', {}, newEventHandler2);
    emitter.registerEvent('newEvent2');
    await emitter.emit('newEvent2',  {name:"userApproved", payload:{user: {name:'shockey'}}});
    console.log(JSON.stringify(EventStore.Store,null, 2));
    await EventStore.emit('newEvent2', {name:"userAddRequested", payload:{user: {name:'shawn'}}});
    console.log(JSON.stringify(EventStore.Store,null, 2));
  });
});
