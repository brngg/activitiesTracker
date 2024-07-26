// src/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.createItem);
router.delete('/:name', itemController.deleteItem);
router.put('/:id', itemController.modifyItem);

module.exports = router;
