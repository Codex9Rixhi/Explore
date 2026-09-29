import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import destinationService from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationService.getDestinations({});
        if (res.success) {
          setDestinations(res.data.slice(0, 6)); // Featured top 6
        }
      } catch (err) {
      console.error(err);
      setError('Failed to load featured destinations.');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 md:p-16 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Plan your next adventure with Explore</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Discover incredible destinations tailored to your budget, trip duration, and personal interests.
        </p>
        <Link
          to={isAuthenticated ? "/planner" : "/login"}
          className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow"
        >
          Plan My Trip
        </Link>
      </section>

      {/* How It Works */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Tell us your preferences</h3>
            <p className="text-gray-600">Enter your budget, available days, and what you love doing.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Discover destinations</h3>
            <p className="text-gray-600">Our engine finds the best matching destinations for you.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Generate your itinerary</h3>
            <p className="text-gray-600">Get a day-by-day deterministic schedule within your budget.</p>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Destinations</h2>
        <ErrorMessage error={error} />
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map(dest => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-100 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to start planning?</h2>
        <Link
          to={isAuthenticated ? "/planner" : "/register"}
          className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
