const axios = require('axios');

async function testDatabaseFlow() {
  try {
    console.log('=== TESTING DATABASE FLOW ===\n');
    
    // Step 1: Check current ideas count
    console.log('1. Checking current ideas...');
    const initialResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/ideas');
    console.log('   Initial ideas count:', initialResponse.data.length);
    
    // Step 2: Generate a new idea
    console.log('\n2. Generating new idea...');
    const testIdea = `Test idea generated at ${new Date().toISOString()}`;
    const generateResponse = await axios.post('https://codecrafter-web.netlify.app/.netlify/functions/generate-code', {
      idea: testIdea,
      usedVoiceInput: false
    });
    
    console.log('   Generated successfully with ID:', generateResponse.data.id);
    console.log('   Idea text:', generateResponse.data.idea);
    
    // Step 3: Wait a moment and check ideas again
    console.log('\n3. Waiting 5 seconds then checking ideas again...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const finalResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/ideas');
    console.log('   Final ideas count:', finalResponse.data.length);
    
    // Step 4: Check if our idea appears
    if (finalResponse.data.length > initialResponse.data.length) {
      console.log('   ✅ SUCCESS: New idea found in database!');
      const latestIdea = finalResponse.data[0];
      console.log('   Latest idea:', latestIdea.idea);
      console.log('   Generated at:', latestIdea.generated_at);
    } else {
      console.log('   ❌ ISSUE: No new ideas found in database');
      console.log('   This suggests the generate-code function is not actually saving to Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error in test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testDatabaseFlow();