const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  duration: Number,
  cost: Number,
  openingTime: String,
  closingTime: String,
  latitude: Number,
  longitude: Number,
  image: String,
});

module.exports = mongoose.model('Attraction', attractionSchema);
