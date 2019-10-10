const expect = require('chai').expect;
const dotenv = require('dotenv').config({path:'../.env'});
const Logger = require('../logger')("model-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL)
const writeRepo = require('./writeRepo');

describe('writeRepo Spec', () => {
  it('Load Model', async () => {
    const wRepo = new writeRepo({writeModel:new (require('./employeeWriterDB'))(Logger)});
    expect(await wRepo.create({name:"shawn"})).to.equal('success');
    expect(await wRepo.create({name:"is"})).to.equal('success');
    expect(await wRepo.create({name:"the"})).to.equal('success');
    expect(await wRepo.create({name:"next"})).to.equal('success');
    expect(await wRepo.create({name:"grow flow employee"})).to.equal('success');
  });

});
