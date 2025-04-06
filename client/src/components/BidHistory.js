import React, { useState, useEffect } from 'react';
import api from '../api';


const BidHistory = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/auctions/${user.id}`);
        console.log(response.data);
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    if (user) {
      fetchTransactions();
    }
  }, []);

  return (
    <div>
        <h2>HELLLO HISTORY</h2>
      <h2>{user ? `${user.name}'s Dashboard` : 'Loading...'}</h2>
      {/* {transactions.map((transaction) => (
        <div key={transaction.id}>
          <p>Auction ID: {transaction.auction_id}</p>
          <p>Winner: {transaction.winner_id}</p>
          <p>Final Price: {transaction.final_price}</p>
        </div>
      ))} */}
    </div>
  );
};

export default BidHistory;
