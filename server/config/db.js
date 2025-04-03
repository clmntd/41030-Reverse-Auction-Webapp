const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: "password",
  port: process.env.DB_PORT,
});
console.log(process.env.DB_PASSWORD);
pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err.message));


module.exports = pool;