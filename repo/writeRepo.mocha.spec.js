const expect = require('chai').expect;
const writeRepo = require('./writeRepo');
describe('writeRepo Spec', () => {

  it('Load Model', async () => {
    const wRepo = new writeRepo({writeModel:require('./employeeWriteDB')});
    expect(await wRepo.create({name:"shawn"})).to.equal('success');
    expect(await wRepo.create({name:"is"})).to.equal('success');
    expect(await wRepo.create({name:"the"})).to.equal('success');
    expect(await wRepo.create({name:"next"})).to.equal('success');
    expect(await wRepo.create({name:"grow flow employee"})).to.equal('success');
  });

});
