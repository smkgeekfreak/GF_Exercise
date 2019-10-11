const expect = require('chai').expect;
const dotenv = require('dotenv').config({path:'../.env'});
const Logger = require('../logger')("model-test",process.env.PHOENIX_GATEWAY_TEST_LOG_LEVEL)
const writeRepo = require('./writeRepo');

describe('writeRepo Spec', () => {
  //TODO: skip tests until providing a mock/faker
  it('Load Model', async () => {
    const eemongo = require('./employeeWriterDB');
    const eeWriter = new eemongo(Logger, "mongodb://localhost:32768/newtest");
    const response = await eeWriter.create(      {
      email:'shawn@hired.com',
      id:' d643e381-df8c-43b2-844e-d816baca5828',
      role:'new employee',
      telephone: '615-540-4550',
      lastName:  'shawn ' + Math.random(),
      firstName:'kirch '
    });
    Logger.debug (response);
    expect(response.statusCode).to.equal('success');
  })
  it.skip('Load Model', async () => {
    const wRepo = new writeRepo({writeModel:new (require('./employeeWriterDB'))(Logger)});
    const result = wRepo.create(
      {
        email:'shawn@hired.com',
        id:' d643e381-df8c-43b2-844e-d816baca5828',
        role:'new employee',
        telephone: '615-540-4550',
        lastName:  'shawn',
        firstName:'kirch'
      });

    Logger.debug(result)
    expect(result.statusCode).to.equal('success ');
//    expect(await wRepo.create({name:"is"})).to.equal('success');
//    expect(await wRepo.create({name:"the"})).to.equal('success');
//    expect(await wRepo.create({name:"next"})).to.equal('success');
//    expect(await wRepo.create({name:"grow flow employee"})).to.equal('success');
  });

});
