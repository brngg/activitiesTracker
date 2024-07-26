const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const itemController = require('../controllers/itemController');

router.post('/', auth, itemController.createItem); // Create route
router.put('/:id', auth, itemController.modifyItem); // Update route
router.delete('/:id', auth, itemController.deleteItem); // Delete route
router.post('/save/:id', auth, itemController.saveItem); // Save route
router.post('/unsave/:id', auth, itemController.unsaveItem); // Unsave route
router.get('/saved', auth, itemController.getSavedItems); // Get saved items route

module.exports = router;
