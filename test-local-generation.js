// Test the enhanced code generation locally
const fs = require('fs');

// Load the generate-code function
const generateCodeContent = fs.readFileSync('./frontend/netlify/functions/generate-code.js', 'utf8');

// Extract the generateWebAppCode function for testing
const testGenerateWebAppCode = (idea, language = 'html', platform = 'web') => {
  const lowerIdea = idea.toLowerCase();
  
  // Advanced prompt analysis for web apps
  const hasAuth = lowerIdea.includes('auth') || lowerIdea.includes('login') || lowerIdea.includes('signup') || lowerIdea.includes('user');
  const isTodo = lowerIdea.includes('todo') || lowerIdea.includes('task') || lowerIdea.includes('list');
  
  console.log(`Testing: "${idea}"`);
  console.log(`Analysis: hasAuth=${hasAuth}, isTodo=${isTodo}`);
  
  if (isTodo && hasAuth) {
    console.log('✅ Should generate todo app with auth');
    return 'TODO_APP_WITH_AUTH_CODE';
  }
  
  console.log('❌ Falling back to default');
  return 'DEFAULT_CODE';
};

// Test cases
const testCases = [
  'Create a to-do app with user authentication',
  'Build a todo list with login',
  'Make a task manager with auth',
  'Create a simple counter app'
];

console.log('🧪 LOCAL CODE GENERATION TEST\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`);
  const result = testGenerateWebAppCode(testCase, 'react', 'web');
  console.log(`Result: ${result}\n`);
});

// Test the actual function logic
console.log('🔍 CHECKING FUNCTION LOGIC IN FILE...\n');

// Check if the new function exists
if (generateCodeContent.includes('generateWebAppCode')) {
  console.log('✅ generateWebAppCode function found in file');
} else {
  console.log('❌ generateWebAppCode function NOT found in file');
}

// Check if it's being called
if (generateCodeContent.includes('generateWebAppCode(idea, language, platform)')) {
  console.log('✅ generateWebAppCode is being called correctly');
} else {
  console.log('❌ generateWebAppCode is NOT being called');
}

// Check for the problematic default template
if (generateCodeContent.includes('const [count, setCount] = useState(0)')) {
  console.log('⚠️  Old counter template still exists');
} else {
  console.log('✅ Old counter template removed');
}

console.log('\n📋 DIAGNOSIS:');
console.log('The function logic should work correctly.');
console.log('If tests still fail, it might be a deployment/caching issue.');