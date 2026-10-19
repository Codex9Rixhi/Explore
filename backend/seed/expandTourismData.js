require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Destination = require('../models/Destination');
const Attraction = require('../models/Attraction');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

const expansionData = [
  {
    destination: {
      name: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      description: 'The cultural capital of South India, known for historic temples, colonial architecture, vibrant Carnatic music, and the sprawling Marina Beach.',
      interests: ['culture', 'heritage', 'beach', 'food'],
      budgetRange: { min: 3000, max: 15000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'November-February',
      latitude: 13.0827,
      longitude: 80.2707,
      images: []
    },
    attractions: [
      { name: 'Marina Beach', description: 'One of the longest natural urban beaches in the world, ideal for morning walks and seaside street food.', category: 'beach', duration: 2, cost: 0, openingTime: '06:00', closingTime: '21:00', latitude: 13.0500, longitude: 80.2824 },
      { name: 'Kapaleeshwarar Temple', description: '7th-century Dravidian temple dedicated to Lord Shiva, renowned for its towering rainbow gopuram and sacred tank.', category: 'culture', duration: 2, cost: 0, openingTime: '06:00', closingTime: '21:00', latitude: 13.0334, longitude: 80.2699 },
      { name: 'Fort St. George & Museum', description: 'The first English fortress in India founded in 1644, housing colonial artifacts, coins, and historic armory.', category: 'heritage', duration: 2, cost: 25, openingTime: '09:00', closingTime: '17:00', latitude: 13.0797, longitude: 80.2874 },
      { name: 'San Thome Basilica', description: 'Historic Neo-Gothic Catholic basilica built by Portuguese explorers over the tomb of Apostle St. Thomas.', category: 'culture', duration: 1, cost: 0, openingTime: '06:00', closingTime: '21:00', latitude: 13.0337, longitude: 80.2783 },
      { name: 'Government Museum Chennai', description: 'The second oldest museum in India, famous for its world-class collection of Chola bronze sculptures.', category: 'heritage', duration: 3, cost: 50, openingTime: '09:30', closingTime: '17:00', latitude: 13.0732, longitude: 80.2609 },
      { name: 'Guindy National Park', description: 'Rare protected national park situated completely within city limits, featuring spotted deer, blackbucks, and nature trails.', category: 'nature', duration: 2, cost: 20, openingTime: '09:00', closingTime: '17:30', latitude: 13.0067, longitude: 80.2206 }
    ],
    hotels: [
      { name: 'Taj Coromandel', pricePerNight: 8500, rating: 4.8, amenities: ['Pool', 'Spa', 'Wifi', 'Restaurant'], address: '37, Mahatma Gandhi Rd, Nungambakkam, Chennai', latitude: 13.0601, longitude: 80.2442 },
      { name: 'ITC Grand Chola', pricePerNight: 9500, rating: 4.9, amenities: ['Pool', 'Spa', 'Wifi', 'Valet', 'Restaurant'], address: '63, Anna Salai, Guindy, Chennai', latitude: 13.0105, longitude: 80.2209 },
      { name: 'The Residency Towers', pricePerNight: 4200, rating: 4.3, amenities: ['Wifi', 'Restaurant', 'Gym'], address: '115, Sir Thyagaraya Rd, T. Nagar, Chennai', latitude: 13.0418, longitude: 80.2341 },
      { name: 'ibis Chennai City Centre', pricePerNight: 2800, rating: 4.0, amenities: ['Wifi', 'Breakfast', 'Bar'], address: '690, Anna Salai, Thousand Lights, Chennai', latitude: 13.0556, longitude: 80.2528 }
    ],
    restaurants: [
      { name: 'Murugan Idli Shop', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.4, address: 'GN Chetty Rd, T. Nagar, Chennai', latitude: 13.0401, longitude: 80.2389 },
      { name: 'Dakshin', cuisine: ['South Indian', 'Seafood'], priceRange: 'Expensive', rating: 4.8, address: 'Crowne Plaza, TTK Rd, Alwarpet, Chennai', latitude: 13.0362, longitude: 80.2520 },
      { name: 'Annalakshmi Restaurant', cuisine: ['Vegetarian', 'Traditional'], priceRange: 'Moderate', rating: 4.5, address: 'Spur Tank Rd, Chetpet, Chennai', latitude: 13.0673, longitude: 80.2458 },
      { name: 'Saravana Bhavan', cuisine: ['South Indian', 'Vegetarian'], priceRange: 'Budget', rating: 4.1, address: 'Kennet Lane, Egmore, Chennai', latitude: 13.0784, longitude: 80.2608 }
    ]
  },
  {
    destination: {
      name: 'Madurai',
      state: 'Tamil Nadu',
      country: 'India',
      description: 'One of the oldest continuously inhabited cities in the world, renowned for the monumental Meenakshi Amman Temple and fragrant jasmine flowers.',
      interests: ['culture', 'heritage', 'spirituality', 'food'],
      budgetRange: { min: 2000, max: 9000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 9.9252,
      longitude: 78.1198,
      images: []
    },
    attractions: [
      { name: 'Meenakshi Amman Temple', description: 'Iconic historic Hindu temple complex on the Vaigai River featuring 14 magnificent sculpted gopurams.', category: 'spirituality', duration: 3, cost: 0, openingTime: '05:00', closingTime: '22:00', latitude: 9.9195, longitude: 78.1193 },
      { name: 'Thirumalai Nayakkar Mahal', description: '17th-century palace built by King Tirumala Nayaka, celebrated for its Indo-Saracenic arches and light-and-sound show.', category: 'heritage', duration: 2, cost: 50, openingTime: '09:00', closingTime: '17:00', latitude: 9.9152, longitude: 78.1238 },
      { name: 'Gandhi Memorial Museum', description: 'Housed in the historic Tamukkam Palace, displaying original artifacts, letters, and memorabilia of Mahatma Gandhi.', category: 'heritage', duration: 2, cost: 0, openingTime: '10:00', closingTime: '13:00', latitude: 9.9333, longitude: 78.1402 },
      { name: 'Koodal Azhagar Temple', description: 'Ancient temple dedicated to Lord Vishnu, featuring three distinct sanctums stacked vertically in three postures.', category: 'spirituality', duration: 1, cost: 0, openingTime: '06:00', closingTime: '20:00', latitude: 9.9158, longitude: 78.1139 },
      { name: 'Alagar Koyil', description: 'Picturesque temple nestled in the Alagar Hills, dedicated to Lord Vishnu and surrounded by scenic natural forest.', category: 'spirituality', duration: 2, cost: 0, openingTime: '06:00', closingTime: '20:00', latitude: 10.0763, longitude: 78.2144 }
    ],
    hotels: [
      { name: 'Heritage Madurai', pricePerNight: 5500, rating: 4.6, amenities: ['Pool', 'Spa', 'Wifi', 'Restaurant'], address: '11, Melakkal Main Rd, Kochadai, Madurai', latitude: 9.9328, longitude: 78.0895 },
      { name: 'Gateway Hotel Pasumalai', pricePerNight: 5000, rating: 4.5, amenities: ['Pool', 'Wifi', 'Bar', 'Garden'], address: 'Pasumalai, Madurai', latitude: 9.8974, longitude: 78.0818 },
      { name: 'Astoria Hotels Madurai', pricePerNight: 2200, rating: 4.1, amenities: ['Wifi', 'Restaurant', 'Parking'], address: 'Near Madurai Junction, Madurai', latitude: 9.9238, longitude: 78.1118 }
    ],
    restaurants: [
      { name: 'Murugan Idli Shop Madurai', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.5, address: 'West Masi St, Madurai', latitude: 9.9212, longitude: 78.1152 },
      { name: 'Sree Sabarees', cuisine: ['Vegetarian'], priceRange: 'Budget', rating: 4.3, address: 'West Perumal Maistry St, Madurai', latitude: 9.9221, longitude: 78.1130 },
      { name: 'Amma Mess', cuisine: ['Chettinad', 'Non-Vegetarian'], priceRange: 'Moderate', rating: 4.4, address: 'Alagar Kovil Rd, Tallakulam, Madurai', latitude: 9.9365, longitude: 78.1362 }
    ]
  },
  {
    destination: {
      name: 'Rameswaram',
      state: 'Tamil Nadu',
      country: 'India',
      description: 'Sacred island pilgrimage destination at the tip of the Indian peninsula, famous for holy teerthams and the engineering marvel Pamban Bridge.',
      interests: ['spirituality', 'culture', 'beach', 'heritage'],
      budgetRange: { min: 2000, max: 8000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-April',
      latitude: 9.2876,
      longitude: 79.3129,
      images: []
    },
    attractions: [
      { name: 'Ramanathaswamy Temple', description: 'Revered temple renowned for having the longest corridor among Hindu temples in India with over 1200 sculpted pillars.', category: 'spirituality', duration: 3, cost: 0, openingTime: '05:00', closingTime: '21:00', latitude: 9.2881, longitude: 79.3174 },
      { name: 'Dhanushkodi Beach & Ghost Town', description: 'Atmospheric abandoned town devastated in the 1964 cyclone, situated at the confluence of the Bay of Bengal and Indian Ocean.', category: 'beach', duration: 3, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 9.1770, longitude: 79.4180 },
      { name: 'Pamban Bridge Viewpoint', description: 'Historic cantilever railway sea bridge connecting Rameswaram island to mainland India across the Palk Strait.', category: 'heritage', duration: 1, cost: 0, openingTime: '00:00', closingTime: '23:59', latitude: 9.2800, longitude: 79.2000 },
      { name: 'Dr. APJ Abdul Kalam National Memorial', description: 'Inspiring memorial celebrating the life, science, and philosophy of India’s former President and missile visionary.', category: 'heritage', duration: 1, cost: 0, openingTime: '09:00', closingTime: '18:00', latitude: 9.2945, longitude: 79.2842 },
      { name: 'Agnitheertham', description: 'Sacred sea shore adjacent to the Ramanathaswamy Temple where pilgrims take holy purification dips.', category: 'spirituality', duration: 1, cost: 0, openingTime: '05:00', closingTime: '20:00', latitude: 9.2872, longitude: 79.3211 }
    ],
    hotels: [
      { name: 'Daiwik Hotels Rameswaram', pricePerNight: 3500, rating: 4.3, amenities: ['Wifi', 'Restaurant', 'Spa'], address: 'NH 49, Near Rameswaram Bus Stand, Rameswaram', latitude: 9.2891, longitude: 79.3082 },
      { name: 'Hotel Vinayaga', pricePerNight: 1800, rating: 3.9, amenities: ['Wifi', 'Restaurant'], address: 'Railway Feeder Rd, Rameswaram', latitude: 9.2855, longitude: 79.3112 },
      { name: 'Hotel Pearl Residency', pricePerNight: 2400, rating: 4.0, amenities: ['Wifi', 'Parking', 'Restaurant'], address: 'Opposite Railway Station, Rameswaram', latitude: 9.2841, longitude: 79.3134 }
    ],
    restaurants: [
      { name: 'Hotel Guru Gujarati Bhojanalaya', cuisine: ['Vegetarian', 'North Indian'], priceRange: 'Budget', rating: 4.2, address: 'West Car St, Rameswaram', latitude: 9.2875, longitude: 79.3150 },
      { name: 'Sri Saravana Bhavan Rameswaram', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.0, address: 'South Car St, Rameswaram', latitude: 9.2865, longitude: 79.3168 },
      { name: 'Shabari Restaurant', cuisine: ['Indian', 'Vegetarian'], priceRange: 'Moderate', rating: 4.1, address: 'Near Bus Stand, Rameswaram', latitude: 9.2889, longitude: 79.3090 }
    ]
  },
  {
    destination: {
      name: 'Kanyakumari',
      state: 'Tamil Nadu',
      country: 'India',
      description: 'The southernmost tip of the Indian subcontinent where the Arabian Sea, Gulf of Mannar, and Indian Ocean merge together.',
      interests: ['beach', 'spirituality', 'nature', 'heritage'],
      budgetRange: { min: 2000, max: 9000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 8.0883,
      longitude: 77.5385,
      images: []
    },
    attractions: [
      { name: 'Vivekananda Rock Memorial', description: 'Monolithic rock island memorial where Swami Vivekananda meditated and attained enlightenment in 1892.', category: 'spirituality', duration: 2, cost: 50, openingTime: '08:00', closingTime: '16:00', latitude: 8.0780, longitude: 77.5550 },
      { name: 'Thiruvalluvar Statue', description: 'Towering 133-foot stone sculpture honouring the ancient Tamil philosopher-poet who composed the Tirukkural.', category: 'heritage', duration: 1, cost: 0, openingTime: '08:00', closingTime: '16:00', latitude: 8.0783, longitude: 77.5567 },
      { name: 'Kanyakumari Sunset & Sunrise Point', description: 'Spectacular coastal vantage point where visitors can witness both sunrise and sunset across the ocean.', category: 'beach', duration: 2, cost: 0, openingTime: '05:00', closingTime: '19:00', latitude: 8.0812, longitude: 77.5492 },
      { name: 'Bhagavathy Amman Temple', description: '3000-year-old sea-facing shrine dedicated to the virgin goddess Kanya Devi, famous for its sparkling diamond nose ring.', category: 'spirituality', duration: 1, cost: 0, openingTime: '04:30', closingTime: '20:30', latitude: 8.0818, longitude: 77.5528 },
      { name: 'Padmanabhapuram Palace', description: 'Magnificent 16th-century wooden royal palace complex of the Travancore kings displaying Kerala architectural mastery.', category: 'heritage', duration: 2, cost: 40, openingTime: '09:00', closingTime: '16:30', latitude: 8.2508, longitude: 77.3275 }
    ],
    hotels: [
      { name: 'Sparsa Resort Kanyakumari', pricePerNight: 4800, rating: 4.5, amenities: ['Pool', 'Spa', 'Wifi', 'Sea View'], address: '6/112 B, Beach Rd, Kanyakumari', latitude: 8.0845, longitude: 77.5512 },
      { name: 'Hotel Ocean Heritage', pricePerNight: 2200, rating: 4.1, amenities: ['Wifi', 'Parking', 'Restaurant'], address: 'Near Sunset Point, Kanyakumari', latitude: 8.0828, longitude: 77.5489 },
      { name: 'Hotel Sea View', pricePerNight: 3000, rating: 4.2, amenities: ['Sea View', 'Wifi', 'Restaurant'], address: 'East Car St, Kanyakumari', latitude: 8.0832, longitude: 77.5534 }
    ],
    restaurants: [
      { name: 'The Sea Restaurant', cuisine: ['Seafood', 'South Indian'], priceRange: 'Moderate', rating: 4.2, address: 'Near Seashore, Kanyakumari', latitude: 8.0820, longitude: 77.5510 },
      { name: 'Saravana Vegetarian Restaurant', cuisine: ['Vegetarian', 'South Indian'], priceRange: 'Budget', rating: 4.0, address: 'Main Rd, Kanyakumari', latitude: 8.0850, longitude: 77.5495 },
      { name: 'Triveni Restaurant', cuisine: ['Multi-Cuisine'], priceRange: 'Budget', rating: 3.9, address: 'Cape Road, Kanyakumari', latitude: 8.0862, longitude: 77.5478 }
    ]
  },
  {
    destination: {
      name: 'Mahabalipuram',
      state: 'Tamil Nadu',
      country: 'India',
      description: 'UNESCO World Heritage coastal town famous for 7th and 8th-century Pallava rock-cut sanctuaries, shore temples, and stone carvings.',
      interests: ['heritage', 'culture', 'beach', 'history'],
      budgetRange: { min: 2500, max: 10000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'November-February',
      latitude: 12.6269,
      longitude: 80.1927,
      images: []
    },
    attractions: [
      { name: 'Shore Temple', description: 'Structural temple complex built right on the shore of the Bay of Bengal overlooking waves, dating to 700 AD.', category: 'heritage', duration: 2, cost: 40, openingTime: '06:00', closingTime: '18:00', latitude: 12.6163, longitude: 80.1983 },
      { name: 'Pancha Rathas', description: 'Five monolithic rock-cut shrines carved out of a single large pink granite outcrop, named after the Pandavas.', category: 'heritage', duration: 2, cost: 40, openingTime: '06:00', closingTime: '18:00', latitude: 12.6089, longitude: 80.1923 },
      { name: "Arjuna's Penance", description: 'Massive open-air rock relief measuring 96 feet across, depicting the descent of the sacred river Ganges.', category: 'heritage', duration: 1, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 12.6179, longitude: 80.1936 },
      { name: "Krishna's Butterball", description: 'Enormous 250-ton natural granite boulder precariously perched on a slippery 45-degree slope.', category: 'nature', duration: 1, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 12.6186, longitude: 80.1931 },
      { name: 'Mahabalipuram Beach', description: 'Scenic golden sand beach dotted with local stone carver stalls and fresh seafood eateries.', category: 'beach', duration: 2, cost: 0, openingTime: '06:00', closingTime: '20:00', latitude: 12.6210, longitude: 80.1990 }
    ],
    hotels: [
      { name: 'Radisson Resort Temple Bay', pricePerNight: 7500, rating: 4.7, amenities: ['Pool', 'Spa', 'Wifi', 'Beach Access'], address: '57, Covelong Rd, Mahabalipuram', latitude: 12.6285, longitude: 80.1965 },
      { name: 'Grande Bay Resort and Spa', pricePerNight: 5500, rating: 4.5, amenities: ['Pool', 'Wifi', 'Restaurant', 'Spa'], address: 'Kovalam Rd, Mahabalipuram', latitude: 12.6310, longitude: 80.1970 },
      { name: 'Hotel Mamalla Heritage', pricePerNight: 2500, rating: 4.1, amenities: ['Pool', 'Wifi', 'Restaurant'], address: '104, East Raja St, Mahabalipuram', latitude: 12.6225, longitude: 80.1945 }
    ],
    restaurants: [
      { name: 'Moonrakers Restaurant', cuisine: ['Seafood', 'Continental'], priceRange: 'Moderate', rating: 4.3, address: 'Othavadai St, Mahabalipuram', latitude: 12.6212, longitude: 80.1960 },
      { name: 'Santana Beach Restaurant', cuisine: ['Seafood', 'Coastal'], priceRange: 'Moderate', rating: 4.1, address: 'Beach Side, Othavadai St, Mahabalipuram', latitude: 12.6205, longitude: 80.1985 },
      { name: 'Le Yogi Restaurant', cuisine: ['Continental', 'Indian'], priceRange: 'Budget', rating: 4.2, address: 'Othavadai St, Mahabalipuram', latitude: 12.6216, longitude: 80.1952 }
    ]
  },
  {
    destination: {
      name: 'Thanjavur',
      state: 'Tamil Nadu',
      country: 'India',
      description: 'The historic capital of the great Chola dynasty, renowned for the monument Brihadisvara Temple, classical bronze artistry, and Thanjavur paintings.',
      interests: ['heritage', 'culture', 'spirituality', 'history'],
      budgetRange: { min: 2000, max: 8000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 10.7870,
      longitude: 79.1378,
      images: []
    },
    attractions: [
      { name: 'Brihadisvara Temple', description: '1000-year-old Great Living Chola Temple with an 80-tonne single granite block crowning its 216-foot vimana tower.', category: 'heritage', duration: 3, cost: 0, openingTime: '06:00', closingTime: '20:30', latitude: 10.7828, longitude: 79.1318 },
      { name: 'Thanjavur Maratha Palace', description: 'Royal palace complex featuring the Darbar Hall, Arsenal Tower, and galleries of ancient stone and bronze sculptures.', category: 'heritage', duration: 2, cost: 50, openingTime: '09:00', closingTime: '18:00', latitude: 10.7925, longitude: 79.1362 },
      { name: 'Saraswathi Mahal Library', description: 'One of the oldest libraries in Asia, containing rare medieval palm-leaf manuscripts and Chola literature.', category: 'culture', duration: 1, cost: 30, openingTime: '10:00', closingTime: '17:30', latitude: 10.7922, longitude: 79.1360 },
      { name: 'Schwartz Church', description: 'Historic 18th-century church built by Raja Serfoji II to honour the missionary Rev. Friedrich Christian Schwartz.', category: 'heritage', duration: 1, cost: 0, openingTime: '09:00', closingTime: '17:00', latitude: 10.7865, longitude: 79.1340 },
      { name: 'Sivaganga Park', description: 'Pleasant historic park and water reservoir situated close to the Big Temple, popular for family strolls.', category: 'nature', duration: 2, cost: 20, openingTime: '09:00', closingTime: '18:00', latitude: 10.7845, longitude: 79.1330 }
    ],
    hotels: [
      { name: 'Svatma Thanjavur', pricePerNight: 7000, rating: 4.8, amenities: ['Spa', 'Pool', 'Wifi', 'Vegetarian'], address: 'Blake Higher Secondary School Rd, Thanjavur', latitude: 10.7812, longitude: 79.1350 },
      { name: 'Hotel Gnanam', pricePerNight: 2400, rating: 4.1, amenities: ['Wifi', 'Restaurant', 'Parking'], address: 'Anna Salai, Thanjavur', latitude: 10.7850, longitude: 79.1385 },
      { name: 'Hotel Parisutham', pricePerNight: 3200, rating: 4.2, amenities: ['Pool', 'Wifi', 'Restaurant'], address: '55, Grand Anicut Canal Rd, Thanjavur', latitude: 10.7830, longitude: 79.1398 }
    ],
    restaurants: [
      { name: 'Sree Ariya Bhavan', cuisine: ['Vegetarian', 'South Indian'], priceRange: 'Budget', rating: 4.3, address: 'Near Old Bus Stand, Thanjavur', latitude: 10.7860, longitude: 79.1380 },
      { name: 'Thillana Restaurant', cuisine: ['Multi-Cuisine', 'South Indian'], priceRange: 'Moderate', rating: 4.2, address: 'Hotel Sangam, Trichy Rd, Thanjavur', latitude: 10.7820, longitude: 79.1305 },
      { name: 'Hotel Vasantha Bhavan', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.0, address: 'South Main St, Thanjavur', latitude: 10.7890, longitude: 79.1370 }
    ]
  },
  {
    destination: {
      name: 'Kochi',
      state: 'Kerala',
      country: 'India',
      description: 'The Queen of the Arabian Sea, featuring an eclectic blend of Portuguese, Dutch, British colonial history and bustling spice markets.',
      interests: ['culture', 'heritage', 'beach', 'food'],
      budgetRange: { min: 3500, max: 15000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-March',
      latitude: 9.9312,
      longitude: 76.2673,
      images: []
    },
    attractions: [
      { name: 'Fort Kochi & Chinese Fishing Nets', description: 'Iconic shore-operated fixed lift nets introduced by Chinese traders in the 14th century, lining Fort Kochi beach.', category: 'heritage', duration: 2, cost: 0, openingTime: '06:00', closingTime: '20:00', latitude: 9.9678, longitude: 76.2415 },
      { name: 'Mattancherry Palace (Dutch Palace)', description: 'Portuguese-built palace showcasing extraordinary 16th-century murals illustrating scenes from the Ramayana.', category: 'heritage', duration: 2, cost: 20, openingTime: '09:45', closingTime: '16:45', latitude: 9.9583, longitude: 76.2592 },
      { name: 'Paradesi Synagogue', description: 'Oldest active synagogue in the Commonwealth, featuring hand-painted Chinese porcelain tiles and a brass pulpit.', category: 'heritage', duration: 1, cost: 10, openingTime: '10:00', closingTime: '17:00', latitude: 9.9576, longitude: 76.2594 },
      { name: 'St. Francis Church', description: 'One of the oldest European churches in India where explorer Vasco da Gama was originally buried in 1524.', category: 'culture', duration: 1, cost: 0, openingTime: '09:00', closingTime: '17:00', latitude: 9.9660, longitude: 76.2410 },
      { name: 'Cherai Beach', description: 'Picturesque beach famous for calm waters, seashell foraging, and frequent sightings of swimming dolphins.', category: 'beach', duration: 3, cost: 0, openingTime: '06:00', closingTime: '19:00', latitude: 10.1416, longitude: 76.1783 },
      { name: 'Kerala Kathakali Centre', description: 'Renowned cultural performance center offering daily classical Kathakali dance dramas and facial makeup demonstrations.', category: 'culture', duration: 2, cost: 400, openingTime: '17:00', closingTime: '20:00', latitude: 9.9645, longitude: 76.2440 }
    ],
    hotels: [
      { name: 'Brunton Boatyard', pricePerNight: 11000, rating: 4.8, amenities: ['Pool', 'Spa', 'Sea View', 'Restaurant'], address: '1/498, Calvathy Rd, Fort Kochi', latitude: 9.9680, longitude: 76.2450 },
      { name: 'Trident Hotel Cochin', pricePerNight: 5000, rating: 4.5, amenities: ['Pool', 'Wifi', 'Gym', 'Restaurant'], address: 'Bristow Rd, Willingdon Island, Kochi', latitude: 9.9482, longitude: 76.2685 },
      { name: 'Forte Kochi', pricePerNight: 7500, rating: 4.7, amenities: ['Pool', 'Wifi', 'Boutique', 'Restaurant'], address: '1/373, Princess St, Fort Kochi', latitude: 9.9658, longitude: 76.2418 },
      { name: 'Old Harbour Hotel', pricePerNight: 6500, rating: 4.6, amenities: ['Pool', 'Garden', 'Restaurant'], address: '1/328 Tower Rd, Fort Kochi', latitude: 9.9650, longitude: 76.2412 }
    ],
    restaurants: [
      { name: 'Kashi Art Cafe', cuisine: ['Cafe', 'Continental'], priceRange: 'Moderate', rating: 4.5, address: 'Burgher St, Fort Kochi', latitude: 9.9663, longitude: 76.2435 },
      { name: 'Oceanos Restaurant', cuisine: ['Kerala Seafood'], priceRange: 'Moderate', rating: 4.6, address: 'Elphinstone Rd, Fort Kochi', latitude: 9.9602, longitude: 76.2455 },
      { name: 'Grand Pavilion', cuisine: ['Kerala', 'Traditional'], priceRange: 'Moderate', rating: 4.4, address: 'Grand Hotel, MG Road, Kochi', latitude: 9.9720, longitude: 76.2840 },
      { name: 'Dal Roti', cuisine: ['North Indian'], priceRange: 'Moderate', rating: 4.3, address: 'Lilly St, Fort Kochi', latitude: 9.9648, longitude: 76.2429 }
    ]
  },
  {
    destination: {
      name: 'Alleppey',
      state: 'Kerala',
      country: 'India',
      description: 'The Venice of the East, famous for tranquil palm-fringed backwater canals, traditional kettuvallam houseboats, and lagoons.',
      interests: ['relaxation', 'nature', 'beach', 'adventure'],
      budgetRange: { min: 3000, max: 14000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'November-February',
      latitude: 9.4981,
      longitude: 76.3388,
      images: []
    },
    attractions: [
      { name: 'Alleppey Backwaters & Houseboat Cruise', description: 'Cruising through the network of palm-lined lagoons and emerald paddy fields on a traditional thatched houseboat.', category: 'relaxation', duration: 4, cost: 800, openingTime: '08:00', closingTime: '18:00', latitude: 9.4920, longitude: 76.3500 },
      { name: 'Alappuzha Beach', description: 'Historic sandy beach boasting a 150-year-old pier extending into the sea and picturesque sunsets.', category: 'beach', duration: 2, cost: 0, openingTime: '06:00', closingTime: '20:00', latitude: 9.4925, longitude: 76.3182 },
      { name: 'Marari Beach', description: 'Pristine, quiet fishing village beach lined with coconut groves, ideal for peaceful retreat and sunbathing.', category: 'beach', duration: 3, cost: 0, openingTime: '06:00', closingTime: '19:00', latitude: 9.6002, longitude: 76.2995 },
      { name: 'Alappuzha Lighthouse', description: 'Teakwood-staircase lighthouse built in 1862 providing panoramic coastal vistas of the Arabian Sea.', category: 'heritage', duration: 1, cost: 20, openingTime: '09:00', closingTime: '17:00', latitude: 9.4950, longitude: 76.3210 },
      { name: 'Krishnapuram Palace', description: '18th-century palace built by Travancore king Anizham Thirunal Marthanda Varma, housing the Gajendra Moksha mural.', category: 'heritage', duration: 2, cost: 25, openingTime: '09:00', closingTime: '16:30', latitude: 9.2435, longitude: 76.4947 }
    ],
    hotels: [
      { name: 'Lake Palace Resort', pricePerNight: 9000, rating: 4.7, amenities: ['Pool', 'Spa', 'Wifi', 'Boating'], address: 'Thirumala Ward, Chungam, Alappuzha', latitude: 9.5085, longitude: 76.3512 },
      { name: 'Punnamada Resort', pricePerNight: 6000, rating: 4.5, amenities: ['Pool', 'Spa', 'Lake View', 'Restaurant'], address: 'Punnamada, Alappuzha', latitude: 9.5120, longitude: 76.3590 },
      { name: 'Ramada by Wyndham Alleppey', pricePerNight: 4500, rating: 4.3, amenities: ['Pool', 'Gym', 'Wifi', 'Bar'], address: 'Nehru Trophy Finishing Point, Alappuzha', latitude: 9.5020, longitude: 76.3480 }
    ],
    restaurants: [
      { name: 'Thaff Restaurant', cuisine: ['Kerala', 'Biryani'], priceRange: 'Budget', rating: 4.2, address: 'Opposite Boat Jetty, Alappuzha', latitude: 9.4975, longitude: 76.3350 },
      { name: 'Halais Restaurant', cuisine: ['South Indian', 'Arabic'], priceRange: 'Moderate', rating: 4.3, address: 'Near KSRTC Bus Stand, Alappuzha', latitude: 9.4960, longitude: 76.3325 },
      { name: 'Dreamers Cafe', cuisine: ['Cafe', 'Seafood'], priceRange: 'Budget', rating: 4.1, address: 'Beach Rd, Alappuzha', latitude: 9.4930, longitude: 76.3205 }
    ]
  },
  {
    destination: {
      name: 'Thekkady',
      state: 'Kerala',
      country: 'India',
      description: 'Home of the Periyar National Park, known for dense evergreen forests, aromatic cardamom spice plantations, and wild elephant herds.',
      interests: ['wildlife', 'nature', 'adventure', 'relaxation'],
      budgetRange: { min: 2500, max: 11000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'September-April',
      latitude: 9.6031,
      longitude: 77.1615,
      images: []
    },
    attractions: [
      { name: 'Periyar National Park & Lake', description: 'Spectacular protected sanctuary surrounding an artificial lake where wild elephants, sambar deer, and birds gather.', category: 'wildlife', duration: 4, cost: 150, openingTime: '06:00', closingTime: '18:00', latitude: 9.4622, longitude: 77.1405 },
      { name: 'Elephant Junction Thekkady', description: 'Sanctuary offering ethical interactions with gentle elephants, plantation walks, and bathing sessions.', category: 'wildlife', duration: 2, cost: 400, openingTime: '08:30', closingTime: '17:30', latitude: 9.6105, longitude: 77.1720 },
      { name: 'Periyar Tiger Reserve Bamboo Rafting', description: 'Eco-tourism expedition combining jungle trekking and tranquil bamboo rafting through pristine forest waters.', category: 'adventure', duration: 4, cost: 1500, openingTime: '08:00', closingTime: '17:00', latitude: 9.4750, longitude: 77.1520 },
      { name: 'Kadathanadan Kalari Centre', description: 'Traditional stadium showcasing the ancient martial art form Kalaripayattu, featuring armed and unarmed combat.', category: 'culture', duration: 1, cost: 250, openingTime: '18:00', closingTime: '20:00', latitude: 9.6010, longitude: 77.1645 },
      { name: "Abraham's Spice Garden", description: 'Organic farm tour demonstrating the cultivation of pepper, vanilla, cinnamon, cardamom, and medicinal herbs.', category: 'nature', duration: 2, cost: 200, openingTime: '09:00', closingTime: '17:00', latitude: 9.5890, longitude: 77.1480 }
    ],
    hotels: [
      { name: 'Spice Village CGH Earth', pricePerNight: 8500, rating: 4.8, amenities: ['Pool', 'Spa', 'Eco-friendly', 'Restaurant'], address: 'Kottayam-Kumily Rd, Thekkady', latitude: 9.6050, longitude: 77.1630 },
      { name: 'The Elephant Court', pricePerNight: 4500, rating: 4.4, amenities: ['Pool', 'Spa', 'Gym', 'Wifi'], address: 'Thamarakkannam Rd, Thekkady', latitude: 9.6015, longitude: 77.1685 },
      { name: 'Peppervine Hotel', pricePerNight: 2800, rating: 4.2, amenities: ['Pool', 'Wifi', 'Restaurant'], address: 'Rosapookandam, Kumily, Thekkady', latitude: 9.6080, longitude: 77.1600 }
    ],
    restaurants: [
      { name: "Grandma's Cafe", cuisine: ['Kerala', 'Continental'], priceRange: 'Budget', rating: 4.5, address: 'Thekkady Bypass Rd, Kumily', latitude: 9.6040, longitude: 77.1620 },
      { name: 'Bamboo Cafe', cuisine: ['Cafe', 'Healthy'], priceRange: 'Budget', rating: 4.3, address: 'Near Ambadi Junction, Thekkady', latitude: 9.6022, longitude: 77.1650 },
      { name: 'Ambadi Restaurant', cuisine: ['Kerala', 'South Indian'], priceRange: 'Moderate', rating: 4.1, address: 'Hotel Ambadi, Thekkady', latitude: 9.6035, longitude: 77.1640 }
    ]
  },
  {
    destination: {
      name: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      description: 'The Garden City and technological powerhouse of India, famous for sweeping public parks, grand palaces, craft breweries, and pleasant climate.',
      interests: ['nature', 'shopping', 'food', 'culture'],
      budgetRange: { min: 3500, max: 18000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'September-March',
      latitude: 12.9716,
      longitude: 77.5946,
      images: []
    },
    attractions: [
      { name: 'Lalbagh Botanical Garden', description: '240-acre botanical haven founded by Hyder Ali, featuring a 19th-century Glass House and centuries-old trees.', category: 'nature', duration: 3, cost: 30, openingTime: '06:00', closingTime: '19:00', latitude: 12.9507, longitude: 77.5848 },
      { name: 'Cubbon Park', description: 'Sprawling 300-acre green lung in the heart of Bengaluru, shaded by grand bamboo groves and colonial monuments.', category: 'nature', duration: 2, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 12.9760, longitude: 77.5929 },
      { name: 'Bangalore Palace', description: 'Tudor-style royal estate with fortified towers, woodcarvings, and vintage paintings modeled after Windsor Castle.', category: 'heritage', duration: 2, cost: 250, openingTime: '10:00', closingTime: '17:30', latitude: 12.9982, longitude: 77.5920 },
      { name: 'Bannerghatta Biological Park', description: 'Sprawling biological park featuring a tiger safari, butterfly conservatory, and zoo nestled in Champaka forest.', category: 'wildlife', duration: 4, cost: 300, openingTime: '09:30', closingTime: '17:00', latitude: 12.8009, longitude: 77.5777 },
      { name: 'ISKCON Temple Bangalore', description: 'Monumental modern temple complex on Hare Krishna Hill blending neo-classical and traditional gopuram architecture.', category: 'culture', duration: 2, cost: 0, openingTime: '07:15', closingTime: '20:30', latitude: 13.0098, longitude: 77.5511 },
      { name: 'Visvesvaraya Industrial & Technological Museum', description: 'Interactive science museum honoring Sir M. Visvesvaraya, with hands-on engines, aviation simulators, and space galleries.', category: 'heritage', duration: 3, cost: 85, openingTime: '09:30', closingTime: '18:00', latitude: 12.9752, longitude: 77.5963 }
    ],
    hotels: [
      { name: 'The Leela Palace Bengaluru', pricePerNight: 11000, rating: 4.9, amenities: ['Pool', 'Spa', 'Wifi', 'Fine Dining'], address: '23, HAL Old Airport Rd, Bengaluru', latitude: 12.9605, longitude: 77.6485 },
      { name: 'ITC Gardenia', pricePerNight: 9000, rating: 4.8, amenities: ['Eco-friendly', 'Pool', 'Spa', 'Gym'], address: '1, Residency Rd, Ashok Nagar, Bengaluru', latitude: 12.9678, longitude: 77.5975 },
      { name: 'Taj West End', pricePerNight: 8500, rating: 4.7, amenities: ['Heritage Garden', 'Pool', 'Tennis', 'Wifi'], address: 'Race Course Rd, Bengaluru', latitude: 12.9860, longitude: 77.5840 },
      { name: 'Holiday Inn Bengaluru Racecourse', pricePerNight: 3800, rating: 4.3, amenities: ['Pool', 'Wifi', 'Restaurant'], address: 'Ward No 94, Seshadri Rd, Bengaluru', latitude: 12.9820, longitude: 77.5810 }
    ],
    restaurants: [
      { name: 'Vidyarthi Bhavan', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.5, address: 'Gandhi Bazaar, Basavanagudi, Bengaluru', latitude: 12.9430, longitude: 77.5708 },
      { name: 'MTR Mavalli Tiffin Room', cuisine: ['South Indian', 'Traditional'], priceRange: 'Budget', rating: 4.6, address: 'Lalbagh Fort Rd, Bengaluru', latitude: 12.9550, longitude: 77.5855 },
      { name: 'Karavalli', cuisine: ['Coastal', 'Seafood'], priceRange: 'Expensive', rating: 4.8, address: 'The Gateway Hotel, Residency Rd, Bengaluru', latitude: 12.9715, longitude: 77.6050 },
      { name: 'Truffles', cuisine: ['American', 'Burgers'], priceRange: 'Moderate', rating: 4.5, address: 'St. Marks Road, Bengaluru', latitude: 12.9730, longitude: 77.6015 }
    ]
  },
  {
    destination: {
      name: 'Mysuru',
      state: 'Karnataka',
      country: 'India',
      description: 'The City of Palaces, renowned for royal heritage, the illuminated Mysore Palace, sandalwood carving, and sweet Mysore Pak.',
      interests: ['heritage', 'culture', 'shopping', 'relaxation'],
      budgetRange: { min: 2500, max: 10000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 12.2958,
      longitude: 76.6394,
      images: []
    },
    attractions: [
      { name: 'Mysore Palace (Amba Vilas)', description: 'Grand Indo-Saracenic palace of the Wadiyar dynasty featuring mosaic floors, stained-glass domes, and 100,000 festival lights.', category: 'heritage', duration: 3, cost: 100, openingTime: '10:00', closingTime: '17:30', latitude: 12.3052, longitude: 76.6552 },
      { name: 'Chamundi Hill & Temple', description: 'Revered hilltop shrine dedicated to Goddess Chamundeshwari, featuring a colossal 16-foot monolithic Nandi bull.', category: 'spirituality', duration: 2, cost: 0, openingTime: '06:00', closingTime: '21:00', latitude: 12.2725, longitude: 76.6710 },
      { name: 'Brindavan Gardens', description: 'Terraced formal gardens below the Krishnarajasagara Dam, celebrated for symmetrical fountains and musical light shows.', category: 'nature', duration: 3, cost: 50, openingTime: '06:30', closingTime: '21:00', latitude: 12.4248, longitude: 76.5727 },
      { name: "St. Philomena's Cathedral", description: 'Neo-Gothic church with twin 175-foot spires inspired by Cologne Cathedral, housing relics of St. Philomena.', category: 'culture', duration: 1, cost: 0, openingTime: '05:00', closingTime: '18:00', latitude: 12.3208, longitude: 76.6578 },
      { name: 'Sri Chamarajendra Zoological Gardens', description: 'One of the oldest zoos in India established in 1892, set around Karanji lake with spacious conservation enclosures.', category: 'wildlife', duration: 3, cost: 100, openingTime: '08:30', closingTime: '17:30', latitude: 12.3025, longitude: 76.6660 }
    ],
    hotels: [
      { name: 'Lalitha Mahal Palace Hotel', pricePerNight: 5500, rating: 4.4, amenities: ['Heritage', 'Pool', 'Restaurant', 'Tennis'], address: 'Lalitha Mahal Nagar, Mysuru', latitude: 12.2990, longitude: 76.6900 },
      { name: 'Radisson Blu Plaza Hotel Mysore', pricePerNight: 4800, rating: 4.6, amenities: ['Pool', 'Spa', 'Wifi', 'Gym'], address: '1 MG Road, Mysuru', latitude: 12.3015, longitude: 76.6630 },
      { name: 'Grand Mercure Mysore', pricePerNight: 4200, rating: 4.5, amenities: ['Rooftop Pool', 'Wifi', 'Restaurant'], address: 'Nelson Mandela Rd, New Bannimantap, Mysuru', latitude: 12.3320, longitude: 76.6490 }
    ],
    restaurants: [
      { name: 'Mylari Dosa', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.6, address: 'Nazarbad Main Rd, Mysuru', latitude: 12.3080, longitude: 76.6620 },
      { name: 'Gufha Restaurant', cuisine: ['North Indian', 'Afghani'], priceRange: 'Moderate', rating: 4.2, address: 'The President Hotel, BN Road, Mysuru', latitude: 12.3115, longitude: 76.6560 },
      { name: 'Gayatri Tiffin Room', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.3, address: 'Chamundipuram, Mysuru', latitude: 12.2950, longitude: 76.6510 }
    ]
  },
  {
    destination: {
      name: 'Tirupati',
      state: 'Andhra Pradesh',
      country: 'India',
      description: 'One of the most visited religious destinations in the world, home to the sacred Venkateswara Temple atop the Seven Hills of Tirumala.',
      interests: ['spirituality', 'culture', 'heritage', 'relaxation'],
      budgetRange: { min: 2000, max: 8000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'September-March',
      latitude: 13.6288,
      longitude: 79.4192,
      images: []
    },
    attractions: [
      { name: 'Venkateswara Swamy Temple Tirumala', description: 'Ancient Vaishnavite hill temple dedicated to Lord Venkateswara, famed for its golden Ananda Nilayam tower and laddu prasadam.', category: 'spirituality', duration: 4, cost: 0, openingTime: '03:00', closingTime: '23:00', latitude: 13.6833, longitude: 79.3500 },
      { name: 'Sri Kapileswara Swamy Temple', description: 'Ancient Shiva temple located at the base of the Tirumala hills next to the natural Kapila Theertham waterfall.', category: 'spirituality', duration: 1, cost: 0, openingTime: '05:00', closingTime: '20:00', latitude: 13.6508, longitude: 79.4214 },
      { name: 'Chandragiri Fort', description: '11th-century fort palace of the Vijayanagara Empire, featuring the majestic Raja Mahal and sound-and-light show.', category: 'heritage', duration: 2, cost: 25, openingTime: '09:00', closingTime: '17:00', latitude: 13.5855, longitude: 79.3175 },
      { name: 'Silathoranam Natural Arch', description: 'Rare pre-Cambrian geological natural stone arch in the Tirumala Hills, one of only three such formations worldwide.', category: 'nature', duration: 1, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 13.6870, longitude: 79.3450 },
      { name: 'Sri Govindaraja Swamy Temple', description: 'Historic 12th-century temple in the heart of Tirupati consecrated by the saint philosopher Ramanuja.', category: 'spirituality', duration: 2, cost: 0, openingTime: '05:00', closingTime: '21:00', latitude: 13.6292, longitude: 79.4182 }
    ],
    hotels: [
      { name: 'Marasa Sarovar Premiere', pricePerNight: 4200, rating: 4.5, amenities: ['Pool', 'Spa', 'Wifi', 'Vegetarian'], address: 'Upadhyaya Nagar, Karakambadi Rd, Tirupati', latitude: 13.6420, longitude: 79.4450 },
      { name: 'Fortune Select Grand Ridge', pricePerNight: 3800, rating: 4.3, amenities: ['Pool', 'Gym', 'Wifi', 'Restaurant'], address: 'Shilparamam, Tiruchanoor Rd, Tirupati', latitude: 13.6180, longitude: 79.4320 },
      { name: 'Hotel Bliss Tirupati', pricePerNight: 2200, rating: 4.0, amenities: ['Wifi', 'Restaurant', 'Parking'], address: 'Near Ramanuja Circle, Tirupati', latitude: 13.6260, longitude: 79.4250 }
    ],
    restaurants: [
      { name: 'Andhra Spice', cuisine: ['Andhra', 'South Indian'], priceRange: 'Moderate', rating: 4.3, address: 'Near Railway Station, Tirupati', latitude: 13.6280, longitude: 79.4200 },
      { name: 'Minerva Coffee Shop', cuisine: ['Vegetarian', 'South Indian'], priceRange: 'Budget', rating: 4.2, address: 'Hotel Minerva, Tirupati', latitude: 13.6310, longitude: 79.4230 },
      { name: 'Do Dilon Ka Sangam', cuisine: ['North Indian', 'South Indian'], priceRange: 'Moderate', rating: 4.0, address: 'TP Area, Tirupati', latitude: 13.6295, longitude: 79.4190 }
    ]
  },
  {
    destination: {
      name: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      country: 'India',
      description: 'The Jewel of the East Coast, featuring pristine blue beaches, submarine museums, lush coastal hills, and ancient Buddhist ruins.',
      interests: ['beach', 'nature', 'adventure', 'relaxation'],
      budgetRange: { min: 2500, max: 11000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-March',
      latitude: 17.6868,
      longitude: 83.2185,
      images: []
    },
    attractions: [
      { name: 'Rishikonda Beach', description: 'Golden sandy beach known for gentle waves, water sports like windsurfing, and surrounding green hills.', category: 'beach', duration: 3, cost: 0, openingTime: '06:00', closingTime: '19:00', latitude: 17.7850, longitude: 83.3850 },
      { name: 'INS Kursura Submarine Museum', description: 'Decommissioned Kalvari-class Soviet submarine preserved on Ramakrishna Beach as a walk-through museum.', category: 'heritage', duration: 1, cost: 70, openingTime: '14:00', closingTime: '20:30', latitude: 17.7167, longitude: 83.3328 },
      { name: 'Kailasagiri Hill Park', description: 'Hilltop park offering panoramic views of the Bay of Bengal coastline, with a ropeway and giant Shiva-Parvati statues.', category: 'nature', duration: 2, cost: 20, openingTime: '06:00', closingTime: '19:30', latitude: 17.7490, longitude: 83.3420 },
      { name: 'Borra Caves', description: 'Deep million-year-old limestone caves in the Ananthagiri hills adorned with impressive stalactites and stalagmites.', category: 'adventure', duration: 3, cost: 80, openingTime: '10:00', closingTime: '17:00', latitude: 18.2800, longitude: 83.0400 },
      { name: 'Yarada Beach', description: 'Secluded pristine beach surrounded by the Dolphin’s Nose hill and banana plantations, far from city crowds.', category: 'beach', duration: 2, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 17.6540, longitude: 83.2710 }
    ],
    hotels: [
      { name: 'The Gateway Hotel Beach Road', pricePerNight: 4800, rating: 4.5, amenities: ['Sea View', 'Pool', 'Wifi', 'Restaurant'], address: 'Beach Rd, Pandurangapuram, Visakhapatnam', latitude: 17.7080, longitude: 83.3150 },
      { name: 'Novotel Visakhapatnam Varun Beach', pricePerNight: 6500, rating: 4.6, amenities: ['Infinity Pool', 'Sea View', 'Spa', 'Gym'], address: 'Beach Rd, Visakhapatnam', latitude: 17.7120, longitude: 83.3220 },
      { name: 'Best Western Ramachandra', pricePerNight: 2600, rating: 4.1, amenities: ['Wifi', 'Restaurant', 'Gym'], address: 'Gajuwaka, Visakhapatnam', latitude: 17.6910, longitude: 83.2080 }
    ],
    restaurants: [
      { name: 'Sea Inn - Raju Gari Dhaba', cuisine: ['Andhra', 'Seafood'], priceRange: 'Moderate', rating: 4.4, address: 'Rushikonda, Visakhapatnam', latitude: 17.7820, longitude: 83.3810 },
      { name: 'Sweet India Restaurant', cuisine: ['Vegetarian', 'North Indian'], priceRange: 'Budget', rating: 4.2, address: 'Dwaraka Nagar, Visakhapatnam', latitude: 17.7260, longitude: 83.3080 },
      { name: 'The Park Vista', cuisine: ['Multi-Cuisine', 'Coastal'], priceRange: 'Moderate', rating: 4.3, address: 'The Park, Beach Rd, Visakhapatnam', latitude: 17.7210, longitude: 83.3360 }
    ]
  },
  {
    destination: {
      name: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      description: 'The City of Pearls, where Nizami royalty meets high-tech modernism, celebrated for historic fortresses, diamond heritage, and fragrant dum biryani.',
      interests: ['heritage', 'food', 'culture', 'shopping'],
      budgetRange: { min: 3000, max: 15000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-March',
      latitude: 17.3850,
      longitude: 78.4867,
      images: []
    },
    attractions: [
      { name: 'Charminar', description: '16th-century square monument with four 160-foot minarets overlooking bustling bazaars, built by Muhammad Quli Qutb Shah.', category: 'heritage', duration: 2, cost: 25, openingTime: '09:30', closingTime: '17:30', latitude: 17.3616, longitude: 78.4747 },
      { name: 'Golconda Fort', description: 'Formidable medieval citadel famous for its acoustic engineering, royal palaces, and origin of the Koh-i-Noor diamond.', category: 'heritage', duration: 3, cost: 25, openingTime: '09:00', closingTime: '17:30', latitude: 17.3833, longitude: 78.4011 },
      { name: 'Ramoji Film City', description: 'The world’s largest integrated film studio complex covering over 2,000 acres, featuring movie sets and thematic rides.', category: 'adventure', duration: 6, cost: 1350, openingTime: '09:00', closingTime: '17:30', latitude: 17.2543, longitude: 78.6808 },
      { name: 'Salar Jung Museum', description: 'One of the three National Museums of India, displaying one of the world’s largest one-man art and antiquities collections.', category: 'culture', duration: 3, cost: 50, openingTime: '10:00', closingTime: '17:00', latitude: 17.3713, longitude: 78.4803 },
      { name: 'Hussain Sagar Lake & Buddha Statue', description: 'Heart-shaped artificial lake built in 1563, featuring a colossal 18-meter monolithic granite statue of Buddha on Gibraltar Rock.', category: 'nature', duration: 2, cost: 100, openingTime: '08:00', closingTime: '22:00', latitude: 17.4239, longitude: 78.4738 },
      { name: 'Chowmahalla Palace', description: 'Lavish palace of the Nizams of Hyderabad, boasting crystal chandeliers, vintage Rolls-Royces, and Persian gardens.', category: 'heritage', duration: 2, cost: 100, openingTime: '10:00', closingTime: '17:00', latitude: 17.3578, longitude: 78.4717 }
    ],
    hotels: [
      { name: 'Taj Falaknuma Palace', pricePerNight: 22000, rating: 4.9, amenities: ['Heritage Palace', 'Spa', 'Pool', 'Fine Dining'], address: 'Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad', latitude: 17.3315, longitude: 78.4675 },
      { name: 'ITC Kohenur', pricePerNight: 8500, rating: 4.8, amenities: ['Lake View', 'Pool', 'Spa', 'Gym'], address: 'HITEC City, Madhapur, Hyderabad', latitude: 17.4325, longitude: 78.3840 },
      { name: 'Park Hyatt Hyderabad', pricePerNight: 7500, rating: 4.7, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'], address: 'Road No. 2, Banjara Hills, Hyderabad', latitude: 17.4250, longitude: 78.4280 },
      { name: 'Lemon Tree Premier Hitec City', pricePerNight: 3800, rating: 4.3, amenities: ['Pool', 'Wifi', 'Bar', 'Gym'], address: 'Plot No 2, Hitec City, Hyderabad', latitude: 17.4410, longitude: 78.3810 }
    ],
    restaurants: [
      { name: 'Paradise Biryani', cuisine: ['Hyderabadi', 'Biryani'], priceRange: 'Moderate', rating: 4.4, address: 'SD Road, Secunderabad, Hyderabad', latitude: 17.4420, longitude: 78.4870 },
      { name: 'Bawarchi Restaurant', cuisine: ['Hyderabadi', 'Biryani'], priceRange: 'Budget', rating: 4.5, address: 'RTC X Roads, Musheerabad, Hyderabad', latitude: 17.4020, longitude: 78.4980 },
      { name: 'Chutneys', cuisine: ['South Indian', 'Vegetarian'], priceRange: 'Budget', rating: 4.3, address: 'Road No. 1, Banjara Hills, Hyderabad', latitude: 17.4180, longitude: 78.4490 },
      { name: 'Jewel of Nizam', cuisine: ['Hyderabadi', 'Mughlai'], priceRange: 'Expensive', rating: 4.7, address: 'The Golkonda Hotel, Masab Tank, Hyderabad', latitude: 17.4040, longitude: 78.4520 }
    ]
  },
  {
    destination: {
      name: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      description: 'The City of Dreams, a vibrant financial capital renowned for Victorian Gothic landmarks, Bollywood cinema, bustling seaside promenades, and diverse culinary scenes.',
      interests: ['culture', 'beach', 'food', 'shopping'],
      budgetRange: { min: 5000, max: 25000 },
      recommendedDuration: 4,
      bestTimeToVisit: 'November-February',
      latitude: 18.9220,
      longitude: 72.8347,
      images: []
    },
    attractions: [
      { name: 'Gateway of India', description: 'Majestic 26-meter basalt arch monument overlooking Mumbai Harbour, constructed to commemorate the visit of King George V in 1911.', category: 'heritage', duration: 1, cost: 0, openingTime: '00:00', closingTime: '23:59', latitude: 18.9220, longitude: 72.8347 },
      { name: 'Marine Drive & Queen’s Necklace', description: 'C-shaped 3.6-kilometer coastal boulevard along the Arabian Sea, famous for evening strolls and glittering night streetlights.', category: 'beach', duration: 2, cost: 0, openingTime: '00:00', closingTime: '23:59', latitude: 18.9432, longitude: 72.8230 },
      { name: 'Elephanta Caves', description: 'UNESCO World Heritage rock-cut cave temples dating to the 5th century, featuring the famous 20-foot three-headed Trimurti sculpture.', category: 'heritage', duration: 4, cost: 40, openingTime: '09:00', closingTime: '17:30', latitude: 18.9633, longitude: 72.9315 },
      { name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', description: 'Premier art and history museum housed in an exquisite Indo-Saracenic mansion, showcasing 50,000 exhibits.', category: 'culture', duration: 3, cost: 150, openingTime: '10:15', closingTime: '18:00', latitude: 18.9269, longitude: 72.8327 },
      { name: 'Siddhivinayak Temple', description: 'Famed two-century-old shrine dedicated to Lord Ganesha, venerated by millions of pilgrims and luminaries alike.', category: 'spirituality', duration: 2, cost: 0, openingTime: '05:30', closingTime: '22:00', latitude: 19.0168, longitude: 72.8304 },
      { name: 'Sanjay Gandhi National Park & Kanheri Caves', description: 'Sprawling 100-sq-km wilderness reserve within city borders, containing ancient Buddhist rock-cut caves and walking trails.', category: 'nature', duration: 4, cost: 65, openingTime: '07:30', closingTime: '18:30', latitude: 19.2215, longitude: 72.9124 }
    ],
    hotels: [
      { name: 'The Taj Mahal Palace Mumbai', pricePerNight: 18000, rating: 4.9, amenities: ['Heritage Luxury', 'Pool', 'Spa', 'Sea View'], address: 'Apollo Bunder, Colaba, Mumbai', latitude: 18.9217, longitude: 72.8332 },
      { name: 'The Oberoi Mumbai', pricePerNight: 16000, rating: 4.9, amenities: ['Sea View', 'Pool', 'Spa', 'Fine Dining'], address: 'Nariman Point, Mumbai', latitude: 18.9270, longitude: 72.8205 },
      { name: 'Trident Nariman Point', pricePerNight: 9000, rating: 4.7, amenities: ['Ocean View', 'Pool', 'Gym', 'Restaurant'], address: 'CR 2 Nariman Point, Mumbai', latitude: 18.9280, longitude: 72.8215 },
      { name: 'Residency Hotel Fort', pricePerNight: 3500, rating: 4.2, amenities: ['Wifi', 'Restaurant', 'Central Location'], address: 'DN Road, Fort, Mumbai', latitude: 18.9350, longitude: 72.8340 }
    ],
    restaurants: [
      { name: 'Britannia & Co.', cuisine: ['Parsi', 'Irani'], priceRange: 'Moderate', rating: 4.4, address: 'Wakefield House, Ballard Estate, Fort, Mumbai', latitude: 18.9355, longitude: 72.8390 },
      { name: 'Leopold Cafe', cuisine: ['Continental', 'Cafe'], priceRange: 'Moderate', rating: 4.2, address: 'Colaba Causeway, Mumbai', latitude: 18.9230, longitude: 72.8315 },
      { name: 'Bademiya', cuisine: ['Kebabs', 'Street Food'], priceRange: 'Budget', rating: 4.3, address: 'Tulloch Rd, Apollo Bandar, Colaba, Mumbai', latitude: 18.9225, longitude: 72.8320 },
      { name: 'Mahesh Lunch Home', cuisine: ['Mangalorean', 'Seafood'], priceRange: 'Moderate', rating: 4.5, address: 'Sir PM Road, Fort, Mumbai', latitude: 18.9340, longitude: 72.8335 }
    ]
  },
  {
    destination: {
      name: 'Agra',
      state: 'Uttar Pradesh',
      country: 'India',
      description: 'The Mughal imperial city on the Yamuna River, internationally renowned for the peerless Taj Mahal and grand UNESCO World Heritage red sandstone forts.',
      interests: ['heritage', 'culture', 'history', 'food'],
      budgetRange: { min: 2500, max: 12000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 27.1767,
      longitude: 78.0081,
      images: []
    },
    attractions: [
      { name: 'Taj Mahal', description: 'Universally admired ivory-white marble mausoleum built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal.', category: 'heritage', duration: 3, cost: 250, openingTime: '06:00', closingTime: '18:30', latitude: 27.1751, longitude: 78.0421 },
      { name: 'Agra Fort', description: 'Massive 16th-century Mughal fortress of red sandstone containing royal palaces like Khas Mahal and the Sheesh Mahal mirror palace.', category: 'heritage', duration: 3, cost: 50, openingTime: '06:00', closingTime: '18:00', latitude: 27.1795, longitude: 78.0211 },
      { name: 'Fatehpur Sikri', description: 'Ghost city and imperial capital founded by Emperor Akbar in 1571, home to the soaring Buland Darwaza gate.', category: 'heritage', duration: 4, cost: 50, openingTime: '06:00', closingTime: '18:00', latitude: 27.0945, longitude: 77.6679 },
      { name: 'Mehtab Bagh', description: 'Charbagh garden complex situated north of the Taj Mahal across the Yamuna River, providing quintessential sunset views.', category: 'nature', duration: 2, cost: 25, openingTime: '06:00', closingTime: '18:00', latitude: 27.1798, longitude: 78.0425 },
      { name: "Tomb of I'timad-ud-Daulah (Baby Taj)", description: 'Delicate marble tomb commissioned by Nur Jahan, considered the architectural draft and precursor to the Taj Mahal.', category: 'heritage', duration: 2, cost: 30, openingTime: '06:00', closingTime: '18:00', latitude: 27.1929, longitude: 78.0311 }
    ],
    hotels: [
      { name: 'The Oberoi Amarvilas', pricePerNight: 28000, rating: 4.9, amenities: ['Taj View', 'Luxury Spa', 'Pool', 'Fine Dining'], address: 'Taj East Gate Rd, Agra', latitude: 27.1685, longitude: 78.0510 },
      { name: 'ITC Mughal', pricePerNight: 6500, rating: 4.6, amenities: ['Mughal Garden', 'Spa', 'Pool', 'Wifi'], address: 'Fatehabad Rd, Tajganj, Agra', latitude: 27.1600, longitude: 78.0380 },
      { name: 'Crystal Sarovar Premiere Agra', pricePerNight: 3500, rating: 4.3, amenities: ['Pool', 'Rooftop Bar', 'Gym'], address: 'Fatehabad Rd, Agra', latitude: 27.1580, longitude: 78.0450 },
      { name: 'Hotel Taj Resorts', pricePerNight: 2200, rating: 4.1, amenities: ['Rooftop Pool', 'Wifi', 'Restaurant'], address: 'Taj East Gate Rd, Agra', latitude: 27.1690, longitude: 78.0530 }
    ],
    restaurants: [
      { name: 'Pinch of Spice', cuisine: ['North Indian', 'Mughlai'], priceRange: 'Moderate', rating: 4.5, address: 'Fatehabad Rd, Agra', latitude: 27.1590, longitude: 78.0410 },
      { name: 'Dasaprakash Agra', cuisine: ['South Indian', 'Vegetarian'], priceRange: 'Budget', rating: 4.2, address: 'Meher Cinema Complex, Gwalior Rd, Agra', latitude: 27.1620, longitude: 78.0150 },
      { name: "Joney's Place", cuisine: ['Cafe', 'Desserts'], priceRange: 'Budget', rating: 4.3, address: 'Miyan Bazar, Tajganj, Agra', latitude: 27.1710, longitude: 78.0430 }
    ]
  },
  {
    destination: {
      name: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
      description: 'One of the oldest continuously inhabited cities on Earth, considered the spiritual heart of Hinduism, lined with stone ghats along the holy river Ganges.',
      interests: ['spirituality', 'culture', 'heritage', 'history'],
      budgetRange: { min: 2000, max: 9000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-March',
      latitude: 25.3176,
      longitude: 82.9739,
      images: []
    },
    attractions: [
      { name: 'Kashi Vishwanath Temple', description: 'One of the twelve sacred Jyotirlingas of Lord Shiva, crowned with a gold-plated spire on the western bank of the Ganges.', category: 'spirituality', duration: 2, cost: 0, openingTime: '03:00', closingTime: '23:00', latitude: 25.3109, longitude: 83.0107 },
      { name: 'Dashashwamedh Ghat & Evening Ganga Aarti', description: 'The liveliest and oldest riverfront ghat in Varanasi, renowned for the synchronized brass lamp evening Aarti ceremony.', category: 'culture', duration: 2, cost: 0, openingTime: '05:00', closingTime: '21:00', latitude: 25.3060, longitude: 83.0105 },
      { name: 'Assi Ghat', description: 'Atmospheric southern ghat where the Assi River meets the Ganges, popular for sunrise morning yoga and classical music.', category: 'spirituality', duration: 2, cost: 0, openingTime: '05:00', closingTime: '22:00', latitude: 25.2890, longitude: 83.0062 },
      { name: 'Sarnath Deer Park & Dhamek Stupa', description: 'The deer park where Gautama Buddha first taught the Dharma after attaining enlightenment under the Bodhi tree.', category: 'heritage', duration: 3, cost: 25, openingTime: '09:00', closingTime: '17:00', latitude: 25.3811, longitude: 83.0214 },
      { name: 'Manikarnika Ghat', description: 'The primary cremation ghat in Hinduism, regarded as the sacred threshold for achieving Moksha (liberation).', category: 'culture', duration: 1, cost: 0, openingTime: '00:00', closingTime: '23:59', latitude: 25.3105, longitude: 83.0142 }
    ],
    hotels: [
      { name: 'BrijRama Palace', pricePerNight: 14000, rating: 4.8, amenities: ['Heritage Ghat Hotel', 'Boat Transfers', 'Spa', 'Vegetarian'], address: 'Darbhanga Ghat, Dashashwamedh, Varanasi', latitude: 25.3050, longitude: 78.0110 },
      { name: 'Taj Ganges Varanasi', pricePerNight: 7500, rating: 4.6, amenities: ['Pool', 'Spa', 'Gardens', 'Restaurant'], address: 'Nadesar Palace Grounds, Varanasi', latitude: 25.3340, longitude: 82.9820 },
      { name: 'Hotel Surya Kaiser Palace', pricePerNight: 3200, rating: 4.2, amenities: ['Pool', 'Gardens', 'Wifi', 'Restaurant'], address: 'The Mall, Cantonment, Varanasi', latitude: 25.3360, longitude: 82.9850 },
      { name: 'Scindhia Guest House', pricePerNight: 1800, rating: 4.0, amenities: ['River View', 'Wifi', 'Rooftop Cafe'], address: 'Scindhia Ghat, Varanasi', latitude: 25.3115, longitude: 83.0150 }
    ],
    restaurants: [
      { name: 'Keshari Restaurant', cuisine: ['North Indian', 'Vegetarian'], priceRange: 'Budget', rating: 4.3, address: 'Near Dashashwamedh Ghat, Varanasi', latitude: 25.3065, longitude: 78.0095 },
      { name: 'Blue Lassi Shop', cuisine: ['Lassi', 'Traditional Desserts'], priceRange: 'Budget', rating: 4.6, address: 'Bangali Tola, Varanasi', latitude: 25.3090, longitude: 83.0125 },
      { name: 'Baati Chokha', cuisine: ['Bihari', 'Traditional'], priceRange: 'Budget', rating: 4.4, address: 'Anand Mandir Cinema Rd, Varanasi', latitude: 25.3210, longitude: 82.9920 }
    ]
  },
  {
    destination: {
      name: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      description: 'The City of Lakes and Venice of the East, famed for shimmering Lake Pichola, fairy-tale marble palaces, and scenic Aravalli hills.',
      interests: ['heritage', 'culture', 'relaxation', 'food'],
      budgetRange: { min: 4000, max: 18000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-March',
      latitude: 24.5854,
      longitude: 73.7125,
      images: []
    },
    attractions: [
      { name: 'City Palace Udaipur', description: 'Monumental hilltop palace complex over Lake Pichola, featuring cupolas, mirrored courtyards, and museum galleries.', category: 'heritage', duration: 3, cost: 300, openingTime: '09:30', closingTime: '17:30', latitude: 24.5764, longitude: 73.6835 },
      { name: 'Lake Pichola & Sunset Boat Ride', description: 'Serene artificial freshwater lake created in 1362, surrounded by bathing ghats, grand palaces, and scenic hills.', category: 'relaxation', duration: 2, cost: 400, openingTime: '09:00', closingTime: '18:00', latitude: 24.5700, longitude: 73.6780 },
      { name: 'Jag Mandir Island Palace', description: 'Island palace built on Lake Pichola, renowned for eight carved stone elephants and marble pavilion courtyards.', category: 'heritage', duration: 2, cost: 450, openingTime: '09:00', closingTime: '18:00', latitude: 24.5678, longitude: 73.6775 },
      { name: 'Saheliyon-ki-Bari', description: 'Historic 18th-century garden of the maidens featuring lotus pools, marble pavilions, and bird-sculptured fountains.', category: 'nature', duration: 1, cost: 20, openingTime: '09:00', closingTime: '19:00', latitude: 24.6025, longitude: 73.6845 },
      { name: 'Bagore Ki Haveli', description: 'Ancient mansion on Gangaur Ghat with over 100 rooms displaying folk art, puppets, and daily Dharohar folk dances.', category: 'culture', duration: 2, cost: 100, openingTime: '09:30', closingTime: '20:00', latitude: 24.5794, longitude: 73.6811 }
    ],
    hotels: [
      { name: 'Taj Lake Palace', pricePerNight: 24000, rating: 4.9, amenities: ['Island Palace', 'Luxury Spa', 'Boat Transfer', 'Pool'], address: 'Pichola, Udaipur', latitude: 24.5752, longitude: 73.6800 },
      { name: 'The Leela Palace Udaipur', pricePerNight: 22000, rating: 4.9, amenities: ['Lake View', 'Pool', 'Spa', 'Fine Dining'], address: 'Lake Pichola, Udaipur', latitude: 24.5790, longitude: 73.6760 },
      { name: 'Trident Udaipur', pricePerNight: 7000, rating: 4.6, amenities: ['Pool', 'Garden', 'Spa', 'Kids Club'], address: 'Haridas Ji Ki Magri, Udaipur', latitude: 24.5720, longitude: 73.6690 },
      { name: 'Jagat Niwas Palace', pricePerNight: 4500, rating: 4.4, amenities: ['Heritage', 'Lake View', 'Rooftop Dining'], address: 'Lal Ghat, Udaipur', latitude: 24.5780, longitude: 73.6825 }
    ],
    restaurants: [
      { name: 'Ambrai Restaurant', cuisine: ['Rajasthani', 'North Indian'], priceRange: 'Expensive', rating: 4.6, address: 'Amet Haveli, Naga Nagri, Udaipur', latitude: 24.5805, longitude: 73.6795 },
      { name: 'Upre by 1559 AD', cuisine: ['North Indian', 'Continental'], priceRange: 'Moderate', rating: 4.5, address: 'Lake Pichola Hotel, Rooftop, Udaipur', latitude: 24.5795, longitude: 73.6805 },
      { name: 'Millets of Mewar', cuisine: ['Healthy', 'Rajasthani'], priceRange: 'Budget', rating: 4.4, address: 'Hanuman Ghat, Udaipur', latitude: 24.5815, longitude: 73.6800 }
    ]
  },
  {
    destination: {
      name: 'Manali',
      state: 'Himachal Pradesh',
      country: 'India',
      description: 'High-altitude Himalayan resort town nestled in the Beas River Valley, renowned for snow sports, pine forests, and gateways to Spiti and Ladakh.',
      interests: ['adventure', 'nature', 'relaxation'],
      budgetRange: { min: 3500, max: 15000 },
      recommendedDuration: 4,
      bestTimeToVisit: 'October-June',
      latitude: 32.2432,
      longitude: 77.1892,
      images: []
    },
    attractions: [
      { name: 'Solang Valley', description: 'Year-round adventure valley offering paragliding, zorbing, quad biking in summer, and skiing in winter.', category: 'adventure', duration: 4, cost: 500, openingTime: '09:00', closingTime: '18:00', latitude: 32.3167, longitude: 77.1575 },
      { name: 'Rohtang Pass', description: 'High Himalayan mountain pass at 13,058 feet offering dramatic snow landscapes and glaciers connecting Kullu with Lahaul.', category: 'nature', duration: 5, cost: 550, openingTime: '06:00', closingTime: '16:00', latitude: 32.3716, longitude: 77.2466 },
      { name: 'Hadimba Temple', description: 'Four-tiered wooden pagoda temple built in 1553, set amidst a towering deodar pine forest dedicated to Hidimbi Devi.', category: 'culture', duration: 1, cost: 0, openingTime: '08:00', closingTime: '18:00', latitude: 32.2483, longitude: 77.1819 },
      { name: 'Jogini Waterfall', description: 'Cascading alpine waterfall accessible via an invigorating scenic trek from Vashisht village through apple orchards.', category: 'nature', duration: 3, cost: 0, openingTime: '06:00', closingTime: '18:00', latitude: 32.2680, longitude: 77.1950 },
      { name: 'Old Manali & Manu Temple', description: 'Laid-back mountain village with traditional Himachali stone-wood houses, apple trees, and the ancient shrine of sage Manu.', category: 'culture', duration: 2, cost: 0, openingTime: '08:00', closingTime: '19:00', latitude: 32.2530, longitude: 77.1780 }
    ],
    hotels: [
      { name: 'The Tamara Manali', pricePerNight: 8000, rating: 4.7, amenities: ['Mountain View', 'Spa', 'Pool', 'Heated Rooms'], address: 'Prini, Manali', latitude: 32.2210, longitude: 77.1980 },
      { name: 'Apple Country Resorts', pricePerNight: 4500, rating: 4.3, amenities: ['Spa', 'Mountain View', 'Wifi', 'Restaurant'], address: 'Log Huts Area, Manali', latitude: 32.2520, longitude: 77.1810 },
      { name: 'Snow Valley Resorts', pricePerNight: 3200, rating: 4.2, amenities: ['Garden', 'Wifi', 'Restaurant', 'Gym'], address: 'Log Huts Area, Manali', latitude: 32.2510, longitude: 77.1830 }
    ],
    restaurants: [
      { name: 'Cafe 1947', cuisine: ['Italian', 'Cafe'], priceRange: 'Moderate', rating: 4.5, address: 'Old Manali, Near Bridge, Manali', latitude: 32.2515, longitude: 77.1800 },
      { name: "Johnson's Cafe", cuisine: ['Trout', 'Continental'], priceRange: 'Moderate', rating: 4.4, address: 'Circuit House Rd, Siyal, Manali', latitude: 32.2470, longitude: 77.1860 },
      { name: 'The Lazy Dog Lounge', cuisine: ['Multi-Cuisine', 'Bar'], priceRange: 'Moderate', rating: 4.3, address: 'Manu Temple Rd, Old Manali', latitude: 32.2540, longitude: 77.1770 }
    ]
  },
  {
    destination: {
      name: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      description: 'The Queen of the Hills in the lower Himalayas, famous for world-renowned aromatic tea estates, the UNESCO toy train, and Kanchenjunga mountain views.',
      interests: ['nature', 'relaxation', 'heritage', 'adventure'],
      budgetRange: { min: 3000, max: 13000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'March-May',
      latitude: 27.0410,
      longitude: 88.2663,
      images: []
    },
    attractions: [
      { name: 'Tiger Hill Sunrise Viewpoint', description: 'Famous summit viewpoint providing sunrise vistas of Mount Everest and Mount Kanchenjunga turning crimson.', category: 'nature', duration: 2, cost: 50, openingTime: '04:00', closingTime: '07:00', latitude: 27.0050, longitude: 88.2830 },
      { name: 'Darjeeling Himalayan Railway Toy Train', description: 'Iconic UNESCO narrow-gauge steam train climbing through mountain loops and misty pine forests since 1881.', category: 'heritage', duration: 3, cost: 1000, openingTime: '08:00', closingTime: '17:00', latitude: 27.0370, longitude: 88.2630 },
      { name: 'Batasia Loop & War Memorial', description: 'Spiral railway loop wrapping around a manicured hillside garden and Gurkha soldiers memorial with panoramic peak views.', category: 'heritage', duration: 1, cost: 20, openingTime: '05:00', closingTime: '18:00', latitude: 27.0167, longitude: 88.2467 },
      { name: 'Padmaja Naidu Himalayan Zoological Park', description: 'High-altitude zoo internationally recognized for its successful breeding programs for snow leopards and red pandas.', category: 'wildlife', duration: 3, cost: 110, openingTime: '08:30', closingTime: '16:30', latitude: 27.0583, longitude: 88.2544 },
      { name: 'Happy Valley Tea Estate', description: 'One of the oldest organic tea gardens in Darjeeling, established in 1854, offering walking tours and tea tasting.', category: 'nature', duration: 2, cost: 100, openingTime: '08:00', closingTime: '16:00', latitude: 27.0540, longitude: 88.2610 }
    ],
    hotels: [
      { name: 'The Elgin Darjeeling', pricePerNight: 7500, rating: 4.6, amenities: ['Heritage Mansion', 'Spa', 'Tea Lounge', 'Wifi'], address: '18, HD Lama Rd, Darjeeling', latitude: 27.0430, longitude: 88.2660 },
      { name: 'Mayfair Darjeeling', pricePerNight: 8000, rating: 4.7, amenities: ['Spa', 'Mountain View', 'Gym', 'Restaurant'], address: 'Opp Governor House, The Mall, Darjeeling', latitude: 27.0490, longitude: 88.2680 },
      { name: 'Windamere Hotel', pricePerNight: 6000, rating: 4.4, amenities: ['Historic Heritage', 'Fireplace', 'Garden'], address: 'Observatory Hill, Darjeeling', latitude: 27.0460, longitude: 88.2700 }
    ],
    restaurants: [
      { name: "Glenary's Bakery & Cafe", cuisine: ['Bakery', 'Continental'], priceRange: 'Moderate', rating: 4.6, address: 'Nehru Rd, Chauk Bazaar, Darjeeling', latitude: 27.0435, longitude: 88.2675 },
      { name: 'Keventers Darjeeling', cuisine: ['Breakfast', 'English'], priceRange: 'Budget', rating: 4.4, address: 'Club Side, Darjeeling', latitude: 27.0425, longitude: 88.2668 },
      { name: 'Kunga Restaurant', cuisine: ['Tibetan', 'Asian'], priceRange: 'Budget', rating: 4.5, address: 'Gandhi Rd, Darjeeling', latitude: 27.0415, longitude: 88.2655 }
    ]
  },
  {
    destination: {
      name: 'Delhi',
      state: 'Delhi',
      country: 'India',
      description: 'The vibrant national capital of India, blending centuries of Mughal imperial grandeur, British Raj architecture, and modern cosmopolitan life.',
      interests: ['heritage', 'culture', 'food', 'shopping'],
      budgetRange: { min: 3000, max: 16000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-March',
      latitude: 28.6139,
      longitude: 77.2090,
      images: []
    },
    attractions: [
      { name: 'Red Fort (Lal Qila)', description: 'Grand octagonal red sandstone fortress complex constructed by Emperor Shah Jahan in 1639, symbol of India’s sovereignty.', category: 'heritage', duration: 3, cost: 35, openingTime: '09:30', closingTime: '16:30', latitude: 28.6562, longitude: 77.2410 },
      { name: 'Qutub Minar', description: '73-meter fluted red sandstone victory minaret begun by Qutb-ud-din Aibak in 1192, a UNESCO World Heritage monument.', category: 'heritage', duration: 2, cost: 35, openingTime: '07:00', closingTime: '17:00', latitude: 28.5245, longitude: 77.1855 },
      { name: "Humayun's Tomb", description: 'First substantial example of Mughal garden tomb architecture, built in 1570 and inspiring the later Taj Mahal.', category: 'heritage', duration: 2, cost: 35, openingTime: '06:00', closingTime: '18:00', latitude: 28.5933, longitude: 77.2507 },
      { name: 'India Gate', description: 'Iconic 42-meter triumphal arch war memorial designed by Sir Edwin Lutyens, commemorating soldiers of World War I.', category: 'heritage', duration: 1, cost: 0, openingTime: '00:00', closingTime: '23:59', latitude: 28.6129, longitude: 77.2295 },
      { name: 'Lotus Temple', description: 'Baháʼí House of Worship designed in the shape of a blooming white lotus flower, welcoming people of all faiths to pray.', category: 'culture', duration: 2, cost: 0, openingTime: '09:00', closingTime: '17:00', latitude: 28.5535, longitude: 77.2588 },
      { name: 'Swaminarayan Akshardham Temple', description: 'Sprawling Hindu temple campus showcasing millennia of Indian art, spiritual wisdom, boat rides, and water shows.', category: 'culture', duration: 4, cost: 0, openingTime: '10:00', closingTime: '18:30', latitude: 28.6127, longitude: 77.2773 }
    ],
    hotels: [
      { name: 'The Imperial New Delhi', pricePerNight: 14000, rating: 4.8, amenities: ['Heritage Luxury', 'Pool', 'Spa', 'Fine Dining'], address: 'Janpath Lane, Connaught Place, New Delhi', latitude: 28.6225, longitude: 77.2180 },
      { name: 'The Taj Mahal Hotel New Delhi', pricePerNight: 12000, rating: 4.8, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'], address: '1, Mansingh Rd, New Delhi', latitude: 28.6050, longitude: 77.2250 },
      { name: 'The Claridges New Delhi', pricePerNight: 7000, rating: 4.5, amenities: ['Pool', 'Gardens', 'Wifi', 'Restaurant'], address: '12, Dr APJ Abdul Kalam Rd, New Delhi', latitude: 28.5990, longitude: 77.2185 },
      { name: 'Bloomrooms @ Janpath', pricePerNight: 3200, rating: 4.3, amenities: ['Wifi', 'Cafe', 'Air Conditioning'], address: '1, Janpath, New Delhi', latitude: 28.6190, longitude: 77.2190 }
    ],
    restaurants: [
      { name: "Karim's Old Delhi", cuisine: ['Mughlai', 'Kebabs'], priceRange: 'Budget', rating: 4.4, address: 'Gali Kababian, Jama Masjid, Old Delhi', latitude: 28.6505, longitude: 77.2335 },
      { name: 'Bukhara', cuisine: ['North Indian', 'Tandoori'], priceRange: 'Expensive', rating: 4.8, address: 'ITC Maurya, Diplomatic Enclave, New Delhi', latitude: 28.5975, longitude: 77.1735 },
      { name: 'Saravana Bhavan Janpath', cuisine: ['South Indian'], priceRange: 'Budget', rating: 4.3, address: 'Janpath, Connaught Place, New Delhi', latitude: 28.6280, longitude: 77.2195 },
      { name: 'Gulati Restaurant', cuisine: ['North Indian', 'Butter Chicken'], priceRange: 'Moderate', rating: 4.6, address: 'Pandara Market, New Delhi', latitude: 28.6065, longitude: 77.2340 }
    ]
  },
  {
    destination: {
      name: 'Amritsar',
      state: 'Punjab',
      country: 'India',
      description: 'The spiritual centre of Sikhism, internationally revered for the Golden Temple, rich Punjabi cuisine, and the historic Wagah Border ceremony.',
      interests: ['spirituality', 'heritage', 'culture', 'food'],
      budgetRange: { min: 2000, max: 9000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 31.6340,
      longitude: 74.8723,
      images: []
    },
    attractions: [
      { name: 'Golden Temple (Sri Harmandir Sahib)', description: 'Most sacred shrine of Sikhism covered with pure gold foil, surrounded by the holy Amrit Sarovar pool and operating the world’s largest free community kitchen (langar).', category: 'spirituality', duration: 3, cost: 0, openingTime: '03:00', closingTime: '23:00', latitude: 31.6200, longitude: 74.8765 },
      { name: 'Wagah Border Beating Retreat Ceremony', description: 'Electric daily military drill and flag-lowering ceremony conducted by India’s BSF and Pakistan’s Rangers at the international border.', category: 'heritage', duration: 3, cost: 0, openingTime: '15:00', closingTime: '19:00', latitude: 31.6045, longitude: 74.5730 },
      { name: 'Jallianwala Bagh', description: 'Historic national memorial park preserving the martyrdom site of the 1919 massacre, including the bullet marks and Martyrs’ Well.', category: 'heritage', duration: 1, cost: 0, openingTime: '06:30', closingTime: '19:30', latitude: 31.6208, longitude: 74.8802 },
      { name: 'Partition Museum', description: 'World’s first museum dedicated to the 1947 partition of the subcontinent, housing personal oral histories and refugee artifacts.', category: 'culture', duration: 2, cost: 10, openingTime: '10:00', closingTime: '18:00', latitude: 31.6235, longitude: 74.8790 },
      { name: 'Gobindgarh Fort', description: '18th-century military fort built by Maharaja Ranjit Singh, featuring the Toshakhana treasury and evening 7D light shows.', category: 'heritage', duration: 3, cost: 150, openingTime: '10:00', closingTime: '22:00', latitude: 31.6285, longitude: 74.8620 }
    ],
    hotels: [
      { name: 'Hyatt Regency Amritsar', pricePerNight: 4500, rating: 4.6, amenities: ['Pool', 'Spa', 'Wifi', 'Restaurant'], address: 'MBM Farms, GT Road, Amritsar', latitude: 31.6280, longitude: 74.9120 },
      { name: 'Taj Swarna Amritsar', pricePerNight: 6500, rating: 4.7, amenities: ['Pool', 'Spa', 'Gym', 'Fine Dining'], address: 'Majitha Verka Bypass, Amritsar', latitude: 31.6620, longitude: 74.8870 },
      { name: 'Hotel City Park', pricePerNight: 2400, rating: 4.1, amenities: ['Wifi', 'Restaurant', 'Close to Golden Temple'], address: 'Near Jallianwala Bagh, Amritsar', latitude: 31.6220, longitude: 74.8780 }
    ],
    restaurants: [
      { name: 'Kesar Da Dhaba', cuisine: ['Punjabi', 'Thali'], priceRange: 'Budget', rating: 4.5, address: 'Chowk Passian, Near Telephone Exchange, Amritsar', latitude: 31.6230, longitude: 74.8720 },
      { name: 'Bharawan Da Dhaba', cuisine: ['Punjabi', 'Vegetarian'], priceRange: 'Budget', rating: 4.3, address: 'Near Town Hall, Amritsar', latitude: 31.6240, longitude: 74.8770 },
      { name: 'Beera Chicken House', cuisine: ['Chicken Tikka', 'Punjabi'], priceRange: 'Budget', rating: 4.4, address: 'Majitha Rd, Amritsar', latitude: 31.6450, longitude: 74.8790 }
    ]
  },
  {
    destination: {
      name: 'Shimla',
      state: 'Himachal Pradesh',
      country: 'India',
      description: 'The historic summer capital of British India, set along a seven-mile ridge surrounded by dense oak and cedar forests with colonial architecture.',
      interests: ['nature', 'heritage', 'relaxation'],
      budgetRange: { min: 3000, max: 13000 },
      recommendedDuration: 3,
      bestTimeToVisit: 'October-June',
      latitude: 31.1048,
      longitude: 77.1734,
      images: []
    },
    attractions: [
      { name: 'The Ridge & Mall Road', description: 'Pedestrian-only open esplanade at the heart of Shimla offering panoramic views of snow-clad mountains and neo-Gothic Christ Church.', category: 'heritage', duration: 3, cost: 0, openingTime: '08:00', closingTime: '21:00', latitude: 31.1042, longitude: 77.1746 },
      { name: 'Jakhoo Temple & Giant Hanuman Statue', description: 'Ancient temple on Shimla’s highest peak at 8,054 feet, crowned with a 108-foot statue of Lord Hanuman.', category: 'spirituality', duration: 2, cost: 0, openingTime: '06:00', closingTime: '19:00', latitude: 31.1010, longitude: 77.1850 },
      { name: 'Kalka-Shimla Toy Train', description: 'UNESCO World Heritage mountain railway traversing 102 tunnels, arched bridges, and dramatic pine ridges.', category: 'heritage', duration: 4, cost: 350, openingTime: '06:00', closingTime: '18:00', latitude: 31.1030, longitude: 77.1680 },
      { name: 'Rashtrapati Niwas (Viceregal Lodge)', description: 'English Renaissance Jacobethan estate on Observatory Hill, former residence of British Viceroys of India.', category: 'heritage', duration: 2, cost: 50, openingTime: '10:00', closingTime: '17:00', latitude: 31.1037, longitude: 77.1417 },
      { name: 'Kufri Fun World & Mahasu Peak', description: 'High hill retreat popular for winter horse riding, snow slopes, and panoramic Himalayan mountain vistas.', category: 'adventure', duration: 3, cost: 250, openingTime: '09:00', closingTime: '18:00', latitude: 31.0970, longitude: 77.2670 }
    ],
    hotels: [
      { name: 'Wildflower Hall Shimla', pricePerNight: 22000, rating: 4.9, amenities: ['Luxury Spa', 'Heated Pool', 'Mountain View', 'Fine Dining'], address: 'Chharabra, Shimla', latitude: 31.1250, longitude: 77.2450 },
      { name: 'The Oberoi Cecil', pricePerNight: 14000, rating: 4.8, amenities: ['Heritage', 'Indoor Pool', 'Spa', 'Restaurant'], address: 'Chaura Maidan, Shimla', latitude: 31.1020, longitude: 77.1530 },
      { name: 'Radisson Hotel Shimla', pricePerNight: 5500, rating: 4.4, amenities: ['Pool', 'Spa', 'Wifi', 'Restaurant'], address: 'Goodwood Estate, Lower Bharari Rd, Shimla', latitude: 31.1150, longitude: 77.1780 }
    ],
    restaurants: [
      { name: 'Cafe Simla Times', cuisine: ['Italian', 'Cafe'], priceRange: 'Moderate', rating: 4.4, address: 'The Mall, Near Scandal Point, Shimla', latitude: 31.1038, longitude: 77.1740 },
      { name: 'Wake & Bake Cafe', cuisine: ['Continental', 'Breakfast'], priceRange: 'Budget', rating: 4.5, address: 'The Mall, Shimla', latitude: 31.1045, longitude: 77.1725 },
      { name: 'Baljees Restaurant', cuisine: ['North Indian', 'Sweets'], priceRange: 'Budget', rating: 4.2, address: 'Mall Road, Shimla', latitude: 31.1040, longitude: 77.1730 }
    ]
  },
  {
    destination: {
      name: 'Jodhpur',
      state: 'Rajasthan',
      country: 'India',
      description: 'The Blue City and Sun City on the edge of the Thar Desert, commanded by the soaring Mehrangarh Fort and indigo-painted old town houses.',
      interests: ['heritage', 'culture', 'history', 'shopping'],
      budgetRange: { min: 2500, max: 11000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-March',
      latitude: 26.2389,
      longitude: 73.0243,
      images: []
    },
    attractions: [
      { name: 'Mehrangarh Fort', description: 'Towering 15th-century fortress rising 400 feet above the city, containing palatial courtyards, royal palanquins, and cannons.', category: 'heritage', duration: 3, cost: 100, openingTime: '09:00', closingTime: '17:00', latitude: 26.2978, longitude: 73.0185 },
      { name: 'Jaswant Thada', description: 'White marble cenotaph built by Maharaja Sardar Singh in 1899, known as the Taj Mahal of Marwar, set beside a peaceful lake.', category: 'heritage', duration: 1, cost: 30, openingTime: '09:00', closingTime: '17:00', latitude: 26.3032, longitude: 73.0221 },
      { name: 'Umaid Bhawan Palace Museum', description: 'One of the world’s largest private royal residences, designed by Henry Lanchester in Art Deco and Beaux-Arts architectural styles.', category: 'heritage', duration: 2, cost: 30, openingTime: '09:00', closingTime: '17:00', latitude: 26.2808, longitude: 73.0475 },
      { name: 'Mandore Gardens', description: 'Ancient capital of the Parihar rulers featuring soaring rock-cut cenotaphs, high-relief temples, and resident langur monkeys.', category: 'heritage', duration: 2, cost: 0, openingTime: '08:00', closingTime: '20:00', latitude: 26.3570, longitude: 73.0420 },
      { name: 'Clock Tower & Sardar Market', description: 'Historic central market surrounded by triple-tier gateways, celebrated for fragrant spices, leather mojari shoes, and handicrafts.', category: 'shopping', duration: 2, cost: 0, openingTime: '10:00', closingTime: '21:00', latitude: 26.2945, longitude: 73.0240 }
    ],
    hotels: [
      { name: 'Umaid Bhawan Palace Jodhpur', pricePerNight: 35000, rating: 4.9, amenities: ['Royal Palace', 'Spa', 'Pool', 'Fine Dining'], address: 'Circuit House Rd, Jodhpur', latitude: 26.2810, longitude: 73.0470 },
      { name: 'RAAS Jodhpur', pricePerNight: 14000, rating: 4.8, amenities: ['Boutique Haveli', 'Pool', 'Fort View', 'Spa'], address: 'Tunwar ji ka Jhalra, Makrana Mohalla, Jodhpur', latitude: 26.2985, longitude: 73.0230 },
      { name: 'The Ajit Bhawan Palace', pricePerNight: 6000, rating: 4.5, amenities: ['Heritage Resort', 'Pool', 'Wifi', 'Gardens'], address: 'Circuit House Rd, Jodhpur', latitude: 26.2850, longitude: 73.0410 }
    ],
    restaurants: [
      { name: 'Indique Restaurant', cuisine: ['Rajasthani', 'North Indian'], priceRange: 'Moderate', rating: 4.4, address: 'Pal Haveli, Near Clock Tower, Jodhpur', latitude: 26.2950, longitude: 73.0235 },
      { name: 'Gypsy Vegetarian Thali', cuisine: ['Rajasthani Thali'], priceRange: 'Budget', rating: 4.6, address: 'Sardarpura, Jodhpur', latitude: 26.2780, longitude: 73.0120 },
      { name: 'Janta Sweet Home', cuisine: ['Snacks', 'Mawa Kachori'], priceRange: 'Budget', rating: 4.5, address: 'Nai Sarak, Jodhpur', latitude: 26.2930, longitude: 73.0250 }
    ]
  },
  {
    destination: {
      name: 'Puri',
      state: 'Odisha',
      country: 'India',
      description: 'Sacred coastal pilgrimage city on the Bay of Bengal, home to the 12th-century Jagannath Temple, the annual Ratha Yatra, and Blue Flag Golden Beach.',
      interests: ['spirituality', 'beach', 'culture', 'heritage'],
      budgetRange: { min: 2000, max: 8000 },
      recommendedDuration: 2,
      bestTimeToVisit: 'October-February',
      latitude: 19.8135,
      longitude: 85.8312,
      images: []
    },
    attractions: [
      { name: 'Shree Jagannath Temple', description: 'Revered 12th-century Kalinga-style temple dedicated to Lord Jagannath, featuring its 214-foot sikhara and world-famous Mahaprasad.', category: 'spirituality', duration: 3, cost: 0, openingTime: '05:00', closingTime: '23:00', latitude: 19.8048, longitude: 85.8180 },
      { name: 'Golden Beach Puri', description: 'Blue Flag certified clean sandy beach offering peaceful sunrise strolls, safe swimming, and lively local sand art exhibits.', category: 'beach', duration: 3, cost: 0, openingTime: '06:00', closingTime: '20:00', latitude: 19.7980, longitude: 85.8280 },
      { name: 'Konark Sun Temple (Day Trip)', description: 'UNESCO World Heritage 13th-century monument sculpted as a giant 24-wheeled chariot of Surya, the Sun God.', category: 'heritage', duration: 3, cost: 40, openingTime: '06:00', closingTime: '20:00', latitude: 19.8876, longitude: 86.0945 },
      { name: 'Chilika Lake (Satapada Dolphin Sanctuary)', description: 'Asia’s largest brackish water lagoon, where visitors take motorized boat safaris to spot endangered Irrawaddy dolphins.', category: 'nature', duration: 4, cost: 600, openingTime: '07:00', closingTime: '17:00', latitude: 19.6700, longitude: 85.4300 },
      { name: 'Gundicha Temple', description: 'The Garden House of Jagannath, where the deities reside for seven days during the grand summer Ratha Yatra festival.', category: 'spirituality', duration: 1, cost: 0, openingTime: '06:00', closingTime: '21:00', latitude: 19.8250, longitude: 85.8390 }
    ],
    hotels: [
      { name: 'Mayfair Waves Puri', pricePerNight: 6500, rating: 4.7, amenities: ['Beachfront', 'Pool', 'Spa', 'Wifi'], address: 'Chakratirtha Rd, Puri', latitude: 19.8010, longitude: 78.8350 },
      { name: 'Toshali Sands Resort', pricePerNight: 3800, rating: 4.2, amenities: ['Resort Gardens', 'Pool', 'Spa', 'Wifi'], address: 'Konark Marine Drive, Puri', latitude: 19.8250, longitude: 85.8650 },
      { name: 'Hotel Hans Coco Palms', pricePerNight: 4200, rating: 4.3, amenities: ['Sea View', 'Pool', 'Restaurant'], address: 'Swargadwar, Puri', latitude: 19.7950, longitude: 85.8190 }
    ],
    restaurants: [
      { name: 'Wildgrass Restaurant', cuisine: ['Odia', 'Seafood'], priceRange: 'Moderate', rating: 4.4, address: 'VIP Rd, Puri', latitude: 19.8050, longitude: 85.8310 },
      { name: 'Chung Wah Chinese Restaurant', cuisine: ['Chinese', 'Asian'], priceRange: 'Budget', rating: 4.2, address: 'VIP Rd, Puri', latitude: 19.8040, longitude: 85.8300 },
      { name: 'Peace Restaurant', cuisine: ['Multi-Cuisine', 'Vegetarian'], priceRange: 'Budget', rating: 4.1, address: 'Chakratirtha Rd, Puri', latitude: 19.8015, longitude: 85.8340 }
    ]
  }
];

async function seedExpansion() {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');

    let newDestCount = 0;
    let newAttrCount = 0;
    let newHotelCount = 0;
    let newRestCount = 0;

    for (const item of expansionData) {
      // 1. Check or insert Destination
      let dest = await Destination.findOne({ name: item.destination.name });
      if (!dest) {
        dest = await Destination.create(item.destination);
        newDestCount++;
        console.log(`[+] Added Destination: ${dest.name} (${dest.state})`);
      } else {
        console.log(`[*] Destination already exists: ${dest.name}`);
      }

      // 2. Check or insert Attractions
      for (const attrData of item.attractions) {
        const existingAttr = await Attraction.findOne({ destinationId: dest._id, name: attrData.name });
        if (!existingAttr) {
          await Attraction.create({ ...attrData, destinationId: dest._id });
          newAttrCount++;
        }
      }

      // 3. Check or insert Hotels
      for (const hotelData of item.hotels) {
        const existingHotel = await Hotel.findOne({ destinationId: dest._id, name: hotelData.name });
        if (!existingHotel) {
          await Hotel.create({ ...hotelData, destinationId: dest._id });
          newHotelCount++;
        }
      }

      // 4. Check or insert Restaurants
      for (const restData of item.restaurants) {
        const existingRest = await Restaurant.findOne({ destinationId: dest._id, name: restData.name });
        if (!existingRest) {
          await Restaurant.create({ ...restData, destinationId: dest._id });
          newRestCount++;
        }
      }
    }

    console.log('\n--- Seeding Expansion Complete ---');
    console.log(`Newly Added Destinations: ${newDestCount}`);
    console.log(`Newly Added Attractions: ${newAttrCount}`);
    console.log(`Newly Added Hotels: ${newHotelCount}`);
    console.log(`Newly Added Restaurants: ${newRestCount}`);

    const finalDest = await Destination.countDocuments();
    const finalAttr = await Attraction.countDocuments();
    const finalHotel = await Hotel.countDocuments();
    const finalRest = await Restaurant.countDocuments();

    console.log(`\nTotal Database Records Now:`);
    console.log(`Destinations: ${finalDest}`);
    console.log(`Attractions: ${finalAttr}`);
    console.log(`Hotels: ${finalHotel}`);
    console.log(`Restaurants: ${finalRest}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedExpansion();
