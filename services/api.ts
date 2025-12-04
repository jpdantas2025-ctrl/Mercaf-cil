
import axios from 'axios';

// Ensure this matches your backend port
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000, // Fail fast (2s) if backend is not running to switch to mocks
});

export const getCheapestToday = async () => {
  const response = await api.get('/products/cheapest-today');
  return response.data;
};

export const getMarkets = async () => {
    const response = await api.get('/markets');
    return response.data;
};

export default api;
