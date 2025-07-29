const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/userdb');
    console.log('Connected to MongoDB');

    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Admin users found: ${adminUsers.length}`);
    
    adminUsers.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin(); 