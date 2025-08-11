const axios = require('axios');

async function debugSupabase() {
  try {
    console.log('Testing ideas function with debug output...');
    
    // Call the ideas function to see debug logs
    const response = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/ideas');
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // The debug logs will be in Netlify's function logs, not in our response
    // But we can see if the function is working
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

debugSupabase();