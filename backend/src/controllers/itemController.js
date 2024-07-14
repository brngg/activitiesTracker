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

exports.deleteItem = async (req, res) => {
  try {
    const itemName = req.params.name.trim(); // Trim any extra whitespace
    const result = await Item.deleteOne({ name: itemName });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting item');
  }
};

