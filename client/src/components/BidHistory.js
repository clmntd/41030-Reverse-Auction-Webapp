import React, { useState, useEffect } from 'react';
import api from '../api';

const BidHistory = () => {
    const [bids, setBids] = useState([]);
    const [winningBids, setWinningBids] = useState([]);
    const [user, setUser] = useState(null);

    let lastAuctionId = null;
    
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        const fetchBids = async () => {
            if (!user) return;
            
            if (user.role === 'facilitator') {
                try {
                    const response = await api.get('/bids');
                    setBids(response.data.bids);
                    const response2 = await api.get('/transactions');
                    setWinningBids(response2.data);
                    console.log(response.data.bids);
                } catch (err) {
                    console.error('Error fetching bids:', err);
                }
            } else {
                try {
                    const response = await api.get(`/auctions/${user.id}`);
                    setBids(response.data.auctions);
                    const response2 = await api.get('/transactions');
                    setWinningBids(response2.data);
                } catch (err) {
                    console.error('Error fetching auctions:', err);
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

                    const auctionWinningBids = winningBids.filter(winningBid => winningBid.auction_id === bid.auction_id);
                    const latestBid = auctionWinningBids.reduce((max, current) => (current.bid_id > max.bid_id ? current : max), auctionWinningBids[0]);
                    const isWinningBid = bid.bid_id === latestBid?.bid_id;

                    return (
                        <div key={index}>
                            {shouldRenderAuctionId && (
                                <h2>Auction ID: {bid.auction_id}</h2>
                            )}
                            <p
                                style={{
                                    fontWeight: isWinningBid ? 'bold' : 'normal',
                                    color: isWinningBid ? 'green' : 'black',
                                    backgroundColor: isWinningBid ? '#e6f7e6' : 'transparent',
                                    padding: '5px',
                                    borderRadius: '4px',
                                }}
                            >
                                Bid# {bid.bid_id}: ${bid.price} by {bid.name}
                            </p>
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
