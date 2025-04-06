import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../api';

const socket = io('http://localhost:5000'); // Server URL
socket.on('connect', () => {
  console.log('Connected to the server!');
  socket.emit('message', 'Hello, Server!');
});

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [auctionValues, setAuctionValues] = useState({}); // Store price and quality for each auction
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
        setWinningBids(response2.data);
  
        setAuctions(response.data.auctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
      }
    };

    fetchAuctions();

    socket.on('newBid', (bidData) => {
      setAuctionBids((prevBids) => {
        const updatedBids = { ...prevBids };
        if (!updatedBids[bidData.auctionId]) {
          updatedBids[bidData.auctionId] = [];
        }
        updatedBids[bidData.auctionId].push(bidData);
        return updatedBids;
      });
    });

    socket.on('winningBid', async () => {
      try {
        const response2 = await api.get('/transactions');
        setWinningBids(response2.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    });


    return () => {
      socket.off('newBid');
    };
  }, [auctionBids]);

  const handleAuctionValuesChange = (auctionId, field, value) => {
    setAuctionValues((prevValues) => ({
      ...prevValues,
      [auctionId]: {
        ...prevValues[auctionId],
        [field]: value,
      },
    }));
  };

  const placeBid = async (auctionId) => {
    if (role === 'supplier') {
      const supplierId = user.id;
      const bidData = {
        auctionId,
        price: auctionValues[auctionId]?.price,
        quality: auctionValues[auctionId]?.quality,
        supplierId,
      };

      if (bidData.quality > 5) {
        console.error('Error placing bid over 5 quality');
        return;
      }

      try {
        const result = await api.post('/bids/place', bidData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        bidData.id = result.data.bidId;
        bidData.name = result.data.name;
        socket.emit('placeBid', bidData);
      } catch (err) {
        console.error('Error placing bid:', err);
      }
    } else {
      console.error('Error placing bid');
    }
  };

  const winningBid = async (bidId) => {
    try {
      const response = await api.post('/transactions', { bidId });
      socket.emit('winningBid');
    } catch (err) {
      console.error('Error winning bid');
    }
  };

  const winWho = (auctionId) => {
    const winningBid = winningBids.find((bid) => bid.auction_id === auctionId);
    return winningBid ? winningBid.name : null;
  };

  const winPrice = (auctionId) => {
    const winningBid = winningBids.find((bid) => bid.auction_id === auctionId);
    return winningBid ? winningBid.final_price : null;
  };

  return (
    <div>
      <h2>Active Auctions</h2>
      {auctions.map((auction) => (
        <div key={auction.id}>
          <h3>Auction {auction.id}</h3>
          {winningBids.some((x) => x.auction_id === auction.id) ? (
            <>
              Winning Bid of ${winPrice(auction.id)} by {winWho(auction.id)}
            </>
          ) : (
            <>
              <h4>Current Bids</h4>
              <ul>
                {auctionBids[auction.id]?.map((bid, index) => (
                  <li key={index}>
                    {role === 'facilitator' ? (
                      <button onClick={() => winningBid(bid.id)}>
                        Price: {bid.price}, Quality: {bid.quality}, Name: {bid.name}
                      </button>
                    ) : (
                      <>
                        Price: {bid.price}, Quality: {bid.quality}, Name: {bid.name}
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {role !== 'facilitator' && (
                <div>
                  <input
                    type="number"
                    value={auctionValues[auction.id]?.price || ''}
                    onChange={(e) =>
                      handleAuctionValuesChange(auction.id, 'price', e.target.value)
                    }
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    value={auctionValues[auction.id]?.quality || ''}
                    onChange={(e) =>
                      handleAuctionValuesChange(auction.id, 'quality', e.target.value)
                    }
                    placeholder="Quality"
                  />

                  <>
                    <button onClick={() => placeBid(auction.id)}>Bid</button>
                  </>

                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Auctions;
