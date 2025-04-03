import React, { useState } from 'react';
import api from '../api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); //Store JWT token
      //Fix and make setUser
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', JSON.stringify(response.data.role));
      //setUser(response.data); //Set user data
      //setuser sets role of the 
      //Redirect or navigate to the dashboard
      window.location.href = '/dashboard';

    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
