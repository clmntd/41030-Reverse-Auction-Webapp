// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const pool = require("../config/db");

// // Register User
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = await pool.query(
//     "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//     [name, email, hashedPassword]
//   );
//   res.json(newUser.rows[0]);
// });

// // Login User
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//   if (user.rows.length === 0) return res.status(400).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.rows[0].password);
//   if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//   res.json({ token, user: user.rows[0] });
// });

// module.exports = router;

/////////////////////////////////////////

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.rows[0].id, role:user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token, user: user.rows[0], role:role.rows[0]});
});

// router.post('/login', loginUser);

// router.post('/register', (req, res) => {
//   const { username, password } = req.body;
//   res.json({ message: `User ${username} registered successfully!` });
// });

router.post('/register', registerUser);

console.log('✅ authRoutes file loaded:', __filename);
console.log(router.stack.map(layer => layer.route?.path || 'Middleware'));

router.get('/test', (req, res) => {
    res.json({ message: 'Auth route works!' });
  });

module.exports = router;
