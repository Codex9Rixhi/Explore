require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Destination = require('../models/Destination');
const Attraction = require('../models/Attraction');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Trip = require('../models/Trip');

// Sample Data Arrays
const destinationsData = [
  { name: 'Ooty', state: 'Tamil Nadu', country: 'India', description: 'Queen of Hill Stations', interests: ['nature', 'family'], budgetRange: { min: 2000, max: 10000 }, recommendedDuration: 3, bestTimeToVisit: 'April-June', latitude: 11.41, longitude: 76.69 },
  { name: 'Wayanad', state: 'Kerala', country: 'India', description: 'Nature and wildlife', interests: ['nature', 'adventure', 'family'], budgetRange: { min: 3000, max: 12000 }, recommendedDuration: 3, bestTimeToVisit: 'October-May', latitude: 11.68, longitude: 76.13 },
  { name: 'Kodaikanal', state: 'Tamil Nadu', country: 'India', description: 'Princess of Hill Stations', interests: ['nature', 'family'], budgetRange: { min: 2500, max: 11000 }, recommendedDuration: 3, bestTimeToVisit: 'September-May', latitude: 10.23, longitude: 77.46 },
  { name: 'Goa', state: 'Goa', country: 'India', description: 'Beaches, parties, and heritage', interests: ['beaches', 'entertainment', 'food', 'history'], budgetRange: { min: 5000, max: 25000 }, recommendedDuration: 5, bestTimeToVisit: 'November-February', latitude: 15.29, longitude: 74.12 },
  { name: 'Munnar', state: 'Kerala', country: 'India', description: 'Tea gardens and hills', interests: ['nature', 'family'], budgetRange: { min: 3000, max: 12000 }, recommendedDuration: 3, bestTimeToVisit: 'September-March', latitude: 10.08, longitude: 77.06 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', description: 'The Pink City', interests: ['history', 'culture', 'shopping', 'food'], budgetRange: { min: 4000, max: 15000 }, recommendedDuration: 4, bestTimeToVisit: 'October-March', latitude: 26.91, longitude: 75.78 },
  { name: 'Rishikesh', state: 'Uttarakhand', country: 'India', description: 'Yoga capital and adventure', interests: ['religious', 'adventure', 'nature'], budgetRange: { min: 1500, max: 8000 }, recommendedDuration: 3, bestTimeToVisit: 'September-June', latitude: 30.08, longitude: 78.26 },
  { name: 'Pondicherry', state: 'Puducherry', country: 'India', description: 'French colony and beaches', interests: ['beaches', 'culture', 'food', 'history'], budgetRange: { min: 3000, max: 10000 }, recommendedDuration: 3, bestTimeToVisit: 'October-March', latitude: 11.94, longitude: 79.80 },
  { name: 'Coorg', state: 'Karnataka', country: 'India', description: 'Coffee plantations', interests: ['nature', 'adventure', 'food'], budgetRange: { min: 3500, max: 12000 }, recommendedDuration: 3, bestTimeToVisit: 'October-March', latitude: 12.33, longitude: 75.80 },
  { name: 'Hampi', state: 'Karnataka', country: 'India', description: 'Ancient ruins', interests: ['history', 'culture', 'religious'], budgetRange: { min: 2000, max: 7000 }, recommendedDuration: 2, bestTimeToVisit: 'October-February', latitude: 15.33, longitude: 76.46 }
];

const generateAttractions = (destId, destName) => {
  return [
    { destinationId: destId, name: `${destName} Point 1`, description: 'Great view', category: 'nature', duration: 2, cost: 50, openingTime: '09:00', closingTime: '18:00' },
    { destinationId: destId, name: `${destName} Museum`, description: 'Historic artifacts', category: 'history', duration: 3, cost: 200, openingTime: '10:00', closingTime: '17:00' },
    { destinationId: destId, name: `${destName} Adventure Park`, description: 'Fun activities', category: 'adventure', duration: 4, cost: 1000, openingTime: '08:00', closingTime: '19:00' },
    { destinationId: destId, name: `${destName} Temple`, description: 'Ancient temple', category: 'religious', duration: 1, cost: 0, openingTime: '06:00', closingTime: '20:00' }
  ];
};

const generateHotels = (destId, destName) => {
  return [
    { destinationId: destId, name: `Luxury ${destName} Resort`, pricePerNight: 8000, rating: 4.8, amenities: ['Pool', 'Spa', 'Wifi'] },
    { destinationId: destId, name: `Budget ${destName} Inn`, pricePerNight: 1500, rating: 3.5, amenities: ['Wifi'] },
    { destinationId: destId, name: `${destName} Homestay`, pricePerNight: 3500, rating: 4.2, amenities: ['Wifi', 'Breakfast'] }
  ];
};

const generateRestaurants = (destId, destName) => {
  return [
    { destinationId: destId, name: `${destName} Fine Dining`, cuisine: ['Local', 'Continental'], priceRange: 'Expensive', rating: 4.7 },
    { destinationId: destId, name: `${destName} Street Food Hub`, cuisine: ['Street Food'], priceRange: 'Budget', rating: 4.1 },
    { destinationId: destId, name: `${destName} Cafe`, cuisine: ['Cafe', 'Desserts'], priceRange: 'Moderate', rating: 4.4 }
  ];
};

const importData = async () => {
  try {
    require('dotenv').config();
    await connectDB();

    // Clear all existing data
    await Destination.deleteMany({});
    await Attraction.deleteMany({});
    await Hotel.deleteMany({});
    await Restaurant.deleteMany({});
    await User.deleteMany({});
    await Trip.deleteMany({});

    console.log('Existing data cleared.');

    const createdDestinations = await Destination.insertMany(destinationsData);
    console.log(`Inserted ${createdDestinations.length} destinations.`);

    let allAttractions = [];
    let allHotels = [];
    let allRestaurants = [];

    createdDestinations.forEach(dest => {
      allAttractions = allAttractions.concat(generateAttractions(dest._id, dest.name));
      allHotels = allHotels.concat(generateHotels(dest._id, dest.name));
      allRestaurants = allRestaurants.concat(generateRestaurants(dest._id, dest.name));
    });

    const createdAttractions = await Attraction.insertMany(allAttractions);
    const createdHotels = await Hotel.insertMany(allHotels);
    const createdRestaurants = await Restaurant.insertMany(allRestaurants);

    console.log(`Inserted ${createdAttractions.length} attractions.`);
    console.log(`Inserted ${createdHotels.length} hotels.`);
    console.log(`Inserted ${createdRestaurants.length} restaurants.`);

    console.log('Data successfully seeded!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

importData();
