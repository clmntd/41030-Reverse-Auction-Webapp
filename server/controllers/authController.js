const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config({ path: __dirname + '/../.env' });

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token, user: user.rows[0], role: user.rows[0] });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('HITT REGG');
  try {
    //Check if user already exists
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    //Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds

    //Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    return res.json({ message: `User ${result.rows[0].name} registered successfully!` });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

module.exports = { registerUser, loginUser };
