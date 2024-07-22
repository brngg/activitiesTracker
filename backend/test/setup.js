const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const { connectDB, importNeighborhoods } = require(path.resolve(__dirname, '../src/scripts/import_neighborhoods'));
const Neighborhood = require('../src/models/neighborhood');

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await connectDB(uri);
    await importNeighborhoods();

    //const neighborhoodCount = await Neighborhood.countDocuments();
    //console.log(`Total number of imported neighborhoods: ${neighborhoodCount}`);
  } catch (err) {
    console.error('Error setting up test environment:', err);
    throw err;
  }
}, 60000);

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }

  await importNeighborhoods();
  //const neighborhoodCount = await Neighborhood.countDocuments();
  //console.log(`Total number of imported neighborhoods: ${neighborhoodCount}`);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
});