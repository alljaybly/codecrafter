const axios = require('axios');

async function testBadgesNow() {
  try {
    console.log('Testing badges API right now...');
    
    const response = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    
    console.log('Status:', response.status);
    console.log('Data type:', typeof response.data);
    console.log('Is array:', Array.isArray(response.data));
    console.log('Length:', response.data.length);
    console.log('Raw data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testBadgesNow();