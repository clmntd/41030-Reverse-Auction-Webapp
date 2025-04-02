const express = require('express');
const router = express.Router();
const { createAuction } = require('../controllers/auctionController');

router.post('/create', createAuction);
//Add routes for listing, updating auction status, etc.

router.get('/test', (req, res) => {
    res.json({ message: "Auction route is working!" });
});

//Get all auctions
router.get('/', (req, res) => {
    res.json({ auctions: [] }); //Replace with actual auction retrieval logic
});

//Create a new auction
router.post('/', (req, res) => {
    const { name, startTime, endTime } = req.body;
    res.json({ message: `Auction "${name}" created!` });
});

console.log("✅ auctionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;