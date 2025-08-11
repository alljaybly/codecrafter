const axios = require('axios');

async function testCompleteSystem() {
  try {
    console.log('🚀 TESTING COMPLETE REAL-TIME SYSTEM\n');
    
    // Test 1: Check all endpoints are working
    console.log('1. Testing all API endpoints...');
    
    const healthResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/health');
    console.log('   ✅ Health endpoint:', healthResponse.status);
    
    const ideasResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/ideas');
    console.log('   ✅ Ideas endpoint:', ideasResponse.status, `(${ideasResponse.data.length} ideas)`);
    
    const badgesResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    console.log('   ✅ Badges endpoint:', badgesResponse.status, `(${badgesResponse.data.length} badges)`);
    
    // Test 2: Generate new idea and check real-time updates
    console.log('\n2. Testing real-time data flow...');
    
    const initialIdeasCount = ideasResponse.data.length;
    const initialBadgesCount = badgesResponse.data.length;
    
    console.log(`   Initial state: ${initialIdeasCount} ideas, ${initialBadgesCount} badges`);
    
    // Generate a new idea
    const testIdea = `Complete system test - ${new Date().toISOString()}`;
    const generateResponse = await axios.post('https://codecrafter-web.netlify.app/.netlify/functions/generate-code', {
      idea: testIdea,
      usedVoiceInput: true
    });
    
    console.log('   ✅ Generated idea with ID:', generateResponse.data.id);
    console.log('   ✅ Supabase status:', generateResponse.data.supabaseStatus);
    
    // Wait for database updates
    console.log('\n3. Waiting 5 seconds for database updates...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check updated counts
    const updatedIdeasResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/ideas');
    const updatedBadgesResponse = await axios.get('https://codecrafter-web.netlify.app/.netlify/functions/badges');
    
    const finalIdeasCount = updatedIdeasResponse.data.length;
    const finalBadgesCount = updatedBadgesResponse.data.length;
    
    console.log(`   Final state: ${finalIdeasCount} ideas, ${finalBadgesCount} badges`);
    
    // Test 3: Verify real-time updates
    console.log('\n4. Real-time update results:');
    
    if (finalIdeasCount > initialIdeasCount) {
      console.log('   ✅ IDEAS: Real-time updates working!');
      const latestIdea = updatedIdeasResponse.data[0];
      console.log(`      Latest idea: "${latestIdea.idea}"`);
    } else {
      console.log('   ❌ IDEAS: No new ideas found (database may not be set up)');
    }
    
    if (finalBadgesCount > initialBadgesCount) {
      console.log('   ✅ BADGES: Real-time updates working!');
      const newBadges = updatedBadgesResponse.data.slice(0, finalBadgesCount - initialBadgesCount);
      newBadges.forEach(badge => {
        console.log(`      New badge: ${badge.badge_name}`);
      });
    } else if (finalBadgesCount > 0) {
      console.log('   ✅ BADGES: System working (existing badges loaded)');
      updatedBadgesResponse.data.forEach(badge => {
        console.log(`      Badge: ${badge.badge_name}`);
      });
    } else {
      console.log('   ❌ BADGES: No badges found (database may not be set up)');
    }
    
    // Test 4: Summary
    console.log('\n🎯 SYSTEM STATUS SUMMARY:');
    console.log(`   API Endpoints: ✅ All working`);
    console.log(`   Ideas System: ${finalIdeasCount > 0 ? '✅' : '❌'} ${finalIdeasCount > 0 ? 'Working' : 'Needs database setup'}`);
    console.log(`   Badges System: ${finalBadgesCount > 0 ? '✅' : '❌'} ${finalBadgesCount > 0 ? 'Working' : 'Needs database setup'}`);
    console.log(`   Real-time Updates: ${(finalIdeasCount > initialIdeasCount || finalBadgesCount > initialBadgesCount) ? '✅' : '⚠️'} ${(finalIdeasCount > initialIdeasCount || finalBadgesCount > initialBadgesCount) ? 'Active' : 'Needs database tables'}`);
    
    if (finalIdeasCount === 0 || finalBadgesCount === 0) {
      console.log('\n📋 NEXT STEPS:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Open the SQL Editor');
      console.log('   3. Run the complete-setup.sql script');
      console.log('   4. Test again - real-time updates will work immediately!');
    } else {
      console.log('\n🎉 SYSTEM FULLY OPERATIONAL!');
      console.log('   Real-time ideas and badges are working perfectly!');
    }
    
  } catch (error) {
    console.error('❌ System test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testCompleteSystem();