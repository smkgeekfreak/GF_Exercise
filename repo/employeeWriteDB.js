//function userDB () {
//  this.create = async (data) => {
//    console.log(`called addUser with ${JSON.stringify(data)}`);
//  },
//  this.update = async (data) => {
//    console.log(`called updateUser with ${JSON.stringify(data)}`);
//  }
//}
//module.exports = userDB;
const employeesDB = {
  create: async (data) => {
    console.log(`create employee with ${JSON.stringify(data)}`);
    return 'success'
  },
  update: async (data) => {
    console.log(`update employee with ${JSON.stringify(data)}`);
    return 'success'
  }
}
module.exports = employeesDB;
