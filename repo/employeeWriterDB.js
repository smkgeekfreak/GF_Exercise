class employeeWriterDB {
  constructor(logger) {
    this._logger = logger;
  }
  async create (data) {
    this._logger.debug(`create employee with ${JSON.stringify(data)}`);
    return 'success'
  }

  async update (data) {
    this._logger.debug(`update employee with ${JSON.stringify(data)}`);
    return 'success'
    return await this.writeModel.update(data)
  }
}

module.exports = employeeWriterDB;
