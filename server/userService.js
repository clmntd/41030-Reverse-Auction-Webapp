const bcrypt = require('bcryptjs');
const pool = require('./config/db');

//Function to create a user with a hashed password
const createUser = async (name, email, password, role) => {
  try {
    //Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds

    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    console.log('User created:', result.rows[0]);
    return result.rows[0]; //Return the created user
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
};

module.exports = { createUser };
