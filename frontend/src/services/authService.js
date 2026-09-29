import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; // { success: true, data: { user, token } }
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default {
  register,
  login,
  getMe,
};
