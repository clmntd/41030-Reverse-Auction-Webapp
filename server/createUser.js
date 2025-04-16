const { createUser } = require('./userService');

//Test
const createTestUser = async () => {
  try {
    const newUser = await createUser(
      'Test Facilitator', //name
      'test@gmail.com', //email
      '12345678',  //password (will be hashed)
      'facilitator'
    );
    console.log('Created User:', newUser);
  } catch (error) {
    console.error('Error:', error);
  }
};

createTestUser();
