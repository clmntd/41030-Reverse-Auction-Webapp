import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Container,
  Typography,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Paper,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BidHistory = () => {
  const [bids, setBids] = useState([]);
  const [winningBids, setWinningBids] = useState([]);
  const [user, setUser] = useState(null);

  const role = JSON.parse(localStorage.getItem('role'));

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 500,
          color: 'text.primary'
        }}
      >
        {role === 'facilitator' ? 'All Bidding History' : `${user.name}'s Bidding History`}
      </Typography>

      {bids.length > 0 ? (
        <Paper
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          {bids.map((bid, index) => {
            const shouldRenderAuctionId = bid.auction_id !== lastAuctionId;
            if (shouldRenderAuctionId) lastAuctionId = bid.auction_id;

            const auctionWinningBids = winningBids.filter(winningBid =>
              winningBid.auction_id === bid.auction_id
            );
            const latestBid = auctionWinningBids.reduce((max, current) =>
              (current.bid_id > max.bid_id ? current : max), auctionWinningBids[0]
            );
            const isWinningBid = bid.bid_id === latestBid?.bid_id;

            return (
              <Box key={index}>
                {shouldRenderAuctionId && (
                  <>
                    <Divider />
                    <Box sx={{ px: 3, py: 2, bgcolor: '#f6f6f6' }}>
                      <Typography variant="h5" sx={{ fontWeight: 500 }}>
                        Auction #{bid.auction_id}
                      </Typography>
                    </Box>
                    <Divider />
                  </>
                )}
                <ListItem
                  sx={{
                    px: 3,
                    py: 2,
                    color: isWinningBid ? 'white' : 'black',
                    borderLeft: isWinningBid ? '4px solid' : 'none',
                    borderColor: isWinningBid ? 'success.main' : 'transparent',
                    backgroundColor: isWinningBid ? 'success.light' : 'background.paper',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body1" component="span">
                          ${bid.price}
                        </Typography>
                        <Chip
                          label={`Quality: ${bid.quality}`}
                          sx={{ color: isWinningBid ? 'white' : 'black' }}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                          {bid.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color={isWinningBid ? 'white' : 'text.secondary'}>
                        Bid #{bid.bid_id}
                      </Typography>
                    }
                  />
                  {isWinningBid && (
                    <Chip
                      icon={<CheckCircleIcon fontSize="small" />}
                      label="Winning Bid"
                      color="success"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  )}
                </ListItem>
                <Divider />
              </Box>
            );
          })}
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No bids found
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default BidHistory;