function writeRepo (options){

    if (!options || !options.writeModel) {
      throw new Error('Options.writeModel is required');
    }
    this.writeModel = options.writeModel

  this.create = async function(data) {
      console.log("writeRepo:create")
      return await this.writeModel.create(data);
  }

  this.update = async function (data) {
      return await this.writeModel.update(data)
  }

}

module.exports = writeRepo;
