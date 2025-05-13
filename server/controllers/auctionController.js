const pool = require('../config/db');

//Create auction
const createAuction = async (req, res) => {
    const { facilitator_id } = req.body;
    const user = await pool.query('select * from users where id = $1', [facilitator_id]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (user.rows[0].role === 'supplier') {
        return res.status(400).json({ message: 'User is not a facilitator' });
    }
    try {
        const result = await pool.query(
            'insert into auctions (facilitator_id, status) values ($1, $2) returning *',
            [facilitator_id, 'open']
        );
        res.json({ message: `Auction created!` });
        console.log('Auction created:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating auction:', error);
    }
};

//Delete an auction
const deleteAuction = async (req, res) => {
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
};

//Get all auctions
const getAuctions = async (req, res) => {
    const auctions = await pool.query('select * from auctions order by id ASC');
    return res.json({ auctions: auctions.rows });
};

//Get all auctions user has participated in
const getParticipate = async (req, res) => {
    const { id } = req.params;

    const auctions = await pool.query(`
        SELECT 
            auction_id, 
            bids.id AS bid_id, 
            price, 
            quality, 
            facilitator_id, 
            supplier_id, 
            users.name AS name 
        FROM 
            auctions 
        INNER JOIN 
            bids ON bids.auction_id = auctions.id 
        INNER JOIN 
            users ON users.id = bids.supplier_id 
        WHERE 
            auctions.id IN (
                SELECT DISTINCT auction_id 
                FROM bids 
                WHERE supplier_id = $1
            ) 
        ORDER BY 
            auction_id ASC, 
            bids.id ASC
    `, [id]);
    console.log('Auction routes get /:id auctions.rows: ', auctions.rows);
    if (auctions.rows.some(x => x.supplier_id == id)) {
        return res.json({ auctions: auctions.rows });
    } else {
        return res.json({ auctions: [] });
    }
};


module.exports = {
    createAuction,
    deleteAuction,
    getAuctions,
    getParticipate
};
