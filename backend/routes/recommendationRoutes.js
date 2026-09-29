const express = require('express');
const router = express.Router();
const { getDestinationRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post(
  '/',
  protect,
  [
    body('budget')
      .notEmpty().withMessage('Budget is required')
      .isNumeric().withMessage('Budget must be a number')
      .custom((value) => value > 0).withMessage('Budget must be greater than 0'),
    body('days')
      .notEmpty().withMessage('Days is required')
      .isInt({ gt: 0 }).withMessage('Days must be an integer greater than 0'),
    body('interests')
      .isArray({ min: 1 }).withMessage('Interests must be an array and contain at least one valid string')
      .custom((value) => value.every((i) => typeof i === 'string')).withMessage('Interests must only contain strings'),
  ],
  getDestinationRecommendations
);

module.exports = router;
