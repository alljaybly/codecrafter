const axios = require('axios');

async function testFrontendBadges() {
  try {
    console.log('Testing badges from frontend perspective...\n');
    
    // Test the exact same call the frontend makes
    const response = await fetch('https://codecrafter-web.netlify.app/.netlify/functions/badges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    console.log('Response data type:', typeof responseData);
    console.log('Is array:', Array.isArray(responseData));
    console.log('Length:', responseData.length);
    
    if (responseData.length > 0) {
      console.log('Sample badge:', responseData[0]);
      
      // Test badge mapping
      const earnedBadges = responseData.map(b => b.badge_name);
      console.log('Earned badge names:', earnedBadges);
      
      const badgeDefinitions = {
        'First Idea': { icon: '🎯', description: 'Submitted your first app idea', color: 'bg-blue-500' },
        'Voice Input Used': { icon: '🎤', description: 'Used voice input to describe an idea', color: 'bg-purple-500' },
        'Code Generator': { icon: '⚡', description: 'Generated your first piece of code', color: 'bg-green-500' },
        'Todo Master': { icon: '✅', description: 'Created a todo application', color: 'bg-yellow-500' },
        'Weather Wizard': { icon: '🌤️', description: 'Built a weather application', color: 'bg-cyan-500' },
        'Early Adopter': { icon: '🚀', description: 'One of the first users of CodeCrafter', color: 'bg-red-500' }
      };
      
      const allBadgeNames = Object.keys(badgeDefinitions);
      console.log('All badge names:', allBadgeNames);
      
      // Check which badges should be rendered as earned
      allBadgeNames.forEach(badgeName => {
        const earnedBadge = responseData.find(b => b.badge_name === badgeName);
        console.log(`${badgeName}: ${earnedBadge ? '✅ EARNED' : '❌ NOT EARNED'}`);
      });
      
      console.log('\n✅ Frontend should show 5 earned badges!');
    } else {
      console.log('❌ No badges returned - this is the problem!');
    }
    
  } catch (error) {
    console.error('❌ Error in frontend test:', error.message);
  }
}

testFrontendBadges();