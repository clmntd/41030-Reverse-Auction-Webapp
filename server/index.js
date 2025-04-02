// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Auction API is running");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const { createUser } = require('./userService');

//Test
const createTestUser = async () => {
  try {
    const newUser = await createUser(
      'John Smith', 
      'test@gmail.com', 
      '12345678',  // This will be hashed
      'facilitator'
    );
    console.log('Created User:', newUser);
  } catch (error) {
    console.error('Error:', error);
  }
};

createTestUser();
