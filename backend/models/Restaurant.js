const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cuisine: [String],
  priceRange: String,
  rating: Number,
  address: String,
  latitude: Number,
  longitude: Number,
  images: [String],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
