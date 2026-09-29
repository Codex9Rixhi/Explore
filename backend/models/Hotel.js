const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  pricePerNight: Number,
  rating: Number,
  amenities: [String],
  address: String,
  latitude: Number,
  longitude: Number,
  images: [String],
});

module.exports = mongoose.model('Hotel', hotelSchema);
