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

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    console.log('Register.js handleSubmit hit');
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role: 'supplier',
      });
      if (response && response.data) {
        setSuccess(response.data.message);
        setError('');
        console.log('Registration successful:', response.data);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.log('Register.js catch error: ',error.response.data.message);
      setSuccess('');
      setError(error.response?.data?.message || 'Something went wrong');
      console.error('Error registering:', error.response.data.message);
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
          Register
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
        {success && (
          <Typography
            variant="body2"
            color="success"
            sx={{
              mb: 2,
              py: 1,
              px: 2,
              backgroundColor: 'success.light',
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            {success}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%' }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Register
            </Button>
          </Box>
        </Box>
      </Paper>

    </Container>
  );
};

export default Register;
