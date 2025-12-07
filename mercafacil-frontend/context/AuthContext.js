
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null, loading: true });

  useEffect(() => {
    const load = async () => {
        try {
            const json = await AsyncStorage.getItem('mercafacil-auth');
            if (json) setAuth(JSON.parse(json));
        } catch (e) {
            console.log('Auth storage load error');
        } finally {
            setAuth(a => ({ ...a, loading: false }));
        }
    };
    load();
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
