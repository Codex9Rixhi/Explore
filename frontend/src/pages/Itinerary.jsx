import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import tripService from '../services/tripService';
import ErrorMessage from '../components/ErrorMessage';

const Itinerary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const itineraryData = location.state?.itineraryData || null;
  const plannerInput = location.state?.plannerInput || null;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!itineraryData) {
      navigate('/planner');
    }
  }, [itineraryData, navigate]);

  if (!itineraryData) return null;

  const handleSaveTrip = async () => {
    setSaving(true);
    setError('');
    
    try {
      const payload = {
        destinationId: itineraryData.destination._id,
        days: itineraryData.days,
        budget: itineraryData.budget,
        totalCost: itineraryData.totalEstimatedCost,
        totalEstimatedCost: itineraryData.totalEstimatedCost,
        interests: plannerInput?.interests || [],
        itinerary: itineraryData.itinerary
      };
      
      const res = await tripService.createTrip(payload);
      if (res.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md border overflow-hidden mb-8">
        <div className="bg-blue-600 p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Itinerary for {itineraryData.destination.name}</h1>
          <p className="text-blue-100 text-lg">{itineraryData.days} Days • Budget: ₹{itineraryData.budget}</p>
        </div>
        
        <div className="p-6 md:p-8 bg-gray-50 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Total Estimated Cost</div>
            <div className="text-3xl font-extrabold text-gray-900">₹{itineraryData.totalEstimatedCost}</div>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-bold ${itineraryData.withinBudget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {itineraryData.withinBudget ? '✓ Within Budget' : '⚠️ Over Budget'}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            {success ? (
              <>
                <div className="bg-green-100 text-green-800 text-center py-2 rounded-md font-medium">Trip Saved!</div>
                <Link to="/trips" className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-6 rounded-md shadow transition-colors">
                  View My Trips
                </Link>
              </>
            ) : (
              <button 
                onClick={handleSaveTrip}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Trip'}
              </button>
            )}
            <ErrorMessage error={error} />
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {itineraryData.itinerary.map((dayPlan) => (
            <div key={dayPlan.day} className="relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-white/90 backdrop-blur py-2 z-10 border-b">
                Day {dayPlan.day}
                <span className="text-sm font-normal text-gray-500 ml-4">Daily Cost: ₹{dayPlan.estimatedCost}</span>
              </h2>
              
              <div className="space-y-4 pl-4 border-l-2 border-gray-200 ml-2">
                {dayPlan.activities.map((activity, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center ${activity.type === 'meal' ? 'bg-orange-400' : 'bg-blue-500'}`}>
                      {activity.type === 'meal' ? '🍽️' : '📍'}
                    </div>
                    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow transition-shadow">
                      <div className="text-sm font-bold text-blue-600 mb-1">{activity.time}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {activity.type === 'meal' ? (activity.title || 'Lunch Break') : (activity.attraction?.name || activity.place || activity.name)}
                      </h3>
                      {activity.type !== 'meal' && (activity.attraction?.description || activity.description) && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.attraction?.description || activity.description}</p>
                      )}
                      <div className="text-sm font-medium text-gray-700">
                        {activity.estimatedCost > 0 ? `Cost: ₹${activity.estimatedCost}` : 'Cost: Free'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
