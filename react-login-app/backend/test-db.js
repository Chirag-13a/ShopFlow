const mongoose = require('mongoose');
const User = require('./models/User');

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/userdb');
    console.log('Connected to MongoDB');

    // Check existing users
    const users = await User.find();
    console.log(`Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('Existing users:');
      users.forEach(user => {
        console.log(`- Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    } else {
      console.log('No users found in database');
      
      // Create a test admin user
      const testUser = new User({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        verified: true
      });
      
      await testUser.save();
      console.log('Created test admin user: admin@test.com / password123');
    }

    // Test JWT token generation
    const jwt = require('jsonwebtoken');
    const testUser = await User.findOne({ email: 'admin@test.com' });
    
    if (testUser) {
      const token = jwt.sign(
        {
          id: testUser._id,
          role: testUser.role,
        },
        "CHIRAG@13"
      );
      
      console.log('Generated test token:', token);
      
      // Verify the token
      try {
        const decoded = jwt.verify(token, "CHIRAG@13");
        console.log('Token verification successful:', decoded);
      } catch (err) {
        console.log('Token verification failed:', err.message);
      }
    }

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDatabase(); 