// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9_]+$/,  // This regex allows only alphanumeric characters and underscores
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

// Enforce schema level validation
userSchema.set('strict', 'throw'); // Throw errors for unrecognized paths

module.exports = mongoose.model('User', userSchema);
