import api from './api';

const getDestinations = async (params) => {
  const response = await api.get('/destinations', { params });
  return response.data;
};

const getDestinationById = async (id) => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};

export default {
  getDestinations,
  getDestinationById,
};
