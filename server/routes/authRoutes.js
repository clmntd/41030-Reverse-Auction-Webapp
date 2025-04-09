const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser
} = require('../controllers/authController');

router.get('/test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

router.post('/login', loginUser);
router.post('/register', registerUser);

console.log('✅ authRoutes file loaded:', __filename);
console.log(router.stack.map(layer => layer.route?.path || 'Middleware'));


module.exports = router;
