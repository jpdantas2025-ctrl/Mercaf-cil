
import axios from 'axios';
import { Platform } from 'react-native';

// CONFIGURAÇÃO DE IP DO BACKEND
// ---------------------------------------------------------
// 1. Emulador Android: Use 'http://10.0.2.2:3000/api'
// 2. Emulador iOS: Use 'http://localhost:3000/api'
// 3. Dispositivo Físico: Use o IP da sua máquina (ex: 192.168.1.X) ou URL de Produção (Railway/Render)

// Substitua pelo seu IP local para testes em dispositivo físico
const LOCAL_IP_MACHINE = '192.168.1.15'; 
const PRODUCTION_URL = 'https://seu-backend-mercafacil.up.railway.app/api'; // Exemplo

const getBaseUrl = () => {
  // Se quiser forçar produção, descomente abaixo:
  // return PRODUCTION_URL;

  if (Platform.OS === 'android') {
    // Android Emulator loopback
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // iOS Simulator loopback
    return 'http://localhost:3000/api';
  } else {
    // Web or Physical Device fallback
    return `http://${LOCAL_IP_MACHINE}:3000/api`;
  }
};

const API_URL = getBaseUrl();

console.log('Mobile API connecting to:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

export default api;
