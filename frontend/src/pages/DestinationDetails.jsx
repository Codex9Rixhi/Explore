import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import destinationService from '../services/destinationService';
import hotelService from '../services/hotelService';
import restaurantService from '../services/restaurantService';
import itineraryService from '../services/itineraryService';
import ExploreMap from '../components/ExploreMap';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const DestinationDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const plannerInput = location.state?.plannerInput || null;

  const [destination, setDestination] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const destRes = await destinationService.getDestinationById(id);
        if (destRes.success) {
          setDestination(destRes.data.destination);
          setAttractions(destRes.data.attractions);
        }

        const hotRes = await hotelService.getHotels({ destination: id });
        if (hotRes.success) setHotels(hotRes.data);

        const restRes = await restaurantService.getRestaurants({ destination: id });
        if (restRes.success) setRestaurants(restRes.data);
      } catch (err) {
      console.error(err);
      setError('Failed to load destination details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleGenerateItinerary = async () => {
    if (!plannerInput) {
      navigate('/planner');
      return;
    }
    
    setItineraryLoading(true);
    try {
      const payload = {
        destinationId: destination._id,
        days: plannerInput.days,
        budget: plannerInput.budget
      };
      const res = await itineraryService.generateItinerary(payload);
      if (res.success) {
        navigate('/itinerary', { 
          state: { 
            itineraryData: res.data,
            plannerInput 
          } 
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate itinerary');
      setItineraryLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!destination) return <ErrorMessage error="Destination not found" />;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md">
        <div className="h-64 md:h-96 bg-gray-200 relative">
          {destination.image ? (
            <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold text-4xl">
              {destination.name}
            </div>
          )}
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h1 className="text-4xl font-bold text-gray-900">{destination.name}</h1>
            {plannerInput ? (
              <button 
                onClick={handleGenerateItinerary}
                disabled={itineraryLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {itineraryLoading ? 'Generating...' : 'Generate Itinerary Here'}
              </button>
            ) : (
              <Link 
                to="/planner"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors text-center"
              >
                Plan a trip here
              </Link>
            )}
          </div>
          
          <p className="text-lg text-gray-600 mb-6">{destination.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-bold text-gray-700 block text-xs uppercase tracking-wider">Budget Range</span>
              <span className="text-gray-900">₹{destination.budgetRange.min} - ₹{destination.budgetRange.max}</span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-bold text-gray-700 block text-xs uppercase tracking-wider">Recommended</span>
              <span className="text-gray-900">{destination.recommendedDuration} Days</span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-bold text-gray-700 block text-xs uppercase tracking-wider">Interests</span>
              <span className="text-gray-900">{destination.interests.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore on Map</h2>
        <ExploreMap destination={destination} attractions={attractions} />
      </section>

      {/* Attractions */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Top Attractions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map(attr => (
            <div key={attr._id} className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{attr.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{attr.description}</p>
              <div className="flex justify-between items-center text-sm font-medium text-gray-700 border-t pt-4">
                <span>⏱️ {attr.duration || 2} Hours</span>
                <span>💰 ₹{attr.cost || 0}</span>
              </div>
            </div>
          ))}
          {attractions.length === 0 && <p className="text-gray-500">No attractions listed yet.</p>}
        </div>
      </section>

      {/* Hotels */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Where to Stay</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-xl shadow border p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">⭐ {hotel.rating}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
              <div className="font-bold text-blue-600 border-t pt-4">
                ₹{hotel.pricePerNight} / night
              </div>
            </div>
          ))}
          {hotels.length === 0 && <p className="text-gray-500">No hotels listed yet.</p>}
        </div>
      </section>

      {/* Restaurants */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Where to Eat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(rest => (
            <div key={rest._id} className="bg-white rounded-xl shadow border p-6">
               <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{rest.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{rest.priceRange}</span>
              </div>
              <p className="text-gray-500 text-sm italic mb-2">{rest.cuisine} Cuisine</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rest.description}</p>
              <div className="font-bold text-gray-700 border-t pt-4">
                ⭐ {rest.rating}
              </div>
            </div>
          ))}
          {restaurants.length === 0 && <p className="text-gray-500">No restaurants listed yet.</p>}
        </div>
      </section>

    </div>
  );
};

export default DestinationDetails;
