const { createClient } = require('@supabase/supabase-js');

// Test configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🚀 Starting Comprehensive CodeCrafter Test Suite');
console.log('================================================');

async function testSupabaseConnection() {
  console.log('\n1. Testing Supabase Connection...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('ideas').select('count').limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
    return false;
  }
}

async function testCodeGeneration() {
  console.log('\n2. Testing Code Generation...');
  try {
    const testPrompt = "Create a simple React button component";
    
    // Test local generation first
    const response = await fetch('http://localhost:8888/.netlify/functions/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: testPrompt })
    });
    
    if (!response.ok) {
      console.log('❌ Code generation failed:', response.status);
      return false;
    }
    
    const result = await response.json();
    if (result.code && result.code.length > 0) {
      console.log('✅ Code generation successful');
      console.log('Generated code preview:', result.code.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ No code generated');
      return false;
    }
  } catch (error) {
    console.log('❌ Code generation error:', error.message);
    return false;
  }
}

async function testBadgeSystem() {
  console.log('\n3. Testing Badge System...');
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/badges', {
      method: 'GET'
    });
    
    if (!response.ok) {
      console.log('❌ Badge system failed:', response.status);
      return false;
    }
    
    const badges = await response.json();
    console.log('✅ Badge system working');
    console.log('Available badges:', badges.length);
    return true;
  } catch (error) {
    console.log('❌ Badge system error:', error.message);
    return false;
  }
}

async function testBadgeLibrary() {
  console.log('\n4. Testing Badge Library...');
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/badge-library', {
      method: 'GET'
    });
    
    if (!response.ok) {
      console.log('❌ Badge library failed:', response.status);
      return false;
    }
    
    const library = await response.json();
    console.log('✅ Badge library working');
    console.log('Library entries:', library.length);
    return true;
  } catch (error) {
    console.log('❌ Badge library error:', error.message);
    return false;
  }
}

async function testFrontendBuild() {
  console.log('\n5. Testing Frontend Build...');
  try {
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: './frontend',
        stdio: 'pipe'
      });
      
      let output = '';
      buildProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      buildProcess.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Frontend build successful');
          resolve(true);
        } else {
          console.log('❌ Frontend build failed');
          console.log('Build output:', output.substring(0, 500));
          resolve(false);
        }
      });
      
      // Timeout after 60 seconds
      setTimeout(() => {
        buildProcess.kill();
        console.log('❌ Frontend build timed out');
        resolve(false);
      }, 60000);
    });
  } catch (error) {
    console.log('❌ Frontend build error:', error.message);
    return false;
  }
}

async function testLivePreview() {
  console.log('\n6. Testing Live Preview Component...');
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check if LivePreview component exists
    const livePreviewPath = path.join(__dirname, 'frontend/src/components/LivePreview.tsx');
    if (!fs.existsSync(livePreviewPath)) {
      console.log('❌ LivePreview component not found');
      return false;
    }
    
    // Check if it's imported in InputForm
    const inputFormPath = path.join(__dirname, 'frontend/src/components/InputForm.tsx');
    const inputFormContent = fs.readFileSync(inputFormPath, 'utf8');
    
    if (!inputFormContent.includes('LivePreview')) {
      console.log('❌ LivePreview not imported in InputForm');
      return false;
    }
    
    console.log('✅ Live Preview component integrated');
    return true;
  } catch (error) {
    console.log('❌ Live Preview test error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('Starting comprehensive test suite...\n');
  
  const results = {
    supabase: await testSupabaseConnection(),
    codeGeneration: await testCodeGeneration(),
    badgeSystem: await testBadgeSystem(),
    badgeLibrary: await testBadgeLibrary(),
    frontendBuild: await testFrontendBuild(),
    livePreview: await testLivePreview()
  };
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED! System is ready for deployment.');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
  }
  
  return results;
}

// Run tests
runAllTests().catch(console.error);