const tripService = require('../services/tripService');
const { validationResult } = require('express-validator');

// POST /api/trips
const createTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const tripData = { ...req.body };
    if (tripData.userId) delete tripData.userId; // explicitly ignore client userId

    const trip = await tripService.createTrip(req.user._id, tripData);
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trips
const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getUserTrips(req.user._id);
    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trips/:id
const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.user._id, req.params.id);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }
    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/trips/:id
const updateTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const trip = await tripService.updateTrip(req.user._id, req.params.id, req.body);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await tripService.deleteTrip(req.user._id, req.params.id);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    res.json({
      success: true,
      message: 'Trip deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
