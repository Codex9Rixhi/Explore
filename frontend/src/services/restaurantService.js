import api from './api';

const getRestaurants = async (params) => {
  const response = await api.get('/restaurants', { params });
  return response.data;
};

const getRestaurantById = async (id) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

export default {
  getRestaurants,
  getRestaurantById,
};
