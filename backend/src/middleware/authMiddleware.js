// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    //console.log('Received token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId); // Ensure `userId` matches your JWT payload

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.log('Authentication failed:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;

//working for everything but item
/*const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token); // Debugging line
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging line
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.log('Authentication failed:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;*/
