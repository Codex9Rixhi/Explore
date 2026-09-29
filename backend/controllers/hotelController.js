const Hotel = require('../models/Hotel');

// GET /api/hotels
const getHotels = async (req, res, next) => {
  try {
    const { destination, maxPrice, rating } = req.query;
    let query = {};

    if (destination) {
      query.destinationId = destination;
    }
    if (maxPrice) {
      query.pricePerNight = { $lte: Number(maxPrice) };
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const hotels = await Hotel.find(query);
    res.json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/hotels/:id
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }
    res.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getHotelById,
};
