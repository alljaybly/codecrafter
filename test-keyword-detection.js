// Test improved keyword detection
function testKeywordDetection() {
  console.log('🔍 TESTING ENHANCED KEYWORD DETECTION\n');
  
  const testCases = [
    'Create a to-do app with user authentication',
    'Build a todo list with login',
    'Make a task manager with auth',
    'Create a simple counter app',
    'Build an e-commerce store',
    'Create a chat application',
    'Make a weather app',
    'Build a dashboard with analytics'
  ];
  
  testCases.forEach(idea => {
    const lowerIdea = idea.toLowerCase();
    const normalizedIdea = lowerIdea.replace(/[-_\s]+/g, ' ');
    
    const hasAuth = /\b(auth|login|signup|sign\s*up|sign\s*in|user|account|register)\b/.test(normalizedIdea);
    const isTodo = /\b(todo|to\s*do|task|list|checklist|reminder)\b/.test(normalizedIdea);
    const isEcommerce = /\b(shop|store|cart|product|ecommerce|e\s*commerce|buy|sell|payment)\b/.test(normalizedIdea);
    const isChat = /\b(chat|message|messaging|social|conversation|talk)\b/.test(normalizedIdea);
    const isDashboard = /\b(dashboard|admin|analytics|metrics|stats|report)\b/.test(normalizedIdea);
    const isWeather = /\b(weather|forecast|temperature|climate)\b/.test(normalizedIdea);
    
    console.log(`"${idea}"`);
    console.log(`  Normalized: "${normalizedIdea}"`);
    console.log(`  Auth: ${hasAuth}, Todo: ${isTodo}, Ecommerce: ${isEcommerce}`);
    console.log(`  Chat: ${isChat}, Dashboard: ${isDashboard}, Weather: ${isWeather}`);
    
    // Determine what should be generated
    if (isTodo && hasAuth) {
      console.log(`  ✅ Should generate: TODO APP WITH AUTH`);
    } else if (isEcommerce) {
      console.log(`  ✅ Should generate: ECOMMERCE APP`);
    } else if (isChat) {
      console.log(`  ✅ Should generate: CHAT APP`);
    } else if (isDashboard) {
      console.log(`  ✅ Should generate: DASHBOARD`);
    } else if (isWeather) {
      console.log(`  ✅ Should generate: WEATHER APP`);
    } else if (isTodo) {
      console.log(`  ✅ Should generate: BASIC TODO APP`);
    } else {
      console.log(`  ⚠️  Should generate: INTELLIGENT DEFAULT`);
    }
    console.log('');
  });
}

testKeywordDetection();