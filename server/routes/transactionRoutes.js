const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getAllTransactions,
    getTransactionId,
    getTransactionsByUserId
} = require('../controllers/transactionController');


router.get('/test', (req, res) => {
    res.json({ message: "Transaction route is working!" });
});


router.get('/', getAllTransactions);
router.get('/id/:id', getTransactionsByUserId);
router.get('/:id', getTransactionId);
router.post('/', createTransaction);

console.log("✅ transactionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;
