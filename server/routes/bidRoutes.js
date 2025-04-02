const express = require('express');
const router = express.Router();

//Test route
router.get('/test', (req, res) => {
    res.json({ message: "Bid route is working!" });
});

//Place a bid
router.post('/', (req, res) => {
    const { auctionId, bidderId, amount } = req.body;
    res.json({ message: `Bid of ${amount} placed for auction ${auctionId}` });
});

console.log("✅ bidRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;