const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById } = require('../controllers/restaurantController');

router.route('/').get(getRestaurants);
router.route('/:id').get(getRestaurantById);

module.exports = router;
