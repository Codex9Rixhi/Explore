import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const recommendations = location.state?.recommendations || [];
  const plannerInput = location.state?.plannerInput || null;

  useEffect(() => {
    if (!plannerInput) {
      // If users navigate here directly without going through planner
      navigate('/planner');
    }
  }, [plannerInput, navigate]);

  if (!plannerInput) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Your Top Recommendations</h1>
          <p className="text-gray-600 mt-2">
            Based on: ₹{plannerInput.budget} budget, {plannerInput.days} days, and interests ({plannerInput.interests.join(', ')})
          </p>
        </div>
        <Link to="/planner" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Change Preferences
        </Link>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow border text-center">
          <h3 className="text-xl font-bold mb-4">No matching destinations found.</h3>
          <p className="text-gray-600 mb-6">Try adjusting your budget or interests.</p>
          <Link to="/planner" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Back to Planner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((rec, index) => (
            <div key={rec.destination._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col relative border border-gray-100">
              <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                #{index + 1}
              </div>
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                {rec.destination.image ? (
                  <img src={rec.destination.image} alt={rec.destination.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold text-xl">
                    {rec.destination.name}
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{rec.destination.name}</h3>
                
                <div className="mb-4 text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">Match Score:</span>
                    <span className="font-bold text-blue-600">{Math.round(rec.totalScore)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(rec.totalScore)}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-center border-t pt-3 mt-3">
                    <div>
                      <div className="text-gray-400">Interests</div>
                      <div className="font-bold text-gray-700">{Math.round(rec.breakdown.interestScore)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Budget</div>
                      <div className="font-bold text-gray-700">{Math.round(rec.breakdown.budgetScore)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Duration</div>
                      <div className="font-bold text-gray-700">{Math.round(rec.breakdown.durationScore)}%</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <Link 
                    to={`/destinations/${rec.destination._id}`}
                    state={{ plannerInput }}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
                  >
                    View Destination
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
