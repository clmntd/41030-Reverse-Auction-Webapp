import React, { useState, useEffect } from 'react';
import api from '../api';


const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transactions/${user.id}`);
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return (
    <div>
      <h2>{user ? `${user.name}'s Dashboard` : 'Loading...'}</h2>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <p>Auction ID: {transaction.auction_id}</p>
          <p>Winner: {transaction.winner_id}</p>
          <p>Final Price: {transaction.final_price}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
