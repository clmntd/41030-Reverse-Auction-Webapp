import React, { useState } from 'react';
import api from '../api';

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
    <form onSubmit={handleLogin}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
