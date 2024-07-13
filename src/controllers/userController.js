// src/controllers/userController.js
const User = require('../models/User');



exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Remember to hash this in a real application!
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id.trim(); // Trim any extra whitespace
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
};
