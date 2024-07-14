const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);


// Start server
const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    server.close(() => {
      console.log('Express server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through SIGTERM signal');
    server.close(() => {
      console.log('Express server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught exception:', err);
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to uncaught exception');
      server.close(() => {
        console.log('Express server closed');
        process.exit(1); // Exit with failure code
      });
    } catch (closeErr) {
      console.error('Error closing MongoDB connection:', closeErr);
      process.exit(1);
    }
  });
