import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import ProductsPage from './pages/ProductsPage';
import DriversPage from './pages/DriversPage';
import PayoutsPage from './pages/PayoutsPage';

// Componente para proteger rotas
function PrivateRoute({ children }) {
  const { auth } = useContext(AuthContext);
  if (auth.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return auth.token ? children : <Navigate to="/login" />;
}

// Home simples
const Overview = () => (
  <Box p={3}>
    <h2>Bem-vindo ao Mercafácil Admin</h2>
    <p>Selecione uma opção no menu lateral para gerenciar a plataforma.</p>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>}>
               <Route index element={<Overview />} />
               <Route path="markets" element={<MarketsPage />} />
               <Route path="products" element={<ProductsPage />} />
               <Route path="drivers" element={<DriversPage />} />
               <Route path="payouts" element={<PayoutsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;