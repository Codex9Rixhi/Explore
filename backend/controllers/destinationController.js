const Destination = require('../models/Destination');
const Attraction = require('../models/Attraction');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const Trip = require('../models/Trip');
const { validationResult } = require('express-validator');

// GET /api/destinations
const getDestinations = async (req, res, next) => {
  try {
    const { budget, interest, duration } = req.query;
    let query = {};

    if (budget) {
      query['budgetRange.min'] = { $lte: Number(budget) };
      // Depending on interpretation, maybe budgetRange.max >= budget or budget is enough for min.
      // Usually, user's budget must be >= budgetRange.min. We will use:
      // query['budgetRange.min'] = { $lte: Number(budget) };
    }

    if (interest) {
      // Handle case insensitive match
      query.interests = { $regex: new RegExp(interest, 'i') };
    }

    if (duration) {
      // Maybe exact match or <= duration
      query.recommendedDuration = { $lte: Number(duration) };
    }

    const destinations = await Destination.find(query);
    res.json({
      success: true,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/destinations/:id
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      res.status(404);
      throw new Error('Destination not found');
    }

    const attractions = await Attraction.find({ destinationId: destination._id });

    // Return destination details and associated attractions
    res.json({
      success: true,
      data: {
        destination,
        attractions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/destinations
const createDestination = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/destinations/:id
const updateDestination = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      res.status(404);
      throw new Error('Destination not found');
    }

    res.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/destinations/:id
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      res.status(404);
      throw new Error('Destination not found');
    }

    // Cascade delete dependent records
    await Attraction.deleteMany({ destinationId: destination._id });
    await Hotel.deleteMany({ destinationId: destination._id });
    await Restaurant.deleteMany({ destinationId: destination._id });
    await Trip.deleteMany({ destinationId: destination._id });

    await destination.deleteOne();

    res.json({
      success: true,
      message: 'Destination and all associated records removed',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
