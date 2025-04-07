const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createAuction } = require('../controllers/auctionController');

router.get('/test', (req, res) => {
    res.json({ message: "Auction route is working!" });
});

//Get all auctions
router.get('/', async (req, res) => {
    const auctions = await pool.query('select * from auctions order by id ASC');
    return res.json({ auctions: auctions.rows });
});

//Get all auctions data where user_id participated
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const auctions = await pool.query(
        'select auction_id, bids.id AS bid_id, price, quality, facilitator_id, supplier_id, users.name as name from auctions inner join bids ON bids.auction_id = auctions.id inner join users on users.id = bids.supplier_id where auctions.id in (select distinct auction_id from bids where supplier_id = $1) order by auction_id asc, bids.id asc', [id]);
    console.log('Auction routes get /:id auctions.rows: ', auctions.rows);
    if (auctions.rows.some(x => x.supplier_id == id)) {
        return res.json({ auctions: auctions.rows });
    } else {
        return res.json({ auctions: [] });
    }
});

//Create a new auction
router.post('/', async (req, res) => {
    const { facilitator_id } = req.body;
    try {
        const result = await pool.query(
            'insert into auctions (facilitator_id, status) values ($1, $2)',
            [facilitator_id, 'open']
        );
        res.json({ message: `Auction created!` });
        console.log('Auction created:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating auction:', err);
    }
});

//Delete an auction
router.delete('/:id', async (req, res) => {
    const { userId } = req.body;
    const user = await pool.query('select * from users where id = $1', [userId]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (user.rows[0].role === 'supplier') {
        return res.status(400).json({ message: 'User is not a facilitator' });
    }
    const { id } = req.params;
    const auction = await pool.query('select * from auctions where id = $1', [id]);
    if (auction.rows.length === 0) {
        return res.status(400).json({ message: 'Auction not found' });
    }
    try {
        await pool.query('delete from auctions where id = $1;', [id]);
        await pool.query('delete from bids where auction_id = $1;', [id]);
        console.log('Auction routes delete /:id');
        return res.status(200).json({ message: `Auction ${id} deleted successfully` });
    } catch (err) {
        console.error('Error deleting auctions:', err);
        res.status(500).json({ error: 'Error deleting auction' });
    }
});

console.log("✅ auctionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;