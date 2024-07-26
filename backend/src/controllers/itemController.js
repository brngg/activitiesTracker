// src/controllers/itemController.js
const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      type: req.body.type,
      location: {
        neighborhood: req.body.location.neighborhood,
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

exports.modifyItem = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the item ID is passed in the URL
    const updates = req.body; // The fields to update

    delete updates.dateAdded;

    const allowedUpdates = [
      'name', 
      'type', 
      'location.neighborhood', 
      'location.borough', 
      'location.address', 
      'location.zipcode', 
      'status'
    ];

    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) || key === 'location')
      .reduce((obj, key) => {
        if (key === 'location') {
          obj[key] = Object.keys(updates[key])
            .filter(locKey => allowedUpdates.includes(`location.${locKey}`))
            .reduce((locObj, locKey) => {
              locObj[locKey] = updates[key][locKey];
              return locObj;
            }, {});
        } else {
          obj[key] = updates[key];
        }
        return obj;
      }, {});

    const updatedItem = await Item.findByIdAndUpdate(id, filteredUpdates, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error modifying item:', error);
    res.status(500).json({ message: 'Error modifying item', error: error.message });
  }
};
