// src/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const itemController = require('../controllers/itemController');

router.post('/', auth, itemController.createItem);
//router.delete('/:id', auth, itemController.deleteItem);
//router.put('/:id', auth, itemController.modifyItem);
//router.post('/:id/save', auth, itemController.saveItem);
//router.post('/:id/unsave', auth, itemController.unsaveItem);

module.exports = router;
