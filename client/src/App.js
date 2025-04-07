import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Auctions from './components/Auctions';
import Dashboard from './components/Dashboard';
import BidHistory from './components/BidHistory';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const role = JSON.parse(localStorage.getItem('role'));
  useEffect(() => {
    //Ensure token is set on initial load
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);



  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <Router>
      <div>
        <nav>
          {authToken ? (
            <>
              {role === 'facilitator' ? (
                <>
                  <button onClick={logout}>Logout</button>
                  <a href="/register">Register</a>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/auctions">Auctions</a>
                  <a href='/history'>Bidding History</a>
                </>
              ) : (
                <>
                  <button onClick={logout}>Logout</button>
                  <a href="/auctions">Auctions</a>
                  <a href='/history'>Bidding History</a>
                </>
              )
              }
            </>

          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={authToken ? <Navigate to="/auctions" /> : <Login setAuthToken={setAuthToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auctions" element={authToken ? <Auctions /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={authToken ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/history" element={authToken ? <BidHistory /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
