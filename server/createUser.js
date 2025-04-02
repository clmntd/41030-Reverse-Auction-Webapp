const { createUser } = require('./userService');

//Test
const createTestUser = async () => {
  try {
    const newUser = await createUser(
      'Sup2', //name
      'sup2@gmail.com', //email
      '12345678',  //password (will be hashed)
      'supplier'
    );
    console.log('Created User:', newUser);
  } catch (error) {
    console.error('Error:', error);
  }
};

createTestUser();
