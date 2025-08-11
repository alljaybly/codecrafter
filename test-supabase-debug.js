const axios = require('axios');

async function testSupabaseDebug() {
  try {
    console.log('Testing generate-code with debug info...');
    
    const response = await axios.post('https://codecrafter-web.netlify.app/.netlify/functions/generate-code', {
      idea: 'Debug test idea',
      usedVoiceInput: false
    });
    
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testSupabaseDebug();