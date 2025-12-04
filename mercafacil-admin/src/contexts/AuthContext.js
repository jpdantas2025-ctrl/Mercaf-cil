import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mercafacil_admin_token');
    const storedUser = localStorage.getItem('mercafacil_admin_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Basic role check (frontend only, real check is on backend)
      if (user.role !== 'admin' && user.role !== 'manager') {
          // For MVP allow login, but in prod check role
          // return { success: false, error: 'Acesso não autorizado' };
      }

      localStorage.setItem('mercafacil_admin_token', token);
      localStorage.setItem('mercafacil_admin_user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Erro ao conectar' };
    }
  };

  const logout = () => {
    localStorage.removeItem('mercafacil_admin_token');
    localStorage.removeItem('mercafacil_admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};