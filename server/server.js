const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const pool = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/transactions', transactionRoutes);

//Real-time bidding
io.on('connection', (socket) => {
  console.log('A user connected');

  //Listen for bid
  socket.on('placeBid', (bidData) => {
    //Broadcast the bid data to all connected clients
    io.emit('newBid', bidData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//Start server
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
