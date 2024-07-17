// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const neighborhoodRoutes = require('./routes/neighborhoodRoutes');

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

module.exports = app;