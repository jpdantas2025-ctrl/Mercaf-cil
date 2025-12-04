import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { apiLogin } from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiLogin(email, password);
      const { token, user } = response.data;
      signIn(token, user);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas ou erro no servidor');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" color="primary" gutterBottom>
            Mercafácil Admin
          </Typography>
          
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal" required fullWidth label="Email" autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal" required fullWidth label="Senha" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Entrar
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}