import React, { useState, useEffect } from 'react';
import api from '../api';

const BidHistory = () => {
    const [bids, setBids] = useState([]);
    const [user, setUser] = useState(null);

    let lastAuctionId = null; // Regular variable, not part of state

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
            if (!user) return;
            if (user.role == 'facilitator') {
                try {
                    const response = await api.get('/bids');
                    console.log('testeste', response.data);
                    setBids(response.data.bids);
                } catch (err) {
                    console.error('Error fetching bids:', err);
                }
            } else {
                try {
                    const response = await api.get(`/auctions/${user.id}`);
                    console.log('dsfsdsdfsd', user.id);
                    console.log(response.data.auctions);
                    setBids(response.data.auctions);
                } catch (err) {
                    console.error('Error fetching bids:', err);
                }
            }
        };

        fetchBids();
    }, [user]);

    if (!user) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h2>{user ? `${user.name}'s Dashboard` : 'Loading...'}</h2>
            {bids.length > 0 ? (
                bids.map((bid, index) => {
                    const shouldRenderAuctionId = bid.auction_id !== lastAuctionId;
                    if (shouldRenderAuctionId) {
                        lastAuctionId = bid.auction_id;
                    }

                    return (
                        <div key={index}>
                            {shouldRenderAuctionId && (
                                <h2>Auction ID: {bid.auction_id}</h2>
                            )}
                            <p>Bid# {bid.bid_id}: ${bid.price} by {bid.name}</p>
                        </div>
                    );
                })
            ) : (
                <p>No bids found.</p>
            )}
        </div>
    );
};

export default BidHistory;
