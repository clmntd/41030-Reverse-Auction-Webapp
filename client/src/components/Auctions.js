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
  const [winningBids, setWinningBids] = useState([]);
  const [auctionBids, setAuctionBids] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = JSON.parse(localStorage.getItem('role'));
  useEffect(() => {
    console.log('useeffect');

    const fetchAuctions = async () => {
      try {
        const response = await api.get('/auctions');
        const response2 = await api.get('/transactions');
        console.log('winning!!!', response2.data);
        setWinningBids(response2.data);
        console.log('WINNINNG', winningBids);
        console.log(response.data.auctions);
        setAuctions(response.data.auctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
      }
    };

    fetchAuctions();

    socket.on('newBid', (bidData) => {
      console.log('SOCKETBID CALL NOW');

      console.log(bidData);

      setAuctionBids((prevBids) => {
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
  }, [auctionBids]);

  const placeBid = async (auctionId) => {
    console.log(role);
    if (role === 'supplier') {
      const supplierId = user.id;
      const bidData = { auctionId, price, quality, supplierId };

      console.log('supplierID from Auctions.js: ', supplierId);
      if (quality > 5) {
        console.error('Error placing bid over 5 quality');
        return;
      }

      try {
        const result = await api.post('/bids/place', bidData, {
          headers: { Authorization: `Bearer ${token}` },

        });
        console.log(result);
        bidData.id = result.data.bidId;
        console.log(bidData.id + 'biddata id');
        //Emit the bid data to the server for real-time updates
        socket.emit('placeBid', bidData);
      } catch (err) {
        console.error('Error placing bid:', err);
      }
    } else {
      console.error('Error placing bid');
    }
  };

  const winningBid = async (bidId) => {
    console.log('bigid:' + bidId);
    try {
      const response = await api.post('/transactions', { bidId });
    } catch (err) {
      console.error('Error winning bid');
    }

  }

  const whoWins = (auctionId) => {
    const winningBid = winningBids.find(bid => bid.auction_id === auctionId);

    if (winningBid) {
      return winningBid.name;
    } else {
      return null;
    }
  }


  return (
    <div>
      <h2>Active Auctions</h2>
      {auctions.map((auction) => (
        <div key={auction.id}>
          <h3>Auction {auction.id}</h3>
          {winningBids.some(x => x.auction_id === auction.id) ? (
            <>
              Winning Bid by {whoWins(auction.id)}
            </>
          ) : (
            <>
              <h4>Current Bids</h4>
              {role === 'facilitator' ? (
                <></>
              ) : (
                <>
                  <button onClick={() => placeBid(auction.id)}>Bid</button>
                </>
              )
              }
            </>
          )
          }



          {/* Display current bids for each auction */}

          <ul>
            {auctionBids[auction.id]?.map((bid, index) => (
              <li key={index}>
                {role === 'facilitator' ? (
                  <button onClick={() => winningBid(bid.id)}>
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
        {role === 'facilitator' ? (
          <></>
        ) : (
          <>
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
          </>
        )
        }
      </div>
    </div>
  );
};

export default Auctions;
