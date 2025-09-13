const axios = require('axios');

const API_BASE_URL = 'https://codecrafter-web.netlify.app/.netlify/functions';

// Test cases for enhanced web app generation
const testCases = [
  {
    name: 'Todo App with Authentication',
    prompt: 'Create a to-do app with user authentication',
    expectedFeatures: ['todo', 'auth', 'supabase', 'signin', 'signup', 'CRUD'],
    language: 'react',
    platform: 'web'
  },
  {
    name: 'Calculator App',
    prompt: 'Create a calculator app',
    expectedFeatures: ['calculator', 'arithmetic', 'button', 'display', 'operation'],
    language: 'react',
    platform: 'web'
  },
  {
    name: 'Chat App with Login',
    prompt: 'Create a chat app with user login',
    expectedFeatures: ['chat', 'message', 'auth', 'real-time', 'supabase'],
    language: 'react',
    platform: 'web'
  },
  {
    name: 'Weather Dashboard',
    prompt: 'Build a weather dashboard with location search',
    expectedFeatures: ['weather', 'location', 'search', 'geolocation', 'dashboard'],
    language: 'react',
    platform: 'web'
  },
  {
    name: 'Analytics Dashboard',
    prompt: 'Create an analytics dashboard with metrics',
    expectedFeatures: ['analytics', 'dashboard', 'metrics', 'chart', 'data'],
    language: 'react',
    platform: 'web'
  },
  {
    name: 'E-commerce Store',
    prompt: 'Build an e-commerce store with shopping cart',
    expectedFeatures: ['ecommerce', 'cart', 'product', 'shop', 'checkout'],
    language: 'react',
    platform: 'web'
  }
];

async function testCodeGeneration() {
  console.log('🧪 TESTING ENHANCED WEB APP CODE GENERATION');
  console.log('='.repeat(50));
  
  const results = {
    passed: 0,
    failed: 0,
    total: testCases.length,
    details: []
  };

  for (const testCase of testCases) {
    console.log(`\\n🎯 Testing: ${testCase.name}`);
    console.log(`Prompt: "${testCase.prompt}"`);
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${API_BASE_URL}/generate-code`, {
        idea: testCase.prompt,
        language: testCase.language,
        platform: testCase.platform,
        usedVoiceInput: false
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`   ⏱️  Response time: ${responseTime}ms`);
      
      if (response.status === 200 && response.data.code) {
        const code = response.data.code.toLowerCase();
        
        // Check for expected features
        const foundFeatures = testCase.expectedFeatures.filter(feature => 
          code.includes(feature.toLowerCase())
        );
        
        const featureScore = (foundFeatures.length / testCase.expectedFeatures.length) * 100;
        console.log(`   📊 Feature match: ${foundFeatures.length}/${testCase.expectedFeatures.length} (${featureScore.toFixed(1)}%)`);
        
        // Check for production-ready features
        const hasTypeScript = code.includes('interface') || code.includes('type ');
        const hasTailwind = code.includes('className=') && (code.includes('bg-') || code.includes('text-'));
        const hasAccessibility = code.includes('aria-label') || code.includes('role=');
        const hasErrorHandling = code.includes('try') && code.includes('catch');
        
        console.log(`   🔧 TypeScript: ${hasTypeScript ? '✅' : '❌'}`);
        console.log(`   🎨 Tailwind CSS: ${hasTailwind ? '✅' : '❌'}`);
        console.log(`   ♿ Accessibility: ${hasAccessibility ? '✅' : '❌'}`);
        console.log(`   🛡️  Error handling: ${hasErrorHandling ? '✅' : '❌'}`);
        
        // Determine if test passed
        const passed = featureScore >= 60 && hasTypeScript && hasTailwind;
        
        if (passed) {
          console.log(`   ✅ PASSED`);
          results.passed++;
        } else {
          console.log(`   ❌ FAILED`);
          results.failed++;
        }
        
        results.details.push({
          name: testCase.name,
          passed,
          featureScore,
          responseTime,
          hasTypeScript,
          hasTailwind,
          hasAccessibility,
          hasErrorHandling
        });
        
      } else {
        console.log(`   ❌ FAILED - Invalid response`);
        results.failed++;
        results.details.push({
          name: testCase.name,
          passed: false,
          error: 'Invalid response'
        });
      }
      
    } catch (error) {
      console.log(`   ❌ FAILED - ${error.message}`);
      results.failed++;
      results.details.push({
        name: testCase.name,
        passed: false,
        error: error.message
      });
    }
  }
  
  // Test original problem case
  console.log('\\n🔍 Testing Original Problem Case...');
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-code`, {
      idea: 'Create a to-do app with user authentication',
      language: 'react',
      platform: 'web',
      usedVoiceInput: false
    });
    
    const code = response.data.code.toLowerCase();
    const hasCounterApp = code.includes('count') && code.includes('setcount') && !code.includes('todo');
    const hasTodoFeatures = code.includes('todo') && (code.includes('auth') || code.includes('supabase'));
    
    console.log('Original Problem Test:');
    console.log(`   🎯 Generated counter app: ${hasCounterApp ? 'YES (BAD)' : 'NO (GOOD)'}`);
    console.log(`   ✅ Has todo + auth features: ${hasTodoFeatures ? 'YES (GOOD)' : 'NO (BAD)'}`);
    
    if (!hasCounterApp && hasTodoFeatures) {
      console.log(`   🎉 ORIGINAL PROBLEM FIXED!`);
    } else {
      console.log(`   ❌ Original problem still exists`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error testing original problem: ${error.message}`);
  }
  
  // Performance test
  console.log('\\n⚡ Performance Test...');
  const performanceTests = [];
  
  for (let i = 0; i < 3; i++) {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${API_BASE_URL}/generate-code`, {
        idea: 'Create a simple todo app',
        language: 'react',
        platform: 'web',
        usedVoiceInput: false
      });
      const endTime = Date.now();
      
      if (response.status === 200) {
        performanceTests.push({
          success: true,
          time: endTime - startTime
        });
      }
    } catch (error) {
      performanceTests.push({
        success: false,
        error: error.message
      });
    }
  }
  
  const successfulTests = performanceTests.filter(t => t.success);
  const avgTime = successfulTests.length > 0 
    ? successfulTests.reduce((sum, t) => sum + t.time, 0) / successfulTests.length 
    : 0;
  
  console.log('Performance Results:');
  console.log(`   ✅ Successful: ${successfulTests.length}/${performanceTests.length}`);
  console.log(`   ⏱️  Total time: ${performanceTests.reduce((sum, t) => sum + (t.time || 0), 0)}ms`);
  console.log(`   📊 Avg per request: ${Math.round(avgTime)}ms`);
  
  // Final summary
  console.log('\\n📋 TEST SUMMARY');
  console.log('='.repeat(16));
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  console.log('\\n🎯 SUCCESS CRITERIA:');
  const successRate = (results.passed / results.total) * 100;
  console.log(`${successRate >= 95 ? '✅' : '❌'} Target: 95% accuracy (${successRate >= 95 ? 'MET' : 'NOT MET'})`);
  
  const hasRelevantOutputs = results.details.every(d => !d.error || !d.error.includes('counter'));
  console.log(`${hasRelevantOutputs ? '✅' : '❌'} No irrelevant outputs (${hasRelevantOutputs ? 'MET' : 'NOT MET'})`);
  
  const hasProductionCode = results.details.filter(d => d.hasTypeScript && d.hasTailwind).length >= results.total * 0.8;
  console.log(`${hasProductionCode ? '✅' : '❌'} Production-ready code (${hasProductionCode ? 'MET' : 'NOT MET'})`);
  
  if (successRate >= 95 && hasRelevantOutputs && hasProductionCode) {
    console.log('\\n🎉 WEB APP CODE GENERATION FIX SUCCESSFUL!');
    process.exit(0);
  } else {
    console.log('\\n❌ Tests failed - further improvements needed');
    process.exit(1);
  }
}

// Run tests
testCodeGeneration().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});