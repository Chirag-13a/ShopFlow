const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testAPI() {
  try {
    // First, let's test login with an admin user
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin2@gmail.com',
      password: 'chin' // Correct password for admin user
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.token;
    
    // Now test the users endpoint with the token
    console.log('Testing users endpoint...');
    const usersResponse = await axios.get('http://localhost:5000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Users endpoint successful:', usersResponse.data);
    console.log('Number of users:', usersResponse.data.length);
    
  } catch (error) {
    console.error('API test failed:', error.response?.data || error.message);
  }
}

testAPI(); 