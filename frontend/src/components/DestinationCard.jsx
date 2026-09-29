
import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        {destination.image ? (
          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold text-xl">
            {destination.name}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.interests?.slice(0, 3).map((interest, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
              {interest}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>₹{destination.budgetRange?.min} - ₹{destination.budgetRange?.max}</span>
          <span>{destination.recommendedDuration} Days</span>
        </div>
        
        <Link 
          to={`/destinations/${destination._id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
        >
          View Destination
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
