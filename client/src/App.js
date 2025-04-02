// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Auctions from './components/Auctions';
import Dashboard from './components/Dashboard';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Ensure token is set on initial load
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
            <button onClick={logout}>Logout</button>
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
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
