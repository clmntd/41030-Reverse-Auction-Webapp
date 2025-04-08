import { useState } from 'react';
import * as React from 'react';
import Switch from '@mui/material/Switch';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

const Dashboard = ({ user }) => {
  user = JSON.parse(localStorage.getItem('user'));

  const getStoredSettings = () => {
    const storedState = localStorage.getItem('dashSettings');
    console.log('Dashboard.js storedState:', storedState);
    return storedState ? JSON.parse(storedState) : { price: true, quality: true };
  };
  const [state, setState] = useState(getStoredSettings);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = {
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
