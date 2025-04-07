import { useState, useEffect } from 'react';
import * as React from 'react';
import api from '../api';
import Switch from '@mui/material/Switch';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);

  const getStoredSettings = () => {
    const storedState = localStorage.getItem('dashSettings');
    // console.log(storedState);
    return storedState ? JSON.parse(storedState) : { price: true, quality: true };
  };
  const [state, setState] = useState(getStoredSettings);

  user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transactions/id/${user.id}`);
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    if (user) {
      fetchTransactions();
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState={
      ...state,
      [event.target.name]: event.target.checked,
    };
    setState(newState);
    localStorage.setItem('dashSettings', JSON.stringify(newState));
    socket.emit('dash', newState);
  };

  return (
    <div>
      <h2>{user ? `${user.name}'s Dashboard` : 'Loading...'}</h2>
      <Switch checked={state.price} onChange={handleChange} name="price" />
      Price Transparency
      <Switch checked={state.quality} onChange={handleChange} name="quality" />
      Quality Transparency
    </div>
  );
};

export default Dashboard;
