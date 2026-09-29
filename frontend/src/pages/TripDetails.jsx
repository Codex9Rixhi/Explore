import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import tripService from '../services/tripService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await tripService.getTripById(id);
        if (res.success) {
          setTrip(res.data);
        }
      } catch (err) {
      console.error(err);
      setError('Failed to load trip details. It may not exist or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!trip) return <ErrorMessage error="Trip not found." />;

  // The 'withinBudget' logic was computed during generation, but we can reconstruct it or simply show total cost.
  const isWithinBudget = trip.totalCost <= trip.budget;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/trips" className="text-blue-600 hover:underline font-medium">&larr; Back to My Trips</Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border overflow-hidden mb-8">
        <div className="bg-blue-800 p-6 md:p-8 text-white relative">
          <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded text-sm backdrop-blur">
            Saved Trip
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Trip to {trip.destinationId?.name || 'Destination'}</h1>
          <p className="text-blue-100 text-lg">{trip.days} Days • Budget: ₹{trip.budget}</p>
        </div>
        
        <div className="p-6 md:p-8 bg-gray-50 border-b flex flex-col justify-center items-center text-center">
          <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Total Estimated Cost</div>
          <div className="text-3xl font-extrabold text-gray-900">₹{trip.totalCost}</div>
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-bold ${isWithinBudget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isWithinBudget ? '✓ Within Budget' : '⚠️ Over Budget'}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {trip.itinerary?.map((dayPlan) => (
            <div key={dayPlan._id || dayPlan.day} className="relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-white/90 backdrop-blur py-2 z-10 border-b">
                Day {dayPlan.day}
              </h2>
              
              <div className="space-y-4 pl-4 border-l-2 border-gray-200 ml-2">
                {dayPlan.activities?.map((activity, idx) => (
                  <div key={activity._id || idx} className="relative pl-6">
                    <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center ${activity.type === 'meal' ? 'bg-orange-400' : 'bg-blue-500'}`}>
                      {activity.type === 'meal' ? '🍽️' : '📍'}
                    </div>
                    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow transition-shadow">
                      <div className="text-sm font-bold text-blue-600 mb-1">{activity.time}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {activity.type === 'meal' ? activity.title : activity.attraction?.name || 'Activity'}
                      </h3>
                      {activity.type !== 'meal' && activity.attraction?.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.attraction.description}</p>
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

export default TripDetails;
