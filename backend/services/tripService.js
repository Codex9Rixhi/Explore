const Trip = require('../models/Trip');

const createTrip = async (userId, tripData) => {
  // Enforce userId assignment internally, not from user payload
  const newTrip = new Trip({
    ...tripData,
    userId,
  });
  return await newTrip.save();
};

const getUserTrips = async (userId) => {
  return await Trip.find({ userId }).sort({ createdAt: -1 });
};

const getTripById = async (userId, tripId) => {
  // Enforce ownership natively at DB layer
  return await Trip.findOne({ _id: tripId, userId });
};

const updateTrip = async (userId, tripId, updateData) => {
  // Strip userId if the client sneaked it in
  if (updateData.userId) {
    delete updateData.userId;
  }
  
  // Enforce ownership during findOneAndUpdate
  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  return trip;
};

const deleteTrip = async (userId, tripId) => {
  return await Trip.findOneAndDelete({ _id: tripId, userId });
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
};
