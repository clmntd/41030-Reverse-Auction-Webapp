const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//Test route
router.get('/test', (req, res) => {
    res.json({ message: "Bid route is working!" });
});

//Place a bid
router.post('/place', async (req, res) => {
    const { auctionId, price, quality, supplierId } = req.body;
    res.json({ message: `Bid of ${price} placed for auction ${auctionId}` });
    const result = await pool.query(
        'INSERT INTO bids (supplier_id, auction_id, price, quality) VALUES ($1, $2, $3, $4)',
        [supplierId, auctionId, price, quality]
      );
      console.log('RAAAAN');
});

console.log("✅ bidRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;