const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createAuction } = require('../controllers/auctionController');

router.get('/test', (req, res) => {
    res.json({ message: "Auction route is working!" });
});

//Get all auctions
router.get('/', async (req, res) => {
    const auctions = await pool.query('SELECT * FROM public.auctions');
    return res.json({ auctions: auctions.rows });
});

//Create a new auction
router.post('/', async (req, res) => {
    const { name, facilitator_id } = req.body;
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
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
    }
    if(user.rows[0].role === 'supplier'){
        return res.status(400).json({ message: 'User is not a facilitator' });
    }
    const { id } = req.params;
    const auction = await pool.query('select * from auctions WHERE id = $1', [id]);
    if (auction.rows.length === 0) {
        return res.status(400).json({ message: 'Auction not found' });
    }
    try {
        const response = await pool.query('delete from public.auctions where id = $1;', [id]);
        console.log('auctionroutes delete');
        return res.status(200).json({ message: `Auction ${id} deleted successfully` });
    } catch (err) {
        console.error('Error deleting auctions:', err);
        res.status(500).json({ error: 'Error deleting auction' });
    }
});

console.log("✅ auctionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;