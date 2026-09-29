const express = require('express');
const router = express.Router();
const { getHotels, getHotelById } = require('../controllers/hotelController');

router.route('/').get(getHotels);
router.route('/:id').get(getHotelById);

module.exports = router;
