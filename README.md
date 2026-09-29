# Explore — Tourism Recommendation & Trip Planning Platform

## 1. Project Overview

Explore is a MERN-stack tourism platform that helps users:
- explore destinations
- enter travel preferences
- receive ranked destination recommendations
- view attractions, hotels and restaurants
- view destinations on an interactive OpenStreetMap map
- generate deterministic day-by-day itineraries
- save trips
- manage saved trips

*Note: The recommendation engine relies on deterministic/rule-based algorithms and does not use AI or ML models.*

---

## 2. Key Features

### Authentication
- Register and Login
- JWT authentication
- bcrypt password hashing
- Protected routes (unauthorized users are safely redirected)
- Admin-protected destination management middleware

### Destination Discovery
- Destination listing (with comprehensive seeded data)
- Destination details including recommended duration and budget bounds
- Attractions
- Hotels
- Restaurants

### Recommendation System
Recommendations are strictly deterministic and rule-based. It generates scores without relying on external ML APIs. 
The underlying formula evaluates as follows:
`totalScore = (interestScore × 0.60) + (budgetScore × 0.30) + (durationScore × 0.10)`

- **interestScore**: Calculates percentage overlap between user-selected interests and destination interests.
- **budgetScore**: Calculates if the user's budget satisfies the destination's budget range.
- **durationScore**: Checks whether the trip duration falls inside the destination's recommended window.

### Itinerary Generator
- Deterministic/rule-based generation
- Strict 09:00–18:00 daily schedule
- 3–4 stops/day dynamically calculated based on attraction duration
- Dedicated lunch placeholder dynamically inserted at 13:00–14:00
- Tracks attraction costs independently 
- Computes estimated total cost
- Informs the user on budget status (Within Budget / Over Budget)

### Interactive Map
- Built purely with Leaflet, React Leaflet, and OpenStreetMap
- Destination markers natively anchored
- Attraction markers map with corresponding popup details
- Responsive map sizes cleanly embedded into the UI
- Requires absolutely no API key

### Trip Management
- Save auto-generated trip itineraries
- List individual trips
- View specific trip detailed breakdowns
- Delete trips securely
- Strictly enforces user ownership protection natively through the backend

---

## 3. Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React, Vite, React Router, Axios, Tailwind CSS, Context API, Leaflet, React Leaflet |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, express-validator |
| **Development Tools** | Nodemon, ESLint, Prettier |

---

## 4. System Architecture

**Backend Architecture Flow:**
`Routes` → `Controllers` → `Services` → `Models` → `MongoDB`

**Frontend Architecture Flow:**
`Pages` → `Service Layer` → `Axios` → `REST API` → `Express Backend`

Authentication bridges the gap statelessly using standard JWT workflows intercepting natively in Axios configurations.

---

## 5. Project Structure

```text
Explore FSD/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 6. Database Models

The architecture is driven by six core Mongoose models:
- **User**: Stores authenticated users (`name`, `email`, `password`, `role`).
- **Destination**: Stores destination metadata (`name`, `description`, `budgetRange`, `interests`, `latitude`, `longitude`).
- **Attraction**: Tied to `Destination`, stores location-specific sightseeing points alongside `duration` and `cost`.
- **Hotel**: Tied to `Destination`, stores lodging bounds (`pricePerNight`, `rating`).
- **Restaurant**: Tied to `Destination`, stores eateries (`cuisine`, `priceRange`).
- **Trip**: Binds a generated Itinerary to a specific User and Destination, enforcing ownership and tracking timeline records (`startDate`, `endDate`, `totalCost`, `itinerary`).

---

## 7. API Documentation

### Authentication
- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/auth/me`: Validate existing token (Requires Auth).

### Destinations
- `GET /api/destinations`: List available destinations.
- `GET /api/destinations/:id`: Retrieve details, attractions, hotels, and restaurants.
- `POST /api/destinations`: Admin endpoint to create destinations (Requires Admin).
- `PUT /api/destinations/:id`: Admin endpoint to modify destinations (Requires Admin).
- `DELETE /api/destinations/:id`: Admin endpoint to cascade delete destinations (Requires Admin).

### Recommendations
- `POST /api/recommendations`: Send budget, days, and interests to receive a scored, sorted array of locations (Requires Auth).

### Hotels
- `GET /api/hotels`: List hotels filtered optionally by destination.
- `GET /api/hotels/:id`: Retrieve specific hotel details.

### Restaurants
- `GET /api/restaurants`: List restaurants filtered optionally by destination.
- `GET /api/restaurants/:id`: Retrieve specific restaurant details.

### Itinerary
- `POST /api/itinerary`: Generate a deterministic itinerary based on budget and days (Requires Auth).

### Trips
- `POST /api/trips`: Save an itinerary to a user profile (Requires Auth).
- `GET /api/trips`: List all authenticated user's trips (Requires Auth).
- `GET /api/trips/:id`: Retrieve a specific trip (Requires Auth - Checked Ownership).
- `PUT /api/trips/:id`: Modify trip (Requires Auth - Checked Ownership).
- `DELETE /api/trips/:id`: Delete trip (Requires Auth - Checked Ownership).

---

## 8. Response Format

Every endpoint strictly adheres to a generic envelope response:

```json
{
  "success": true,
  "message": "Optional context string",
  "data": {
    "dynamic": "payload based on endpoint"
  }
}
```

---

## 9. Environment Setup

Required environment files (`.env`) must be created from their `.env.example` equivalents.

**`backend/.env.example`**
```env
MONGO_URI=mongodb://127.0.0.1:27017/explore_fsd
PORT=5000
JWT_SECRET=change_this_in_development
```

**`frontend/.env.example`**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 10. Installation

```bash
# Clone the repository
git clone <repository-url>
cd "Explore FSD"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Make sure to populate your `.env` files appropriately based on Section 9.

---

## 11. Running the Project

**Start Backend (Port 5000)**
```bash
cd backend
npm run start
```

**Start Frontend (Port 5173)**
```bash
cd frontend
npm run dev
```

---

## 12. Database Seeding

The backend includes a deterministic seeding script located at `backend/seed/seedData.js`.
It securely wipes pre-existing collections (Destinations, Hotels, Restaurants, Attractions, Trips, Users) and repopulates the DB natively with robust real-world data mappings:

- ~10 Destinations
- ~30+ Attractions
- ~20+ Hotels
- ~30+ Restaurants

**Run the seed script:**
```bash
cd backend
node seed/seedData.js
```

---

## 13. Application Flow

1. Register
2. Login
3. Trip Planner
4. Enter Budget + Duration + Interests
5. Review Ranked Recommendations
6. Click Destination Details
7. Explore Attractions + Hotels + Restaurants + Interactive Map
8. Generate Itinerary
9. Save Trip
10. My Trips Dashboard
11. View specific Trip Details

---

## 14. Security

- Passwords hashed irreversibly via `bcrypt`.
- Authentication managed ephemerally via JSON Web Tokens (`JWT`).
- Routes are protected structurally and via explicitly assigned `admin` privileges.
- API validation intercepted structurally via `express-validator`.
- MongoDB filters inherently execute `{ _id: id, userId: req.user._id }` blockages avoiding unauthorized trip manipulation.
- CORS policies correctly bound.
- Password hashes intentionally excluded from arbitrary JSON responses.

---

## 15. Testing

Phase 12 Testing verified:
- **Authentication**: JWT issues properly, invalid logins reject, protected routes drop unauthenticated traffic correctly.
- **Recommendation**: Inputs reject negatives, scores parse mathematically correct.
- **Destinations / Assets**: Assets merge seamlessly from distinct endpoints natively inside React trees.
- **Map Verification**: React Leaflet cleanly mounts without missing asset bugs; boundaries properly skip empty coordinate mappings.
- **Itinerary**: Day intervals loop safely up to 10 days cleanly distributing nested loops.
- **Ownership**: Simulated User B access blocks User A trips naturally yielding `404 Not Found`.
- **Responsive**: Flex-boxes correctly collapse on ~375px mobile boundaries.
- **Build & Lint**: `npm run build` transpiles without failures. ESLint configurations are effectively structured.

---

## 16. Screenshots

*(Screenshots can be inserted here for presentation purposes. Capture: Home, Login, Trip Planner, Recommendations, Destination Details, Interactive Map, Itinerary, My Trips, Profile.)*

---

## 17. Project Scope

### Included
- tourism discovery
- deterministic recommendations
- itinerary generation
- destination information
- hotels
- restaurants
- OpenStreetMap map
- trip persistence
- authentication

### Out of Scope
- real-time hotel/restaurant booking
- payments
- AI/ML recommendation
- route optimization
- weather integration
- social features
- notifications
- expense tracking
- full admin dashboard
