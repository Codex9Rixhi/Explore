const { getRecommendations } = require('../services/recommendationService');
const { validationResult } = require('express-validator');

const getDestinationRecommendations = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { budget, days, interests } = req.body;

    const recommendations = await getRecommendations({ budget, days, interests });

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinationRecommendations,
};
