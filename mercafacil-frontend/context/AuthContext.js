import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null, loading: true });

  useEffect(() => {
    AsyncStorage.getItem('mercafacil-auth')
      .then(json => {
        if (json) setAuth(JSON.parse(json));
      })
      .catch(err => console.log('Auth storage error:', err))
      .finally(() => setAuth(a => ({ ...a, loading: false })));
  }, []);

  const signIn = async (token, user) => {
    const newAuth = { token, user };
    setAuth(newAuth);
    await AsyncStorage.setItem('mercafacil-auth', JSON.stringify(newAuth));
  };

  const signOut = async () => {
    setAuth({ token: null, user: null });
    await AsyncStorage.removeItem('mercafacil-auth');
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}