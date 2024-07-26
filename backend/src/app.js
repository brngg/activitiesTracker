// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const neighborhoodRoutes = require('./routes/neighborhoodRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
