import api from './api';

const createTrip = async (data) => {
  const response = await api.post('/trips', data);
  return response.data;
};

const getTrips = async () => {
  const response = await api.get('/trips');
  return response.data;
};

const getTripById = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

const updateTrip = async (id, data) => {
  const response = await api.put(`/trips/${id}`, data);
  return response.data;
};

const deleteTrip = async (id) => {
  const response = await api.delete(`/trips/${id}`);
  return response.data;
};

export default {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
