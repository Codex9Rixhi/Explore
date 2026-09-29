
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recommendations from './pages/Recommendations';
import DestinationDetails from './pages/DestinationDetails';
import TripPlanner from './pages/TripPlanner';
import Itinerary from './pages/Itinerary';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import TripDetails from './pages/TripDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="destinations/:id" element={<DestinationDetails />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="planner" element={<TripPlanner />} />
              <Route path="itinerary" element={<Itinerary />} />
              <Route path="trips" element={<MyTrips />} />
              <Route path="trips/:id" element={<TripDetails />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

