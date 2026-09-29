const express = require('express');
const router = express.Router();
const { createItinerary } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const mongoose = require('mongoose');

router.post(
  '/',
  protect,
  [
    body('destinationId')
      .notEmpty().withMessage('destinationId is required')
      .custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('destinationId must be a valid MongoDB ObjectId'),
    body('days')
      .notEmpty().withMessage('days is required')
      .isInt({ gt: 0 }).withMessage('days must be an integer greater than 0'),
    body('budget')
      .notEmpty().withMessage('budget is required')
      .isNumeric().withMessage('budget must be numeric')
      .custom((value) => value > 0).withMessage('budget must be greater than 0'),
  ],
  createItinerary
);

module.exports = router;
