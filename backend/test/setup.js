const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, importNeighborhoods } = require('../src/scripts/import_neighborhoods');
const Neighborhood = require('../src/models/neighborhood'); // Ensure this path is correct

let mongoServer;

beforeAll(async () => {
  try {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Ensure mongoose is disconnected from any previous connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Connect to the in-memory MongoDB server
    await connectDB(uri);
   
    // Import initial data into the in-memory database
    await importNeighborhoods();

    // Count and log the number of imported neighborhoods
    const neighborhoodCount = await Neighborhood.countDocuments();
    console.log(`Total number of imported neighborhoods: ${neighborhoodCount}`);

  } catch (err) {
    console.error('Error setting up test environment:', err);
    throw err;
  }
}, 60000); // Increase timeout if needed for larger data setups

beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
  
  // Import fresh data for each test
  await importNeighborhoods();
  const neighborhoodCount = await Neighborhood.countDocuments();
  console.log(`Total number of imported neighborhoods: ${neighborhoodCount}`);
});

afterAll(async () => {
  // Disconnect mongoose and stop in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear all collections to ensure tests run in isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
});