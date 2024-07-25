// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
module.exports = router;