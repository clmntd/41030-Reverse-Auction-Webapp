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
    const response = await pool.query(
        'select * from users where id = $1',
        [supplierId]
    )
    const result = await pool.query(
        'insert into bids (supplier_id, auction_id, price, quality) values ($1, $2, $3, $4) RETURNING id',
        [supplierId, auctionId, price, quality]
    );

    const bidId = result.rows[0].id;
    // console.log(bidId, 'bidsjfkdsdf');
    res.json({
        message: `Bid of ${price} placed for auction ${auctionId} by ${supplierId}`,
        bidId: bidId,
        name: response.rows[0].name,
    });
    console.log('RAAAAN');
});

console.log("✅ bidRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;