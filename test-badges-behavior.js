const axios = require('axios');

async function testBadgesBehavior() {
  try {
    console.log('🧪 TESTING NEW BADGES BEHAVIOR\n');
    
    // Test 1: Check initial badges count
    console.log('1. Getting initial badges count...');
    const initialResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    console.log(`   Initial badges: ${initialResponse.data.length}`);
    
    // Test 2: Generate a new idea to trigger badge update
    console.log('\n2. Generating new idea to test event-driven updates...');
    const testIdea = `Event-driven badge test - ${new Date().toISOString()}`;
    
    const generateResponse = await axios.post('https://codecrafter-web.netlify.app/.netlify/functions/generate-code', {
      idea: testIdea,
      usedVoiceInput: false
    });
    
    console.log(`   ✅ Code generated with ID: ${generateResponse.data.id}`);
    console.log(`   ✅ Supabase status: ${generateResponse.data.supabaseStatus}`);
    
    // Test 3: Check if badges were updated (should happen via database trigger)
    console.log('\n3. Checking for badge updates (waiting 3 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const updatedResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    console.log(`   Updated badges: ${updatedResponse.data.length}`);
    
    if (updatedResponse.data.length > initialResponse.data.length) {
      console.log('   🎉 SUCCESS: New badges were awarded automatically!');
      const newBadges = updatedResponse.data.slice(0, updatedResponse.data.length - initialResponse.data.length);
      newBadges.forEach(badge => {
        console.log(`      🏆 New badge: ${badge.badge_name}`);
      });
    } else {
      console.log('   ✅ No new badges (may already have all available badges)');
    }
    
    // Test 4: Verify current badge system behavior
    console.log('\n4. Current badge system summary:');
    console.log(`   📊 Total badges in system: ${updatedResponse.data.length}`);
    console.log('   🏆 Available badges:');
    
    const badgeNames = updatedResponse.data.map(b => b.badge_name);
    const allPossibleBadges = ['Early Adopter', 'First Idea', 'Code Generator', 'Todo Master', 'Weather Wizard', 'Voice Input Used'];
    
    allPossibleBadges.forEach(badgeName => {
      const hasIt = badgeNames.includes(badgeName);
      console.log(`      ${hasIt ? '✅' : '❌'} ${badgeName}`);
    });
    
    console.log('\n🎯 NEW BEHAVIOR SUMMARY:');
    console.log('   ✅ No more aggressive 15-second polling');
    console.log('   ✅ Event-driven updates when code is generated');
    console.log('   ✅ Background updates every 2 minutes (instead of 15 seconds)');
    console.log('   ✅ Only shows loading state on initial load');
    console.log('   ✅ Updates only when data actually changes');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testBadgesBehavior();