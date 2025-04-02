import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log(response.data); // Debugging: Ensure token is received
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
    }
  };

export default api;
