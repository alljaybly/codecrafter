const axios = require('axios');

async function testRealTimeData() {
  try {
    console.log('1. Generating new code idea...');
    const generateResponse = await axios.post('https://codecrafter-web.netlify.app/.netlify/functions/generate-code', {
      idea: 'Build a real-time notification system',
      usedVoiceInput: true
    });
    
    console.log('✅ Generated code with ID:', generateResponse.data.id);
    
    console.log('\n2. Fetching ideas list...');
    const ideasResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/ideas');
    
    console.log('✅ Fetched ideas count:', ideasResponse.data.length);
    
    if (ideasResponse.data.length > 0) {
      console.log('✅ Latest idea:', ideasResponse.data[0].idea);
      console.log('✅ Real-time data working!');
    } else {
      console.log('⚠️ No ideas found - may be empty database or Supabase not configured');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealTimeData();