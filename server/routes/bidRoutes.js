const express = require('express');
const router = express.Router();
const {
    getBids,
    noWinner,
    auctionBids,
    placeBid
} = require('../controllers/bidController');

router.get('/test', (req, res) => {
    res.json({ message: "Bid route is working!" });
});

router.get('/', getBids);
router.get('/noWinner', noWinner);
router.get('/:id', auctionBids);
router.post('/place', placeBid);

console.log("✅ bidRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;