import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api';

export function apiLogin(email, password) {
  return axios.post(`${API_BASE}/auth/login`, { email, password });
}

export function apiGet(path, token) {
  return axios.get(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function apiPost(path, data, token) {
  return axios.post(`${API_BASE}${path}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function apiPut(path, data, token) {
  return axios.put(`${API_BASE}${path}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function apiDelete(path, token) {
  return axios.delete(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}