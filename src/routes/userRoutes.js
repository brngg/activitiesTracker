// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
// Add other routes as needed
router.delete('/:id', userController.deleteUser);

module.exports = router;