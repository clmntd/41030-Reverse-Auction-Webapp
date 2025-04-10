import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../api';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputAdornment,
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

// const socket = io('http://localhost:5000'); //Server URL

const socket = io(`http://${window.location.hostname}:5000`); //Server URL

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



  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = JSON.parse(localStorage.getItem('role'));
  
  const [dash, setDash] = useState(getData());

  function getData() {
    const data = localStorage.getItem('dashSettings')
    if (data) {
      return JSON.parse(data)
    }
    else {
      return {
        price: false,
        quality: false,
        number: true,
        name: false
      }
    }
  }


  useEffect(() => {
    console.log('Auction.js useEffect is triggered');
    console.log('Auction.js role data:', role);
    console.log('Auction.js dash data:', dash);

    let isMounted = true;

    const fetchAuctions = async () => {
      try {
        const response = await api.get('/auctions');
        const response2 = await api.get('/transactions');
        const response3 = await api.get('/bids/noWinner');
        if (isMounted) {
          setAuctions(response.data.auctions);
          setWinningBids(response2.data);
          setNoWinningBids(response3.data.bids);
        }
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
        updatedBids[bidData.auctionId].push({
          ...bidData,
          bid_id: bidData.bid_id || bidData.id
        });
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
      isMounted = false;
    };
  }, []);

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
        const result = await api.delete(`/auctions/${auction_id}`, {
          data: { userId },
        });
        if (result.status === 200) {
          socket.emit('deleteAuction');
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
        const result = await api.post('/auctions', {
          facilitator_id: userId,
        });
        if (result.status === 200) {
          socket.emit('makeAuction');
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
        socket.emit('placeBid', {
          ...bidData,
          id: result.data.bidId,
          bid_id: result.data.bidId,
          name: result.data.name
        });
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
    const bids = noWinningBids.filter(x => x.auction_id === auctionId);
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
              <Typography variant="body1" sx={{ fontWeight: 500 , color: 'white'}}>
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
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                label={`#${bid.bid_id}`}
                                size="small"
                                color="primary"
                                variant={dash.number ? 'outlined' : 'filled'}
                              />
                              <Chip
                                label={`$${bid.price}`}
                                size="small"
                                color="secondary"
                                variant={dash.price ? 'outlined' : 'filled'}
                              />
                              <Chip
                                label={`Quality: ${bid.quality}`}
                                size="small"
                                color="default"
                                variant={dash.quality ? 'outlined' : 'filled'}
                              />
                              <Chip
                                label={bid.name || bid.supplier_name}
                                size="small"
                                color="success"
                                variant={dash.name ? 'outlined' : 'filled'}
                              />
                            </Stack>
                            <Chip
                              label="Select Winner"
                              color="primary"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </Button>
                        ) : (
                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={2} alignItems="center">
                                {dash.number && <Chip
                                  label={`#${bid.bid_id}`}
                                  size="small"
                                  variant={dash.number ? "outlined" : "filled"}
                                  sx={{ backgroundColor: 'background.paper' }}
                                />}
                                {dash.price && <Chip
                                  label={`$${bid.price}`}
                                  size="small"
                                  variant={dash.price ? "outlined" : "filled"}
                                  sx={{ backgroundColor: 'background.paper' }}
                                />}
                                {dash.quality && <Chip
                                  label={`Quality: ${bid.quality}`}
                                  size="small"
                                  variant={dash.quality ? "outlined" : "filled"}
                                  sx={{ backgroundColor: 'background.paper' }}
                                />}
                                {dash.name && (
                                  <Typography variant="body2">
                                    {bid.name || bid.supplier_name}
                                  </Typography>
                                )}
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
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        },
                      }}
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
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      value={auctionValues[auction.id]?.quality || ''}
                      onChange={(e) =>
                        handleAuctionValuesChange(auction.id, 'quality', e.target.value)
                      }
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
