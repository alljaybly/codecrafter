const axios = require('axios');

async function testBadgesRealTime() {
  try {
    console.log('=== TESTING REAL-TIME BADGES SYSTEM ===\n');
    
    // Step 1: Check current badges
    console.log('1. Checking current badges...');
    const initialBadgesResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    console.log('   Initial badges count:', initialBadgesResponse.data.length);
    
    if (initialBadgesResponse.data.length > 0) {
      console.log('   Sample badge:', initialBadgesResponse.data[0]);
    }
    
    // Step 2: Generate a new idea to trigger badge awarding
    console.log('\n2. Generating new idea to trigger badge system...');
    const testIdea = `Real-time badge test idea generated at ${new Date().toISOString()}`;
    const generateResponse = await axios.post('https://codecrafter-web.netlify.app/.netlify/functions/generate-code', {
      idea: testIdea,
      usedVoiceInput: true // This should trigger voice badge
    });
    
    console.log('   Generated successfully with ID:', generateResponse.data.id);
    console.log('   Supabase status:', generateResponse.data.supabaseStatus);
    
    // Step 3: Wait and check badges again
    console.log('\n3. Waiting 5 seconds then checking badges again...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const finalBadgesResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    console.log('   Final badges count:', finalBadgesResponse.data.length);
    
    // Step 4: Compare results
    if (finalBadgesResponse.data.length > initialBadgesResponse.data.length) {
      console.log('   ✅ SUCCESS: New badges awarded!');
      const newBadges = finalBadgesResponse.data.slice(0, finalBadgesResponse.data.length - initialBadgesResponse.data.length);
      newBadges.forEach(badge => {
        console.log(`   🏆 New badge: ${badge.badge_name} (awarded at ${badge.awarded_at})`);
      });
    } else if (finalBadgesResponse.data.length === initialBadgesResponse.data.length && finalBadgesResponse.data.length > 0) {
      console.log('   ✅ SUCCESS: Badges system working (no new badges, but existing badges loaded)');
      finalBadgesResponse.data.forEach(badge => {
        console.log(`   🏆 Existing badge: ${badge.badge_name}`);
      });
    } else {
      console.log('   ⚠️ ISSUE: No badges found - database tables may not be set up');
      console.log('   Please run the badges.sql script in your Supabase dashboard');
    }
    
    // Step 5: Test badges API directly
    console.log('\n4. Testing badges API response format...');
    console.log('   Response is array:', Array.isArray(finalBadgesResponse.data));
    console.log('   Response status:', finalBadgesResponse.status);
    console.log('   Content-Type:', finalBadgesResponse.headers['content-type']);
    
  } catch (error) {
    console.error('❌ Error in badges test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testBadgesRealTime();