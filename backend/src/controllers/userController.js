const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Helper functions
const validateUserData = (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const checkDuplicateUsername = async (username) => {
  if (await User.exists({ username })) {
    throw new Error('Username already exists');
  }
};

// Controller functions
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    validateUserData(username, email, password);
    
    await checkDuplicateUsername(username);

    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('Username') || error.message.includes('email')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateEmail = async (req, res) => {
  //console.log('Update email controller hit');
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    if (!isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    user.email = req.body.email;
    await user.save();
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    console.log('Update email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  //console.log('Update password controller hit');
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}