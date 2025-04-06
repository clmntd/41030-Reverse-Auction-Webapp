import React, { useState, useEffect } from 'react';
import api from '../api';

const BidHistory = () => {
  const [bids, setBids] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    // Fetch bids if user is available
    const fetchBids = async () => {
      if (!user) return;  // Don't try to fetch if no user is available

      try {
        const response = await api.get(`/auctions/${user.id}`);
        console.log('dsfsdsdfsd', user.id);
        console.log(response.data.auctions);
        setBids(response.data.auctions);
      } catch (err) {
        console.error('Error fetching bids:', err);
      }
    };

    fetchBids();
  }, [user]);  // Re-run if `user` changes

  if (!user) {
    return <h2>Loading...</h2>;  // Show loading until user is set
  }

  return (
    <div>
      <h2>{user ? `${user.name}'s Dashboard` : 'Loading...'}</h2>
      {bids.length > 0 ? (
        bids.map((bid) => (
          <div key={bid.id}>
            <h2>Auction ID: {bid.auction_id}</h2>
            <p>Bidding #: {bid.bid_id}</p>
            <p>Owner of Bid: {bid.name}</p>
            <p>Bidding Price: {bid.price}</p>
          </div>
        ))
      ) : (
        <p>No bids found.</p>
      )}
    </div>
  );
};

export default BidHistory;
