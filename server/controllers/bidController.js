const pool = require('../config/db');

//Get all bids
const getBids = async (req, res) => {
  const bids = await pool.query(
    'select bids.id as bid_id, auction_id, price, quality, users.name as name from public.bids inner join users on users.id = bids.supplier_id order by auction_id asc, bid_id asc');
  return res.json({ bids: bids.rows });
};

// Get all bids where there are no winners (no transaction)
const noWinner = async (req, res) => {
  try {
    const result = await pool.query(
      `select bids.id as bid_id, bids.auction_id, bids.price, bids.quality, users.name as supplier_name, supplier_id from bids inner join users on users.id = bids.supplier_id left join transactions on transactions.auction_id = bids.auction_id where transactions.auction_id is NULL order by auction_id asc, bids.id asc`
    );
    return res.json({ bids: result.rows });
  } catch (error) {
    console.error('Error fetching bids with no winners:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Get all bids for an auction
const auctionBids = async (req, res) => {
  const { id } = req.params;
  try {
    const bids = await pool.query(
      'select bids.id as bid_id, auction_id, price, quality, users.name as name from bids inner join users on users.id = bids.supplier_id where auction_id = $1 order by auction_id asc', [id]);
    return res.json({ bids: bids.rows });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Place a bid
const placeBid = async (req, res) => {
  const { auctionId, price, quality, supplierId } = req.body;
  try {
    const checkAuction = await pool.query('select status from auctions where id = $1', [auctionId]);
    if (checkAuction.rows.length === 0) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    if (checkAuction.rows[0].status === 'closed') {
      return res.status(400).json({ message: 'Auction is closed' });
    }
    const response = await pool.query(
      'select * from users where id = $1',
      [supplierId]
    )

    const result = await pool.query(
      'insert into bids (supplier_id, auction_id, price, quality) values ($1, $2, $3, $4) RETURNING id',
      [supplierId, auctionId, price, quality]
    );

    const bidId = result.rows[0].id;

    console.log('Bid routes post /place bidId: ', bidId);

    res.json({
      message: `Bid of ${price} placed for auction ${auctionId} by ${supplierId}`,
      bidId: bidId,
      name: response.rows[0].name,
    });



  } catch (error) {
    console.error('Error creating bid:', error);
    return res.status(500).json({ message: 'Error creating bid' });
  }

  console.log('RAAAAN');
};

module.exports = {
  placeBid,
  getBids,
  noWinner,
  auctionBids
};
