const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/test', (req, res) => {
    res.json({ message: "Transaction route is working!" });
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Error getting transaction' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        console.log('TRANSRESULT', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Error getting transaction' });
    }
});

//Create a transaction (Dummy)
router.post('/', async (req, res) => {
    const { bidId } = req.body;
    console.log(bidId, 'dsfsdfs');
    const response = await pool.query('SELECT * FROM bids WHERE id = $1', [bidId]);
    const bigdata = response.rows[0];
    console.log(bigdata.supplier_id, 'hsdfjkldfhsgjklsdf');
    res.json({ message: `Transaction recorded: ${bigdata.supplier_id} won auction ${bigdata.auction_id} for ${bigdata.price}` });
    try {
        const result = await pool.query(
            'INSERT INTO transactions(auction_id, winner_id, final_price) VALUES ($1, $2, $3)',
            [bigdata.auction_id, bigdata.supplier_id, bigdata.price]
        );
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw new Error('Error creating transaction');
    }

});

console.log("✅ transactionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;
