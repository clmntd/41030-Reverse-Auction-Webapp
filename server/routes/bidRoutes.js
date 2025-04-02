const express = require('express');
const router = express.Router();
const { placeBid } = require('../controllers/bidController');

router.post('/place', placeBid);
//More bid-related routes

module.exports = router;
