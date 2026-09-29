const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const mongoose = require('mongoose');

const validateTrip = [
  body('destinationId')
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('destinationId must be a valid MongoDB ObjectId'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('budget must be numeric')
    .custom((value) => value > 0)
    .withMessage('budget must be greater than 0'),
  body('days')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('days must be an integer greater than 0'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('interests must be an array'),
  body('totalCost')
    .optional()
    .isNumeric()
    .withMessage('totalCost must be numeric')
    .custom((value) => value >= 0)
    .withMessage('totalCost must be greater than or equal to 0'),
];

router
  .route('/')
  .post(protect, validateTrip, createTrip)
  .get(protect, getTrips);

router
  .route('/:id')
  .get(protect, getTripById)
  .put(protect, validateTrip, updateTrip)
  .delete(protect, deleteTrip);

module.exports = router;
