import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../api';

const socket = io('http://localhost:5000'); //Server URL

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState(3);
  const [currentBids, setCurrentBids] = useState([]);
  // const role = JSON.parse(localStorage.getItem('role'));
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await api.get('/auctions');
        console.log('response');
        setAuctions(response.data.auctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
      }
    };
    fetchAuctions();

    //Listen for real-time bid updates
    socket.on('newBid', (bidData) => {
      setCurrentBids((prevBids) => [...prevBids, bidData]);
    });

    return () => {
      socket.off('newBid');
    };
  }, []);

  const placeBid = async (auctionId) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const role = JSON.parse(localStorage.getItem('role'));
    console.log(role);
    if(role === 'supplier') {
      const supplierId = user.id;
      console.log(supplierId);
      const bidData = { auctionId, price, quality, supplierId};
      
      if(quality >5)
        console.error('Error placing bid over 5 quality');
      try {
        await api.post('/bids/place', bidData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        //Emit the bid data to the server for real-time updates
        socket.emit('placeBid', bidData);
      } catch (err) {
        console.error('Error placing bid:', err);
      }
    }else{
      console.error('Error placing bid2');
    }
  };

  return (
    <div>
      <h2>Active Auctions</h2>
      {auctions.map((auction) => (
        <div key={auction.id}>
          <h3>Auction {auction.id}</h3>
          <button onClick={() => placeBid(auction.id)}>Place Bid</button>
        </div>
      ))}
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />
      <input
        type="number"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        placeholder="Quality"
      />
      <h3>Current Bids</h3>
      <ul>
        {currentBids.map((bid, index) => (
          <li key={index}>
            Auction ID: {bid.auction_id}, Price: {bid.price}, Quality: {bid.quality}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Auctions;
