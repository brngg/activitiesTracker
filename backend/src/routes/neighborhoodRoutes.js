const express = require('express');
const router = express.Router();
const neighborhoodController = require('../controllers/neighborhoodController');

router.get('/', neighborhoodController.getBoroughs);
router.get('/:borough', neighborhoodController.getNeighborhoodsByBorough);
router.get('/:borough/:neighborhood', neighborhoodController.getZipcodesByBoroughAndNeighborhood);

module.exports = router;