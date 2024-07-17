// src/controllers/userController.js
const User = require('../models/User');

exports.createUser = async (req, res) => {
  console.log('Received data:', req.body);
  try {
    const { username, email, password } = req.body;
   
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
    }

    // Check email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user instance
    const newUser = new User({ username, email, password });
    
    // Save the user to the database
    const savedUser = await newUser.save();
    
    // Respond with the saved user object (excluding password)
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Handle other errors
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Utility function to validate email format
function isValidEmail(email) {
  // Use a regex or any other method to validate email format
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
