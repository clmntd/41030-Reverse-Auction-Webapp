const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//Test route
router.get('/test', (req, res) => {
    res.json({ message: "Bid route is working!" });
});

//Get all bids
router.get('/', async (req, res) => {
    const bids = await pool.query(
        'SELECT bids.id as bid_id, auction_id, price, quality, users.name as name FROM public.bids inner join users on users.id = bids.supplier_id ORDER BY auction_id ASC, bid_id ASC');
    return res.json({ bids: bids.rows });
});

// Get all bids where there are no winners (no transaction)
router.get('/no-winner', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT bids.id as bid_id, bids.auction_id, bids.price, bids.quality, users.name as supplier_name, supplier_id FROM bids INNER JOIN users ON users.id = bids.supplier_id LEFT JOIN transactions ON transactions.auction_id = bids.auction_id WHERE transactions.auction_id IS NULL ORDER BY bids.bid_id ASC`
        );
        return res.json({ bids: result.rows });
    } catch (error) {
        console.error('Error fetching bids with no winners:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Get all bids for an auction
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const bids = await pool.query(
            'SELECT bids.id as bid_id, auction_id, price, quality, users.name as name FROM public.bids inner join users on users.id = bids.supplier_id where auction_id = $1 ORDER BY auction_id ASC', [id]);
        return res.json({ bids: bids.rows });
    } catch (error) {
        console.error('Error fetching bids:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
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