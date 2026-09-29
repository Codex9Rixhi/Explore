import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tripService from '../services/tripService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    try {
      const res = await tripService.getTrips();
      if (res.success) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const res = await tripService.deleteTrip(id);
        if (res.success) {
          fetchTrips();
        }
      } catch (err) {
      console.error(err);
      alert('Failed to delete trip.');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
        <Link to="/planner" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Plan a New Trip
        </Link>
      </div>

      <ErrorMessage error={error} />

      {trips.length === 0 && !error ? (
        <div className="bg-white p-12 rounded-xl shadow border text-center">
          <h3 className="text-xl font-bold mb-4 text-gray-800">You haven't saved any trips yet.</h3>
          <p className="text-gray-600 mb-6">Start exploring destinations and build your perfect itinerary.</p>
          <Link to="/planner" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Start Planning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <div key={trip._id} className="bg-white rounded-xl shadow-md border overflow-hidden flex flex-col">
              <div className="bg-blue-50 p-4 border-b">
                <h3 className="text-xl font-bold text-blue-900">
                  {trip.destinationId?.name || 'Destination'} Trip
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Saved on {new Date(trip.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-bold">{trip.days} Days</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-bold">₹{trip.budget}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-gray-600">Est. Cost:</span>
                  <span className={`font-bold ${trip.totalCost > trip.budget ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{trip.totalCost}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Interests: {trip.interests?.join(', ') || 'None'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 flex justify-between gap-4 border-t">
                <button 
                  onClick={() => handleDelete(trip._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                >
                  Delete
                </button>
                <Link 
                  to={`/trips/${trip._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                >
                  View Itinerary
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
