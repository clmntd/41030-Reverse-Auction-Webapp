const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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


// console.log(app.router);
// console.log(app.router.stack);

//Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000', // your frontend origin
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Receive messages from the client
    socket.on('message', (msg) => {
        console.log('Received message:', msg);

        // Send a response only to the specific client (current behavior)

        // Broadcast message to all connected clients
        io.emit('message', 'Hello, All Clients!');
    });

    socket.on('placeBid', bidData => {
        console.log('Bid data:', bidData);

        // Send the bid data only to the client that placed the bid
        // socket.emit('newBid', bidData);

        // Broadcast the bid data to all connected clients
        io.emit('newBid', bidData); // This sends the bid data to everyone
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

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
