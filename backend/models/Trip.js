const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    startDate: Date,
    endDate: Date,
    days: Number,
    budget: Number,
    interests: [String],
    itinerary: [
      {
        day: Number,
        estimatedCost: Number,
        activities: [
          {
            time: String,
            place: String,
            title: String,
            type: {
              type: String, // 'type' is a reserved keyword in Mongoose schema if not configured as object
            },
            attractionId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Attraction',
            },
            attraction: {
              type: mongoose.Schema.Types.Mixed,
            },
            description: String,
            estimatedCost: Number,
            duration: Number,
          },
        ],
      },
    ],
    totalEstimatedCost: Number,
    totalCost: Number,
  },
  { timestamps: true }
);

tripSchema.index({ userId: 1 });

module.exports = mongoose.model('Trip', tripSchema);
