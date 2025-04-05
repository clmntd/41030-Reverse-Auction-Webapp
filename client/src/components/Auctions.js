import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../api';

const socket = io('http://localhost:5000'); // Server URL
socket.on('connect', () => {
  console.log('Connected to the server!');

  // Send a message to the server
  socket.emit('message', 'Hello, Server!');
});



const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState(3);
  const [auctionBids, setAuctionBids] = useState({}); // Object to hold bids per auction
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = JSON.parse(localStorage.getItem('role'));
  useEffect(() => {
    console.log('useeffect');

    const fetchAuctions = async () => {
      try {
        const response = await api.get('/auctions');
        console.log(response.data.auctions);
        setAuctions(response.data.auctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
      }
    };

    fetchAuctions();

    //Listen for real-time bid updates and update the respective auction's bids

    console.log('setting socket.on:newbid');

    socket.on('newBid', (bidData) => {
      console.log('SOCKETBID CALL NOW');

      console.log(bidData);

      setAuctionBids((prevBids) => {
        //Update bids for the specific auction

        console.log('setauctionbidcaALLLALLAL');
        console.log(prevBids);
        const updatedBids = { ...prevBids };
        if (!updatedBids[bidData.auctionId]) {
          updatedBids[bidData.auctionId] = [];
        }
        updatedBids[bidData.auctionId].push(bidData);
        return updatedBids;
      });

      console.log('asdasdas', auctionBids);
    });

    return () => {
      socket.off('newBid');
    };
  }, []);

  const placeBid = async (auctionId) => {

    console.log(role);

    if (role === 'supplier') {
      const supplierId = user.id;
      console.log('supplierID from Auctions.js: ', supplierId);
      const bidData = { auctionId, price, quality, supplierId };

      if (quality > 5) {
        console.error('Error placing bid over 5 quality');
        return;
      }

      try {
        await api.post('/bids/place', bidData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        //Emit the bid data to the server for real-time updates
        socket.emit('placeBid', bidData);
      } catch (err) {
        console.error('Error placing bid:', err);
      }
    } else {
      console.error('Error placing bid');
    }
  };

  return (
    <div>
      <h2>Active Auctions</h2>
      {auctions.map((auction) => (
        <div key={auction.id}>
          <h3>Auction {auction.id}</h3>
          {role === 'facilitator' ? (
                  <></>
                ) : (
                  <>
                    <button onClick={() => placeBid(auction.id)}>Place Bid</button>
                  </>
                )
                }

          {/* Display current bids for each auction */}
          <h4>Current Bids</h4>
          <ul>
            {auctionBids[auction.id]?.map((bid, index) => (
              <li key={index}>
                {role === 'facilitator' ? (
                  <button>
                    Price: {bid.price}, Quality: {bid.quality}, Id: {bid.supplierId}
                  </button>
                ) : (
                  <>
                    Price: {bid.price}, Quality: {bid.quality}, Id: {bid.supplierId}
                  </>
                )
                }
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
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
      </div>
    </div>
  );
};

export default Auctions;
