const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  borough: String,
  neighborhood: String,
  zipcode: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  }
});

module.exports = mongoose.model('Neighborhood', neighborhoodSchema);