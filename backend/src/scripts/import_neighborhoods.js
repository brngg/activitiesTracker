const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const config = require('../config');
const Neighborhood = require('../models/neighborhood');

async function connectDB(uri = config.mongoURI) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err;
  }
}

async function importNeighborhoods() {
  const csvFilePath = path.join(__dirname, '../data/nyc_neighborhoods.csv');
  const neighborhoods = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const borough = Object.values(row)[0];
        delete row[Object.keys(row)[0]];
        neighborhoods.push({
          borough: borough,
          neighborhood: row.Neighborhood,
          zipcode: row['Zip Code'],
          location: {
            type: 'Point',
            coordinates: [parseFloat(row.Longitude), parseFloat(row.Latitude)]
          }
        });
      })
      .on('end', async () => {
        try {
          await Neighborhood.createIndexes([
            { borough: 1 },
            { neighborhood: 1 },
            { location: '2dsphere' }
          ]);

          for (const neighborhood of neighborhoods) {
            await Neighborhood.updateOne(
              { borough: neighborhood.borough, neighborhood: neighborhood.neighborhood },
              neighborhood,
              { upsert: true }
            );
          }
          console.log('All neighborhoods processed successfully');
          resolve();
        } catch (err) {
          console.error('Error processing neighborhoods:', err);
          reject(err);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

module.exports = { connectDB, importNeighborhoods };