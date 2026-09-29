const { generateItinerary } = require('../services/itineraryService');
const { validationResult } = require('express-validator');

const createItinerary = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { destinationId, days, budget } = req.body;

    try {
      const itineraryData = await generateItinerary({ destinationId, days, budget });
      res.json({
        success: true,
        data: itineraryData,
      });
    } catch (error) {
      if (error.status) {
        res.status(error.status);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItinerary,
};
