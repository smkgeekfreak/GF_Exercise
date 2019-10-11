class writeRepo {
  constructor(options){
    if (!options || !options.writeModel) {
      throw new Error('Options.writeModel is required');
    }
    this.writeModel = options.writeModel
   }

  async create (data) {
//      options.logger.debug("writeRepo:create")
      return await this.writeModel.create(data);
  }

  async update (data) {
      return await this.writeModel.update(data)
  }

}

module.exports = writeRepo;
