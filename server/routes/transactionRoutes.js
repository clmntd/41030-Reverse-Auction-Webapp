const express = require('express');
const router = express.Router();


router.get('/test', (req, res) => {
    res.json({ message: "Transaction route is working!" });
});

//Get all transactions
router.get('/', (req, res) => {
    res.json({ transactions: [] }); //Replace with actual transaction retrieval
});

//Create a transaction (Dummy)
router.post('/', (req, res) => {
    const { auctionId, winnerId, amount } = req.body;
    res.json({ message: `Transaction recorded: ${winnerId} won auction ${auctionId} for ${amount}` });
});

console.log("✅ transactionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;
