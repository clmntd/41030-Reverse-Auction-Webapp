const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Register Routes with a Base Path
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

console.log("Registering routes...");

console.log('✅ Auth routes loaded');
console.log('✅ Auction routes loaded');
console.log('✅ Bid routes loaded');
console.log('✅ Transaction routes loaded');

console.log('Routes registered successfully!');

//Route Debugging (Ensure All Routes Are Logged)
console.log('Registered Routes:');
if (app.router && app.router.stack) {
    app.router.stack.forEach((middleware) => {
        if (middleware.route) {
            //Directly registered route
            console.log(`🔹 ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
        } else if (middleware.name === 'router' && middleware.handle.stack) {
            //Nested routes inside a router
            middleware.handle.stack.forEach((route) => {
                if (route.route) {
                    console.log(`🔹 ${Object.keys(route.route.methods).join(', ').toUpperCase()} ${route.route.path}`);
                }
            });
        }
    });
} else {
    console.log('❌ No routes found!');
}

// Debug: Print all routes to find the problematic one
function printRoutes(stack, basePath = '') {
  stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      console.log(`ROUTE: ${methods} ${basePath}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      let path = layer.regexp.toString().split('\\')[1];
      if (path) {
        path = '/' + path;
        printRoutes(layer.handle.stack, basePath + path);
      } else {
        printRoutes(layer.handle.stack, basePath);
      }
    }
  });
}

console.log('======== DETAILED ROUTE INSPECTION ========');
printRoutes(app._router.stack);
console.log('==========================================');

// The "catch-all" route handler: for any request that doesn't match API routes,
// send back the React app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//Start the servercd 
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

//local
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on : ${PORT}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: '*', //Whitelist website
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    //Receive messages from the client
    socket.on('message', (msg) => {
        console.log('Received message:', msg);
        io.emit('message', 'Hello, All Clients!');
    });

    socket.on('placeBid', bidData => {
        console.log('Bid data:', bidData);
        io.emit('newBid', bidData);
    });

    socket.on('winningBid', () => {
        io.emit('winningBid');
    });

    socket.on('deleteAuction', () => {
        io.emit('deleteAuction');
    });

    socket.on('makeAuction', () => {
        io.emit('makeAuction');
    });

    socket.on('dash', settings => {
        io.emit('dash', settings);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
