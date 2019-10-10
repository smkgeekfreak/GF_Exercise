const mongoose = require('mongoose');
const mgOptions = {
  autoIndex:         false, // Don't build indexes
  reconnectTries:    30, // Retry up to 30 times
  reconnectInterval: 5000, // Reconnect every 500ms
  poolSize:          10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries:  0,
  useNewUrlParser:   true
}
const employeeSchema = new mongoose.Schema(
  {
    email: String,
    id: String,
    role: String,
    telephone: String,
    lastName: String,
    firstName: String
  });

/**
 * Writer implmentation for employee
 */
class employeeWriterDB {
  //TODO: refactor arguments into options object
  constructor(logger, connection) {
    this._logger = logger;
    this._connectionString = connection || "mongodb://localhost:32768/newtest";
  }

  async create(data) {
    this._logger.debug(`create employee with ${JSON.stringify(data)}`);
    const connection = await mongoose.connect(this._connectionString, mgOptions );
    this._logger.debug('connected');
    // Clear the database every time. This is for the sake of example only,
    // don't do this in prod :)
//    await mongoose.connection.dropDatabase();

    const mgEmployeeModel = mongoose.connection.model('Employee', employeeSchema);
    await mgEmployeeModel.create(data);
    // Find all employees
    const ees = await mgEmployeeModel.find();
    this._logger.debug((ees));
    await mongoose.disconnect();
    this._logger.debug('disconnected');
    return 'success'
  }

  async update(data) {
    this._logger.debug(`update employee with ${JSON.stringify(data)}`);
    return 'success'
    return await this.writeModel.update(data)
  }
}


module.exports = employeeWriterDB;
