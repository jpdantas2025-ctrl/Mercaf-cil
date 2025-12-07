import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper abstrato para storage que funciona na Web e no Mobile
  const storage = {
    getItem: async (key) => {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    },
    setItem: async (key, value) => {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    },
    deleteItem: async (key) => {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    }
  };

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const token = await storage.getItem('token');
        const userData = await storage.getItem('user');
        if (token && userData) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorage();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(loggedUser));
      
      setUser(loggedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Erro no login' };
    }
  };

  const logout = async () => {
    setUser(null);
    await storage.deleteItem('token');
    await storage.deleteItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};