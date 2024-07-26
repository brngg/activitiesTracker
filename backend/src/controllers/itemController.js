// src/controllers/itemController.js
const Item = require('../models/Item');
const User = require('../models/User');

exports.createItem = async (req, res) => {
  try {
    //console.log('Creating item with userId:', req.userId); // Debug line
    //console.log('Request body:', req.body); // Debug line

    const newItem = new Item({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      status: req.body.status || false,
      user: req.userId // Associate item with the current user
    });

    const savedItem = await newItem.save();
    await User.findByIdAndUpdate(req.userId, { $push: { savedItems: savedItem._id } });
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error.message); // Debug line
    res.status(400).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.userId, { $pull: { savedItems: req.params.id } });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting item');
  }
};

exports.modifyItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allowedUpdates = ['name', 'type', 'location', 'status'];

    // Remove 'dateAdded' from updates
    delete updates.dateAdded;

    // Filter and apply updates
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) || key.startsWith('location.'))
      .reduce((obj, key) => {
        if (key.startsWith('location.')) {
          obj['location'] = obj['location'] || {};
          obj['location'][key.substring(9)] = updates[key];
        } else {
          obj[key] = updates[key];
        }
        return obj;
      }, {});

    // Find and update the item
    const item = await Item.findOne({ _id: id, user: req.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, filteredUpdates, { 
      new: true, 
      runValidators: true 
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error modifying item:', error.message); // Debug line
    res.status(500).json({ message: 'Error modifying item', error: error.message });
  }
};

exports.saveItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);

    if (!item || !item.user.equals(req.userId)) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }

    // Convert ObjectId to string
    const itemIdString = item._id.toString();

    // Ensure the savedItems array in User model stores both ObjectId and string representations
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { savedItems: { $each: [item._id, itemIdString] } }
    });

    res.status(200).json({ message: 'Item saved successfully' });
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ message: 'Error saving item' });
  }
};

exports.unsaveItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);

    if (!item || !item.user.equals(req.userId)) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }

    // Convert ObjectId to string
    const itemIdString = item._id.toString();

    // Ensure the savedItems array in User model removes both ObjectId and string representations
    await User.findByIdAndUpdate(req.userId, {
      $pull: { savedItems: { $in: [item._id, itemIdString] } }
    });

    res.status(200).json({ message: 'Item unsaved successfully' });
  } catch (error) {
    console.error('Error unsaving item:', error);
    res.status(500).json({ message: 'Error unsaving item' });
  }
};

exports.getSavedItems = async (req, res) => {
  try {
    // Retrieve the user
    const user = await User.findById(req.userId).populate('savedItems');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the saved items
    res.status(200).json(user.savedItems);
  } catch (error) {
    console.error('Error retrieving saved items:', error);
    res.status(500).json({ message: 'Error retrieving saved items' });
  }
};

