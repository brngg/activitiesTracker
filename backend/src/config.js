// src/config.js
require('dotenv').config(); // Load environment variables

const config = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 3000,
};

module.exports = config;
