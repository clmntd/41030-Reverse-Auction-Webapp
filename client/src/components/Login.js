import React, { useState } from 'react';
import api from '../api';
import { Button, TextField, Box, Typography, Container, Paper } from '@mui/material';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('role', JSON.stringify(response.data.user.role));
          window.location.href = '/dashboard';
        } else {
          setError('Invalid response from server');
        }
      } else {
        setError('Login failed - no token received');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ padding: 4 }}>
      <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>
        
        {/* Error Message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Box sx={{ marginTop: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
