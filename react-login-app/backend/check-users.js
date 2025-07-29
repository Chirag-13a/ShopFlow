const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/userdb');
    console.log('Connected to MongoDB');

    const users = await User.find();
    console.log(`Total users: ${users.length}`);
    
    users.forEach(user => {
      console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers(); 