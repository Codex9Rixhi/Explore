const Destination = require('../models/Destination');
const Attraction = require('../models/Attraction');

// Helper to format hour to HH:00
const formatTime = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

async function generateItinerary({ destinationId, days, budget }) {
  const destination = await Destination.findById(destinationId);
  if (!destination) {
    const error = new Error('Destination not found');
    error.status = 404;
    throw error;
  }

  // Fetch and sort attractions deterministically (e.g. by cost ascending, then by name)
  const attractions = await Attraction.find({ destinationId }).sort({ cost: 1, name: 1 });
  
  if (!attractions || attractions.length === 0) {
    // Graceful handling if no attractions exist
    return {
      destination: {
        _id: destination._id,
        name: destination.name,
      },
      days,
      budget,
      totalEstimatedCost: 0,
      withinBudget: budget >= 0,
      itinerary: []
    };
  }

  const itinerary = [];
  let totalEstimatedCost = 0;
  let attractionIndex = 0; // Pointer to cycle through attractions

  for (let day = 1; day <= days; day++) {
    let currentHour = 9;
    const activities = [];
    let dailyEstimatedCost = 0;
    let lunchAdded = false;

    while (currentHour < 18) {
      // Force lunch at 13:00 or if we've passed 13:00 and haven't had lunch
      if (currentHour >= 13 && !lunchAdded) {
        activities.push({
          time: `${formatTime(13)} - ${formatTime(14)}`,
          type: 'meal',
          title: 'Lunch Break',
          place: 'Lunch Break',
          estimatedCost: 0
        });
        currentHour = Math.max(currentHour, 13) + 1;
        lunchAdded = true;
        continue;
      }

      // If we are at or past 18:00, stop
      if (currentHour >= 18) break;

      // Select next attraction
      const attr = attractions[attractionIndex];
      // Move to next attraction, loop back if we reach the end
      attractionIndex = (attractionIndex + 1) % attractions.length;

      // Ensure duration is at least 1 hour, default to 2 if missing
      const duration = attr.duration ? Math.max(1, attr.duration) : 2;
      
      // If this attraction pushes us past 18:00, we either cap it or skip.
      // Let's just adjust duration to fit the remaining time if it goes past 18:00
      let actualDuration = duration;
      if (currentHour + actualDuration > 18) {
        actualDuration = 18 - currentHour;
      }
      
      // If it pushes into lunch time (13:00) and lunch isn't taken, cap it at 13:00
      if (!lunchAdded && currentHour < 13 && currentHour + actualDuration > 13) {
        actualDuration = 13 - currentHour;
      }

      if (actualDuration <= 0) {
        // safety break
        break;
      }

      const cost = attr.cost || 0;
      activities.push({
        time: `${formatTime(currentHour)} - ${formatTime(currentHour + actualDuration)}`,
        type: 'attraction',
        place: attr.name,
        title: attr.name,
        attractionId: attr._id,
        attraction: attr,
        description: attr.description,
        estimatedCost: cost
      });

      dailyEstimatedCost += cost;
      totalEstimatedCost += cost;
      currentHour += actualDuration;
    }

    itinerary.push({
      day,
      activities,
      estimatedCost: dailyEstimatedCost
    });
  }

  return {
    destination: {
      _id: destination._id,
      name: destination.name,
    },
    days,
    budget,
    totalEstimatedCost,
    withinBudget: totalEstimatedCost <= budget,
    itinerary
  };
}

module.exports = {
  generateItinerary
};
