// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/email', authMiddleware, userController.updateEmail);
router.put('/password', authMiddleware, userController.updatePassword);

module.exports = router;