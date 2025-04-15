const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

const devConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const proConfig = {
  connectionString: process.env.DATABASE_URL // heroku addons
}



const pool = new Pool(
  process.env.NODE_ENV === 'production' ? proConfig : devConfig
);


console.log('Password:', process.env.DB_PASSWORD);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err.message));


module.exports = pool;