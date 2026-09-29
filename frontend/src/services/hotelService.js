import api from './api';

const getHotels = async (params) => {
  const response = await api.get('/hotels', { params });
  return response.data;
};

const getHotelById = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};

export default {
  getHotels,
  getHotelById,
};
