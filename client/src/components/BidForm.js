import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const BidForm = () => {
  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState(3);

  useEffect(() => {
    socket.on('newBid', (bidData) => {
      console.log('New bid received:', bidData);
    });

    return () => {
      socket.off('newBid');
    };
  }, []);

  const placeBid = () => {
    const bidData = { price, quality };
    socket.emit('placeBid', bidData); //Emit to server

    //Your API call for placing bid here
  };

  return (
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
      <button onClick={placeBid}>Place Bid</button>
    </div>
  );
};

export default BidForm;
