import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography
} from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = ({ user }) => {
  user = JSON.parse(localStorage.getItem('user'));

  const getStoredSettings = () => {
    const storedState = localStorage.getItem('dashSettings');
    return storedState ? JSON.parse(storedState) : { price: true, quality: true, number: true, name: true };
  };
  const [state, setState] = useState(getStoredSettings);

  useEffect(() => {
    if (user) {
      socket.emit('dash', state);
    }
  }, [user, state]);

  const handleChange = (event) => {
    const newState = {
      ...state,
      [event.target.name]: event.target.checked,
    };
    setState(newState);
    localStorage.setItem('dashSettings', JSON.stringify(newState));
    socket.emit('dash', newState);
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 500,
            color: 'text.primary'
          }}
        >
          {user.name}'s Dashboard
        </Typography>

        <List sx={{ width: '100%' }}>
          <ListItem sx={{ px: 0, mt: 1 }}>
            <ListItemText
              primary="Bid Number Transparency"
              secondary="Display bid number to suppliers" />
            <Switch
              checked={state.number}
              onChange={handleChange}
              name="number"
              color="primary"
            />
          </ListItem>

          <Divider />

          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Price Transparency"
              secondary="Display price information to suppliers" />
            <Switch
              checked={state.price}
              onChange={handleChange}
              name="price"
              color="primary"
            />
          </ListItem>

          <Divider />

          <ListItem sx={{ px: 0, mt: 1 }}>
            <ListItemText
              primary="Quality Transparency"
              secondary="Display quality ratings to suppliers" />
            <Switch
              checked={state.quality}
              onChange={handleChange}
              name="quality"
              color="primary"
            />
          </ListItem>

          <Divider />

          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Name Transparency"
              secondary="Display the name on a placed bid to suppliers" />
            <Switch
              checked={state.name}
              onChange={handleChange}
              name="name"
              color="primary"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Dashboard;