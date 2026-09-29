const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { body } = require('express-validator');

const destinationValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('budgetRange.min')
    .isNumeric()
    .withMessage('budgetRange.min is required and must be a number'),
  body('budgetRange.max')
    .isNumeric()
    .withMessage('budgetRange.max is required and must be a number'),
  body('recommendedDuration')
    .isNumeric()
    .withMessage('recommendedDuration is required and must be a number'),
  body('latitude').optional().isNumeric(),
  body('longitude').optional().isNumeric(),
];

router
  .route('/')
  .get(getDestinations)
  .post(protect, admin, destinationValidation, createDestination);

router
  .route('/:id')
  .get(getDestinationById)
  .put(protect, admin, destinationValidation, updateDestination)
  .delete(protect, admin, deleteDestination);

module.exports = router;
