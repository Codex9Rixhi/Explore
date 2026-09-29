import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recommendationService from '../services/recommendationService';
import ErrorMessage from '../components/ErrorMessage';

const TripPlanner = () => {
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // These could be fetched dynamically, but hardcoding the seeded ones for now as per instructions
  const availableInterests = [
    'nature', 'adventure', 'culture', 'heritage', 'beach', 
    'relaxation', 'spirituality', 'wildlife', 'food', 'shopping'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (budget <= 0) return setError('Budget must be greater than 0');
    if (days <= 0) return setError('Trip duration must be greater than 0');
    if (selectedInterests.length === 0) return setError('Select at least one interest');

    setLoading(true);
    try {
      const payload = {
        budget: Number(budget),
        days: Number(days),
        interests: selectedInterests
      };
      
      const res = await recommendationService.getRecommendations(payload);
      if (res.success) {
        // Pass recommendations via state to avoid re-fetching
        navigate('/recommendations', { 
          state: { 
            recommendations: res.data, 
            plannerInput: payload 
          } 
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8 border">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Plan Your Trip</h1>
        <p className="text-gray-600 mb-8 text-center">Tell us what you're looking for, and we'll find the perfect destination.</p>
        
        <ErrorMessage error={error} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="budget">
                Budget (₹)
              </label>
              <input
                id="budget"
                type="number"
                min="1"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 15000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="days">
                Trip Duration (Days)
              </label>
              <input
                id="days"
                type="number"
                min="1"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 5"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-3">
              Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedInterests.includes(interest)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Finding Destinations...' : 'Find Destinations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripPlanner;
