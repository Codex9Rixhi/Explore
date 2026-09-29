const Restaurant = require('../models/Restaurant');

// GET /api/restaurants
const getRestaurants = async (req, res, next) => {
  try {
    const { destination, cuisine, maxPrice } = req.query;
    let query = {};

    if (destination) {
      query.destinationId = destination;
    }
    if (cuisine) {
      query.cuisine = { $regex: new RegExp(cuisine, 'i') };
    }
    if (maxPrice) {
      // The priceRange field is a String, e.g., 'Budget', 'Moderate', 'Expensive'
      // This requirement: maxPrice must be handled sensibly based on the existing priceRange field.
      const price = Number(maxPrice);
      if (price <= 500) {
        query.priceRange = 'Budget';
      } else if (price <= 2000) {
        query.priceRange = { $in: ['Budget', 'Moderate'] };
      } else {
        // Expensive or any
        query.priceRange = { $in: ['Budget', 'Moderate', 'Expensive'] };
      }
    }

    const restaurants = await Restaurant.find(query);
    res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/:id
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }
    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
};
