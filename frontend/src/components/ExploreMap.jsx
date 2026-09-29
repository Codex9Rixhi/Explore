
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to smoothly update map center when destination changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.5 });
  }, [center, map]);
  return null;
};

const ExploreMap = ({ destination, attractions = [] }) => {
  // Graceful fallback for missing destination coordinates
  if (!destination || typeof destination.latitude !== 'number' || typeof destination.longitude !== 'number') {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500 w-full h-[400px] flex items-center justify-center border">
        Map location is currently unavailable.
      </div>
    );
  }

  // Validate coordinates
  const isValidLat = (lat) => typeof lat === 'number' && lat >= -90 && lat <= 90;
  const isValidLng = (lng) => typeof lng === 'number' && lng >= -180 && lng <= 180;

  if (!isValidLat(destination.latitude) || !isValidLng(destination.longitude)) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500 w-full h-[400px] flex items-center justify-center border">
        Map location is currently unavailable.
      </div>
    );
  }

  const destinationPosition = [destination.latitude, destination.longitude];

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md border z-0 relative">
      <MapContainer 
        center={destinationPosition} 
        zoom={11} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={destinationPosition} />
        
        {/* Destination Marker */}
        <Marker position={destinationPosition}>
          <Popup>
            <div className="text-center">
              <strong className="block text-lg mb-1">{destination.name}</strong>
              {destination.state && <span className="text-gray-600 text-sm block">{destination.state}, {destination.country}</span>}
            </div>
          </Popup>
        </Marker>

        {/* Attraction Markers */}
        {attractions.map((attr) => {
          if (isValidLat(attr.latitude) && isValidLng(attr.longitude)) {
            return (
              <Marker key={attr._id || attr.name} position={[attr.latitude, attr.longitude]}>
                <Popup>
                  <div>
                    <strong className="block mb-1 text-blue-700">{attr.name}</strong>
                    {attr.category && <div className="text-xs text-gray-500 mb-1 capitalize">{attr.category}</div>}
                    {typeof attr.cost === 'number' && <div className="text-xs font-bold text-gray-700">{attr.cost > 0 ? `Cost: ₹${attr.cost}` : 'Free'}</div>}
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default ExploreMap;
