const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: String,
    country: String,
    description: String,
    images: [String],
    interests: [String],
    budgetRange: {
      min: Number,
      max: Number,
    },
    recommendedDuration: Number,
    bestTimeToVisit: String,
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

destinationSchema.index({ interests: 1 });
destinationSchema.index({ 'budgetRange.min': 1, 'budgetRange.max': 1 });

module.exports = mongoose.model('Destination', destinationSchema);
