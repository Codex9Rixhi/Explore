import api from './api';

const generateItinerary = async (data) => {
  const response = await api.post('/itinerary', data);
  return response.data;
};

export default {
  generateItinerary,
};
