// src/server.js
/*const mongoose = require('mongoose');
const config = require('./config');
const app = require('./index');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

// Graceful shutdown function
async function gracefulShutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    server.close(() => {
      console.log('Express server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error(`Error during ${signal} shutdown:`, err);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  await gracefulShutdown('Uncaught Exception');
});

module.exports = server; // Export for testing purposes*/