const Trip = require('../models/Trip');
const Attraction = require('../models/Attraction');

const resolveTripAttractions = async (trip) => {
  if (!trip || !trip.itinerary || !Array.isArray(trip.itinerary)) return trip;

  let attractions = null;
  const destId = trip.destinationId?._id || trip.destinationId;
  if (destId) {
    attractions = await Attraction.find({ destinationId: destId }).sort({ cost: 1, name: 1 });
  }

  const attractionsMap = new Map();
  if (attractions) {
    attractions.forEach(attr => {
      attractionsMap.set(attr._id.toString(), attr);
    });
  }

  let modified = false;

  for (const dayPlan of trip.itinerary) {
    if (!dayPlan.activities || !Array.isArray(dayPlan.activities)) continue;

    let attractionIndex = 0;

    for (const activity of dayPlan.activities) {
      if (activity.type === 'meal') {
        if (!activity.title || activity.title === 'Lunch') {
          activity.title = 'Lunch Break';
          modified = true;
        }
        if (!activity.place) {
          activity.place = 'Lunch Break';
          modified = true;
        }
      } else {
        // It's an attraction
        let foundAttr = null;

        // Check if attractionId exists or attraction is an ObjectId
        const candidateId = activity.attractionId || 
          (activity.attraction && (activity.attraction._id || (typeof activity.attraction === 'string' || activity.attraction.constructor?.name === 'ObjectId' ? activity.attraction : null)));

        if (candidateId) {
          const idStr = candidateId.toString();
          if (attractionsMap.has(idStr)) {
            foundAttr = attractionsMap.get(idStr);
          } else {
            foundAttr = await Attraction.findById(candidateId);
          }
        }

        // If not found by ID, try matching by place or attraction.name
        const nameToMatch = activity.place || (typeof activity.attraction === 'object' && activity.attraction?.name);
        if (!foundAttr && nameToMatch) {
          if (attractions) {
            foundAttr = attractions.find(a => a.name === nameToMatch);
          }
          if (!foundAttr) {
            foundAttr = await Attraction.findOne({ name: nameToMatch });
          }
        }

        // Fallback for older itineraries where attraction details were stripped
        if (!foundAttr && attractions && attractions.length > 0) {
          const matchByCost = attractions.filter(a => (a.cost || 0) === (activity.estimatedCost || 0));
          if (matchByCost.length === 1) {
            foundAttr = matchByCost[0];
          } else if (matchByCost.length > 1) {
            foundAttr = matchByCost[attractionIndex % matchByCost.length];
          } else {
            foundAttr = attractions[attractionIndex % attractions.length];
          }
        }

        if (foundAttr) {
          if (!activity.place || activity.place !== foundAttr.name) {
            activity.place = foundAttr.name;
            modified = true;
          }
          if (!activity.title || activity.title !== foundAttr.name) {
            activity.title = foundAttr.name;
            modified = true;
          }
          if (!activity.attractionId) {
            activity.attractionId = foundAttr._id;
            modified = true;
          }
          if (!activity.attraction || !activity.attraction.name) {
            activity.attraction = {
              _id: foundAttr._id,
              destinationId: foundAttr.destinationId,
              name: foundAttr.name,
              description: foundAttr.description,
              category: foundAttr.category,
              duration: foundAttr.duration,
              cost: foundAttr.cost,
              openingTime: foundAttr.openingTime,
              closingTime: foundAttr.closingTime,
              latitude: foundAttr.latitude,
              longitude: foundAttr.longitude,
              image: foundAttr.image,
            };
            modified = true;
          }
          if (!activity.description && foundAttr.description) {
            activity.description = foundAttr.description;
            modified = true;
          }
        }

        attractionIndex++;
      }
    }
  }

  if (modified && trip._id) {
    try {
      await Trip.updateOne({ _id: trip._id }, { $set: { itinerary: trip.itinerary } });
    } catch (e) {
      console.error('Failed to update persisted trip itinerary:', e);
    }
  }

  return trip;
};

const createTrip = async (userId, tripData) => {
  // Ensure activities have place, title, and attraction populated before save
  if (tripData.itinerary && Array.isArray(tripData.itinerary)) {
    for (const dayPlan of tripData.itinerary) {
      if (!dayPlan.activities || !Array.isArray(dayPlan.activities)) continue;
      for (const activity of dayPlan.activities) {
        if (activity.type === 'meal') {
          activity.title = activity.title || 'Lunch Break';
          activity.place = activity.place || 'Lunch Break';
        } else if (activity.type === 'attraction') {
          if (activity.attraction && typeof activity.attraction === 'object') {
            activity.place = activity.place || activity.attraction.name;
            activity.title = activity.title || activity.attraction.name;
            activity.attractionId = activity.attractionId || activity.attraction._id;
            activity.description = activity.description || activity.attraction.description;
          }
        }
      }
    }
  }

  // Enforce userId assignment internally, not from user payload
  const newTrip = new Trip({
    ...tripData,
    userId,
  });
  const savedTrip = await newTrip.save();
  await resolveTripAttractions(savedTrip);
  return savedTrip;
};

const getUserTrips = async (userId) => {
  const trips = await Trip.find({ userId }).populate('destinationId').sort({ createdAt: -1 });
  for (const trip of trips) {
    await resolveTripAttractions(trip);
  }
  return trips;
};

const getTripById = async (userId, tripId) => {
  // Enforce ownership natively at DB layer
  const trip = await Trip.findOne({ _id: tripId, userId }).populate('destinationId');
  if (trip) {
    await resolveTripAttractions(trip);
  }
  return trip;
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
  ).populate('destinationId');
  
  if (trip) {
    await resolveTripAttractions(trip);
  }
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
  deleteTrip,
  resolveTripAttractions
};
