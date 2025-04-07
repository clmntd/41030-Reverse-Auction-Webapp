import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  CssBaseline, 
  Box, 
  Typography 
} from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import Auctions from './components/Auctions';
import Dashboard from './components/Dashboard';
import BidHistory from './components/BidHistory';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const role = JSON.parse(localStorage.getItem('role'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="static" 
          color="inherit"
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            boxShadow: 'none'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Reverse Auction
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {authToken ? (
                <>
                  {role === 'facilitator' ? (
                    <>
                      <Button href="/dashboard" color="inherit">Dashboard</Button>
                      <Button href="/register" color="inherit">Register</Button>
                      <Button href="/auctions" color="inherit">Auctions</Button>
                      <Button href="/history" color="inherit">History</Button>
                    </>
                  ) : (
                    <>
                      <Button href="/auctions" color="inherit">Auctions</Button>
                      <Button href="/history" color="inherit">History</Button>
                    </>
                  )}
                  <Button 
                    onClick={logout}
                    variant="outlined"
                    sx={{
                      ml: 2,
                      borderRadius: 1,
                      textTransform: 'none',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.light'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button href="/login" color="inherit">Login</Button>
                  <Button href="/register" color="inherit">Register</Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container 
          component="main" 
          maxWidth="xl" 
          sx={{ 
            py: 4,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Routes>
            <Route path="/login" element={authToken ? <Navigate to="/auctions" /> : <Login setAuthToken={setAuthToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auctions" element={authToken ? <Auctions /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={authToken ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/history" element={authToken ? <BidHistory /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;