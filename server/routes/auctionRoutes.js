const express = require('express');
const router = express.Router();
const { createAuction } = require('../controllers/auctionController');

router.post('/create', createAuction);
//Add routes for listing, updating auction status, etc.

module.exports = router;