
import axios from 'axios';

// Prioritize environment variable, fallback to localhost for development
// Note: In Vite, variables must start with VITE_. In Create React App, REACT_APP_.
// We check standard process.env variants to be safe.
const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  process.env.VITE_API_URL || 
  process.env.API_URL || 
  'http://localhost:3000/api';

console.log(`Frontend connecting to API at: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout for faster fallback to demo mode
});

export const getCheapestToday = async () => {
  try {
    const response = await api.get('/products/cheapest-today');
    return response.data;
  } catch (error) {
    // Suppress loud errors for network failures to allow graceful degradation to Demo Mode
    console.warn("API Backend unreachable (getCheapestToday). Switching to local mock data.");
    throw error;
  }
};

export const getMarkets = async () => {
  try {
    const response = await api.get('/markets');
    return response.data;
  } catch (error) {
    console.warn("API Backend unreachable (getMarkets). Using mock markets.");
    throw error;
  }
};

export default api;
