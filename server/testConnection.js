const { Pool } = require('pg');
require('dotenv').config(); //Load environment variables

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to the database:', res.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

testConnection();