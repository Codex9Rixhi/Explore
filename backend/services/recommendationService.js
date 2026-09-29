const Destination = require('../models/Destination');

const INTEREST_WEIGHT = 0.60;
const BUDGET_WEIGHT = 0.30;
const DURATION_WEIGHT = 0.10;

/**
 * Calculates interest score based on overlap between user interests and destination interests.
 * Scales 0 - 100.
 */
function calculateInterestScore(userInterests, destInterests) {
  if (!userInterests || userInterests.length === 0) return 0;
  if (!destInterests || destInterests.length === 0) return 0;

  const normalizedUser = userInterests.map((i) => i.toLowerCase());
  const normalizedDest = destInterests.map((i) => i.toLowerCase());

  const matchCount = normalizedUser.filter((interest) =>
    normalizedDest.includes(interest)
  ).length;

  return (matchCount / normalizedUser.length) * 100;
}

/**
 * Calculates budget score based on how user budget fits budgetRange.
 * Scales 0 - 100.
 */
function calculateBudgetScore(userBudget, budgetRange) {
  if (!budgetRange || !budgetRange.min || !budgetRange.max) return 0;
  
  if (userBudget >= budgetRange.min && userBudget <= budgetRange.max) {
    return 100;
  } else if (userBudget < budgetRange.min) {
    // Tapering off if budget is too low
    return (userBudget / budgetRange.min) * 100;
  } else {
    // userBudget > budgetRange.max
    // Tapering off if budget is too high (maybe they want luxury, but this is a budget destination)
    const ratio = budgetRange.max / userBudget;
    return Math.max(0, ratio * 100);
  }
}

/**
 * Calculates duration score based on how requested length fits recommendedDuration.
 * Scales 0 - 100.
 */
function calculateDurationScore(userDays, recommendedDuration) {
  if (!recommendedDuration) return 0;

  const diff = Math.abs(userDays - recommendedDuration);
  // Max score 100, drops by percentage of difference compared to recommended
  const penalty = (diff / recommendedDuration) * 100;
  return Math.max(0, 100 - penalty);
}

async function getRecommendations({ budget, days, interests }) {
  const destinations = await Destination.find({});

  const scoredDestinations = destinations.map((dest) => {
    const interestScore = calculateInterestScore(interests, dest.interests);
    const budgetScore = calculateBudgetScore(budget, dest.budgetRange);
    const durationScore = calculateDurationScore(days, dest.recommendedDuration);

    const totalScore = 
      (interestScore * INTEREST_WEIGHT) + 
      (budgetScore * BUDGET_WEIGHT) + 
      (durationScore * DURATION_WEIGHT);

    return {
      destination: dest,
      totalScore: Number(totalScore.toFixed(2)),
      breakdown: {
        interestScore: Number(interestScore.toFixed(2)),
        budgetScore: Number(budgetScore.toFixed(2)),
        durationScore: Number(durationScore.toFixed(2)),
      }
    };
  });

  // Sort descending by totalScore and return top 5
  scoredDestinations.sort((a, b) => b.totalScore - a.totalScore);
  return scoredDestinations.slice(0, 5);
}

module.exports = {
  getRecommendations,
  // exporting for testing if necessary
  calculateInterestScore,
  calculateBudgetScore,
  calculateDurationScore
};
