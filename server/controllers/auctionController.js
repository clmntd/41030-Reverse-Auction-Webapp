const pool = require('../config/db');

const createAuction = async (req, res) => {
  const { facilitator_id, status } = req.body;
  try {
    const newAuction = await pool.query(
      'INSERT INTO auctions (facilitator_id, status) VALUES ($1, $2) RETURNING *',
      [facilitator_id, status]
    );
    res.status(201).json(newAuction.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating auction', error });
  }
};

//More auction-related methods like listing auctions, updating status, etc.

module.exports = { createAuction };
