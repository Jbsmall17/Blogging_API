const {MongoMemoryServer} = require("mongodb-memory-server");
const mongoose = require("mongoose")

let mongod; 
async function connect(){

  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();


  await mongoose.connect(uri)
}

async function cleardata(){
  await mongoose.connection.db.dropDatabase();
}


async function disconnect(){
  await mongoose.disconnect()
  await mongod.stop()
}


module.exports = {
  connect,
  cleardata,
  disconnect
}