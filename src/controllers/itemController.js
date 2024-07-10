// src/controllers/itemController.js
const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      type: req.body.type,
      location: {
        city: req.body.location.city,
        borough: req.body.location.borough,
        address: req.body.location.address,
        zipcode: req.body.location.zipcode
      },
      status: req.body.status || false // Default to false if not provided
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

