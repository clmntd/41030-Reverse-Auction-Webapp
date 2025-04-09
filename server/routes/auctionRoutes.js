const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {
    createAuction,
    getAuctions,
    getParticipate,
    deleteAuction
} = require('../controllers/auctionController');


router.get('/test', (req, res) => {
    res.json({ message: "Auction route is working!" });
});

router.get('/', getAuctions);
router.post('/', createAuction);
router.get('/:id', getParticipate);
router.delete('/:id', deleteAuction);

console.log("✅ auctionRoutes file loaded:", __filename);
console.log(router.stack.map(layer => layer.route?.path || "Middleware"));

module.exports = router;