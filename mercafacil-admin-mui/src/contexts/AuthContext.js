import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null, loading: true });

  useEffect(() => {
    const saved = localStorage.getItem('mercafacil-admin-auth');
    if (saved) setAuth(JSON.parse(saved));
    setAuth(a => ({ ...a, loading: false }));
  }, []);

  const signIn = (token, user) => {
    const newData = { token, user, loading: false };
    setAuth(newData);
    localStorage.setItem('mercafacil-admin-auth', JSON.stringify({ token, user }));
  };

  const signOut = () => {
    setAuth({ token: null, user: null, loading: false });
    localStorage.removeItem('mercafacil-admin-auth');
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}