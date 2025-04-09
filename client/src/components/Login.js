import React, { useState } from 'react';
import api from '../api';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Box,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography
} from '@mui/material';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

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
          window.location.href = '/auctions';
        } else {
          setError('Invalid response from server');
        }
      } else {
        setError('Login failed - no token received');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      console.log(err.response?.data?.message);
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
            color="white"
            sx={{
              fontWeight: 700,
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
          />
          <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Corrected here to update password
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
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
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;