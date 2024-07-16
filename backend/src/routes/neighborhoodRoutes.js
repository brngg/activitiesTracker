const express = require('express');
const router = express.Router();
const neighborhoodController = require('../controllers/neighborhoodController');

router.get('/boroughs', neighborhoodController.getBoroughs);
router.get('/neighborhoods/:borough', neighborhoodController.getNeighborhoodsByBorough);
router.get('/zipcodes/:borough/:neighborhood', neighborhoodController.getZipcodesByBoroughAndNeighborhood);

module.exports = router;