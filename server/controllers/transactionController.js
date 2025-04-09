const pool = require('../config/db');

//Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const result = await pool.query('select transactions.id as transactions_id, transactions.auction_id, bids.id as bid_id, final_price, bids.price as bid_price, bids.supplier_id as supplier_id, bids.quality as quality,name from transactions inner join bids on bids.auction_id = transactions.auction_id inner join users on users.id = transactions.winner_id where transactions.final_price = bids.price');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Error getting transaction' });
    }
};

//Get transaction by id
const getTransactionId =  async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select * from transactions where id = $1', [id]);
        console.log('transactionroute get:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Error getting transaction' });
    }
};

//Get transactions by user ID
const getTransactionsByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select * from transactions inner join users on users.id = transactions.winner_id where users.id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ error: 'Error getting transactions' });
    }
};

//Create a new transaction
const createTransaction = async (req, res) => {
    const { bidId } = req.body;
    console.log('Transaction routes post / bidId: ', bidId);
    const response = await pool.query('select * from bids where id = $1', [bidId]);
    const bigdata = response.rows[0];
    console.log('transactionRoutes bigdata.supplier_id:', bigdata.supplier_id);
    res.json({ message: `Transaction recorded: ${bigdata.supplier_id} won auction ${bigdata.auction_id} for ${bigdata.price}` });
    try {
        const result = await pool.query(
            'insert into transactions(auction_id, winner_id, final_price) values ($1, $2, $3)',
            [bigdata.auction_id, bigdata.supplier_id, bigdata.price]
        );
        await pool.query('update auctions set status = $1 where id = $2', ['closed', bigdata.auction_id]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw new Error('Error creating transaction');
    }
};

module.exports = {
    getAllTransactions,
    getTransactionsByUserId,
    createTransaction,
    getTransactionId
};