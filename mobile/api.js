import axios from 'axios';

// Em desenvolvimento (Android Emulator), use 10.0.2.2. No iOS ou físico, use o IP da sua máquina.
const API_URL = 'http://10.0.2.2:3000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

export default api;