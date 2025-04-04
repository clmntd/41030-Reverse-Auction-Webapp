const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config({ path: __dirname + '/../.env' });

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== 'facilitator') {
    return res.status(400).json({ message: 'Only facilitators can register' });
  }

  //Check if user already exists
  const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (checkUser.rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Save user to the database
  const newUser = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, role]
  );

  res.status(201).json(newUser.rows[0]);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const testRes = await pool.query('SELECT NOW()');
  console.log(testRes.rows);

  //Check if user exists
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  //Compare password
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  //Create JWT token
  
  const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  

  res.status(200).json({ token });
};

module.exports = { registerUser, loginUser };
