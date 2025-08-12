const axios = require('axios');

async function testBadgeAPI() {
  try {
    console.log('Testing badge-library API...');
    const response = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badge-library');
    console.log('Success:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.status);
    console.error('Message:', error.response?.data || error.message);
  }
}

testBadgeAPI();