import api from './api';

const getRecommendations = async (data) => {
  const response = await api.post('/recommendations', data);
  return response.data;
};

export default {
  getRecommendations,
};
