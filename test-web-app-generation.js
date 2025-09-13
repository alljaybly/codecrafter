const axios = require('axios');

async function testWebAppGeneration() {
  console.log('🧪 TESTING ENHANCED WEB APP CODE GENERATION\n');
  
  const baseURL = 'https://codecrafter-web.netlify.app/.netlify/functions';
  
  // Test cases for web app generation
  const webAppTests = [
    {
      name: 'Todo App with Authentication',
      prompt: {
        idea: 'Create a to-do app with user authentication',
        language: 'react',
        platform: 'web',
        usedVoiceInput: false
      },
      expectedFeatures: [
        'supabase',
        'authentication',
        'todo',
        'useState',
        'useEffect',
        'sign',
        'login',
        'CRUD',
        'tailwind'
      ]
    },
    {
      name: 'E-commerce Store',
      prompt: {
        idea: 'Build an e-commerce store with shopping cart',
        language: 'react',
        platform: 'web',
        usedVoiceInput: false
      },
      expectedFeatures: [
        'product',
        'cart',
        'ecommerce',
        'shop',
        'price',
        'add to cart',
        'checkout'
      ]
    },
    {
      name: 'Chat Application',
      prompt: {
        idea: 'Create a real-time chat application',
        language: 'react',
        platform: 'web',
        usedVoiceInput: false
      },
      expectedFeatures: [
        'chat',
        'message',
        'real-time',
        'useState',
        'send',
        'conversation'
      ]
    },
    {
      name: 'Analytics Dashboard',
      prompt: {
        idea: 'Build an analytics dashboard with metrics',
        language: 'react',
        platform: 'web',
        usedVoiceInput: false
      },
      expectedFeatures: [
        'dashboard',
        'analytics',
        'metrics',
        'chart',
        'data',
        'statistics'
      ]
    },
    {
      name: 'Blog Platform',
      prompt: {
        idea: 'Create a blog platform with posts',
        language: 'react',
        platform: 'web',
        usedVoiceInput: false
      },
      expectedFeatures: [
        'blog',
        'post',
        'article',
        'content',
        'publish'
      ]
    }
  ];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];

  console.log('🎯 Testing Web App Code Generation...\n');

  for (const test of webAppTests) {
    totalTests++;
    
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Prompt: "${test.prompt.idea}"`);
      
      const startTime = Date.now();
      const response = await axios.post(`${baseURL}/generate-code`, test.prompt);
      const responseTime = Date.now() - startTime;
      
      const generatedCode = response.data.code;
      
      // Check if code is relevant (not the default counter app)
      const isRelevant = !generatedCode.includes('const [count, setCount] = useState(0)');
      
      // Check for expected features
      const foundFeatures = test.expectedFeatures.filter(feature => 
        generatedCode.toLowerCase().includes(feature.toLowerCase())
      );
      
      const relevanceScore = (foundFeatures.length / test.expectedFeatures.length) * 100;
      
      // Check for production-ready features
      const hasTypeScript = generatedCode.includes('interface') || generatedCode.includes('React.FC');
      const hasTailwind = generatedCode.includes('className=');
      const hasAccessibility = generatedCode.includes('aria-') || generatedCode.includes('role=');
      const hasErrorHandling = generatedCode.includes('error') || generatedCode.includes('try') || generatedCode.includes('catch');
      
      console.log(`   ⏱️  Response time: ${responseTime}ms`);
      console.log(`   🎯 Relevance: ${isRelevant ? 'RELEVANT' : 'IRRELEVANT'}`);
      console.log(`   📊 Feature match: ${foundFeatures.length}/${test.expectedFeatures.length} (${relevanceScore.toFixed(1)}%)`);
      console.log(`   🔧 TypeScript: ${hasTypeScript ? '✅' : '❌'}`);
      console.log(`   🎨 Tailwind CSS: ${hasTailwind ? '✅' : '❌'}`);
      console.log(`   ♿ Accessibility: ${hasAccessibility ? '✅' : '❌'}`);
      console.log(`   🛡️  Error handling: ${hasErrorHandling ? '✅' : '❌'}`);
      
      // Test passes if it's relevant and has good feature coverage
      if (isRelevant && relevanceScore >= 60) {
        console.log(`   ✅ PASSED\n`);
        passedTests++;
      } else {
        console.log(`   ❌ FAILED - ${!isRelevant ? 'Irrelevant code generated' : 'Low feature coverage'}\n`);
        failedTests.push({
          name: test.name,
          reason: !isRelevant ? 'Generated irrelevant counter app' : `Low feature coverage (${relevanceScore.toFixed(1)}%)`,
          code: generatedCode.substring(0, 200) + '...'
        });
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ❌ FAILED - API Error: ${error.message}\n`);
      failedTests.push({
        name: test.name,
        reason: `API Error: ${error.message}`,
        code: null
      });
    }
  }

  // Test the specific problematic case
  console.log('🔍 Testing Original Problem Case...\n');
  
  try {
    const problemTest = {
      idea: 'Create a to-do app with user authentication',
      language: 'react',
      platform: 'web',
      usedVoiceInput: false
    };
    
    const response = await axios.post(`${baseURL}/generate-code`, problemTest);
    const code = response.data.code;
    
    const isCounterApp = code.includes('const [count, setCount] = useState(0)');
    const hasTodoFeatures = code.toLowerCase().includes('todo') && code.toLowerCase().includes('auth');
    
    console.log('Original Problem Test:');
    console.log(`   🎯 Generated counter app: ${isCounterApp ? 'YES (BAD)' : 'NO (GOOD)'}`);
    console.log(`   ✅ Has todo + auth features: ${hasTodoFeatures ? 'YES (GOOD)' : 'NO (BAD)'}`);
    
    if (!isCounterApp && hasTodoFeatures) {
      console.log(`   🎉 ORIGINAL PROBLEM FIXED!\n`);
    } else {
      console.log(`   ⚠️  Original problem still exists\n`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error testing original problem: ${error.message}\n`);
  }

  // Performance test
  console.log('⚡ Performance Test...\n');
  
  try {
    const perfTests = [];
    const startTime = Date.now();
    
    // Test 3 concurrent requests
    for (let i = 0; i < 3; i++) {
      perfTests.push(
        axios.post(`${baseURL}/generate-code`, {
          idea: `performance test ${i + 1}`,
          language: 'react',
          platform: 'web',
          usedVoiceInput: false
        }).catch(error => ({ error: error.message }))
      );
    }
    
    const results = await Promise.all(perfTests);
    const totalTime = Date.now() - startTime;
    const successful = results.filter(r => !r.error).length;
    
    console.log(`Performance Results:`);
    console.log(`   ✅ Successful: ${successful}/3`);
    console.log(`   ⏱️  Total time: ${totalTime}ms`);
    console.log(`   📊 Avg per request: ${Math.round(totalTime / 3)}ms\n`);
    
  } catch (error) {
    console.log(`   ❌ Performance test failed: ${error.message}\n`);
  }

  // Summary
  console.log('📋 TEST SUMMARY');
  console.log('================');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name}`);
      console.log(`   Reason: ${test.reason}`);
      if (test.code) {
        console.log(`   Code preview: ${test.code}`);
      }
      console.log('');
    });
  }
  
  // Success criteria
  const successRate = (passedTests / totalTests) * 100;
  
  console.log('\n🎯 SUCCESS CRITERIA:');
  console.log(`✅ Target: 95% accuracy (${successRate >= 95 ? 'MET' : 'NOT MET'})`);
  console.log(`✅ No irrelevant outputs (${failedTests.filter(f => f.reason.includes('irrelevant')).length === 0 ? 'MET' : 'NOT MET'})`);
  console.log(`✅ Production-ready code (${passedTests > 0 ? 'MET' : 'NOT MET'})`);
  
  if (successRate >= 95) {
    console.log('\n🎉 WEB APP CODE GENERATION FIX SUCCESSFUL!');
  } else {
    console.log('\n⚠️  Web app code generation needs further improvement');
  }
}

testWebAppGeneration();