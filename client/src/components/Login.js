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
    <Container 
    maxWidth="sm" 
    sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}
  >
    <Paper 
      sx={{ 
        padding: 4,
        width: '100%',
        maxWidth: 400,
        boxShadow: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3,
          fontWeight: 500,
          textAlign: 'center',
          color: 'text.primary'
        }}
      >
        Welcome Back
      </Typography>
      
      {error && (
        <Typography 
          variant="body2" 
          color="error"
          sx={{ 
            mb: 2,
            py: 1,
            px: 2,
            backgroundColor: 'error.light',
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          {error}
        </Typography>
      )}

      <Box 
        component="form" 
        onSubmit={handleLogin} 
        sx={{ width: '100%' }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              borderRadius: 1,
              '&:hover fieldset': { borderColor: 'primary.light' }
            }
          }}
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
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              borderRadius: 1,
              '&:hover fieldset': { borderColor: 'primary.light' }
            }
          }}
        />
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 2
              }
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Paper>
  </Container>
);
};

export default Login;