const pool = require('../config/db');

const placeBid = async (req, res) => {
  const { supplier_id, auction_id, price, quality } = req.body;
  try {
    const newBid = await pool.query(
      'INSERT INTO bids (supplier_id, auction_id, price, quality) VALUES ($1, $2, $3, $4) RETURNING *',
      [supplier_id, auction_id, price, quality]
    );
    res.status(201).json(newBid.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid', error });
  }
};

module.exports = { placeBid };
