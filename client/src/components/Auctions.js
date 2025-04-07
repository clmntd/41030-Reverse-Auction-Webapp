import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../api';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const socket = io('http://localhost:5000'); //Server URL
socket.on('connect', () => {
  console.log('Connected to the server!');
  socket.emit('message', 'Hello, Server!');
});

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [auctionValues, setAuctionValues] = useState({});
  const [winningBids, setWinningBids] = useState([]);
  const [noWinningBids, setNoWinningBids] = useState([]);
  const [auctionBids, setAuctionBids] = useState({});

  // const getStoredSettings = () => {
  //   const storedState = localStorage.getItem('dashSettings');
  //   return storedState ? JSON.parse(storedState) : { price: true, quality: true };
  // };
  // const [dashSettings, setDashSettings] = useState(getStoredSettings);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = JSON.parse(localStorage.getItem('role'));
  const [dash, setDash] = useState(localStorage.getItem('dashSettings') || { price: true, quality: true });


  useEffect(() => {
    console.log('Auction.js useEffect is triggered');

    const fetchAuctions = async () => {
      try {
        const response = await api.get('/auctions');
        const response2 = await api.get('/transactions');
        const response3 = await api.get('/bids/noWinner');
        setAuctions(response.data.auctions);
        setWinningBids(response2.data);
        setNoWinningBids(response3.data.bids);
        console.log('Auction.js bids/noWinner data:', response3.data);
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

    socket.on('deleteAuction', async () => {
      try {
        const response = await api.get('/auctions');
        setAuctions(response.data.auctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    });

    socket.on('makeAuction', async () => {
      try {
        const response = await api.get('/auctions');
        setAuctions(response.data.auctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    });

    socket.on('dash', (settings) => {
      setDash(settings);
    });

    return () => {
      socket.off('newBid');
      socket.off('winningBid');
      socket.off('deleteAuction');
      socket.off('makeAuction');
      socket.off('dash');
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

  const deleteAuction = async (auction_id) => {
    if (role === 'facilitator') {
      const userId = user.id;
      try {
        socket.emit('deleteAuction');
        const result = await api.delete(`/auctions/${auction_id}`, {
          data: { userId },
        });
        if (result.status === 200) {
          console.log(`Auction ${auction_id} deleted successfully.`);
          setAuctions((prevAuctions) =>
            prevAuctions.filter((auction) => auction.id !== auction_id)
          );
        }
      } catch (err) {
        console.error('Error deleting auction:', err);
      }
    } else {
      console.error('Unauthorized to delete auction');
    }
  };

  const newAuction = async () => {
    if (role === 'facilitator') {
      const userId = user.id;
      try {
        socket.emit('makeAuction');
        const result = await api.post('/auctions', {
          facilitator_id: userId,
        });
        if (result.status === 200) {
          console.log(`Auction created successfully.`);
        }
      } catch (err) {
        console.error('Error deleting auction:', err);
      }
    } else {
      console.error('Unauthorized to create auction');
    }
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
      console.log('Auctions.js winngBid response: ', response);
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

  const getNoBid = (auctionId) => {
    const bids = noWinningBids.filter(x => x.auction_id == auctionId);
    console.log('Auction.js bids: ', bids);
    if (bids) {
      return bids;
    } else {
      return {};
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.primary' }}>
          Active Auctions
        </Typography>
        {role === 'facilitator' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={newAuction}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            New Auction
          </Button>
        )}
      </Box>

      {auctions.map((auction) => (
        <Paper
          key={auction.id}
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Auction #{auction.id}
            </Typography>
            {role === 'facilitator' && (
              <IconButton
                onClick={() => deleteAuction(auction.id)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {winningBids.some((x) => x.auction_id === auction.id) ? (
            <Paper sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                🏆 Winning Bid: ${winPrice(auction.id)} by {winWho(auction.id)}
              </Typography>
            </Paper>
          ) : (
            <>
              {(auctionBids[auction.id]?.length > 0 || getNoBid(auction.id).length > 0) ? (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                    Current Bids
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    {(auctionBids[auction.id] || getNoBid(auction.id)).map((bid, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        {role === 'facilitator' ? (
                          <Button
                            fullWidth
                            onClick={() => winningBid(bid.id || bid.bid_id)}
                            sx={{
                              justifyContent: 'space-between',
                              textTransform: 'none',
                              borderRadius: 1
                            }}
                          >
                            

                            <Stack direction="row" spacing={1}>
                              <span style={{color:'black'}}>${bid.price}</span>
                              
                              <Chip label={`Quality: ${bid.quality}`} size="small" />
                              <span style={{color:'black'}}>{bid.name || bid.supplier_name}</span>
                            </Stack>
                            
                            
                            <Chip label="Select Winner" color="primary" size="small" />
                          </Button>
                        ) : (
                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={2} alignItems="center">
                                {dash.price && <span>${bid.price}</span>}
                                {dash.quality && <Chip label={`Quality: ${bid.quality}`} size="small" />}
                                <span>{bid.name || bid.supplier_name}</span>
                              </Stack>
                            }
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    No bids have been placed yet
                  </Typography>
                </Paper>
              )}

              {role !== 'facilitator' && (
                <Box component="form" sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      type="number"
                      label="Price"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={auctionValues[auction.id]?.price || ''}
                      onChange={(e) =>
                        handleAuctionValuesChange(auction.id, 'price', e.target.value)
                      }
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      type="number"
                      label="Quality (1-5)"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={auctionValues[auction.id]?.quality || ''}
                      onChange={(e) =>
                        handleAuctionValuesChange(auction.id, 'quality', e.target.value)
                      }
                      inputProps={{ min: 1, max: 5 }}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => placeBid(auction.id)}
                      disabled={!auctionValues[auction.id]?.price || !auctionValues[auction.id]?.quality}
                      sx={{
                        px: 4,
                        borderRadius: 1,
                        textTransform: 'none'
                      }}
                    >
                      Place Bid
                    </Button>
                  </Stack>
                </Box>
              )}
            </>
          )}
        </Paper>
      ))}
    </Container>
  );
};

export default Auctions;
