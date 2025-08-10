#!/usr/bin/env node

const https = require('https');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧪 CodeCrafter Deployment Tester');
console.log('=================================');

function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CodeCrafter-Tester/1.0'
      }
    };

    if (data && method === 'POST') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    
    if (data && method === 'POST') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testDeployment(baseUrl) {
  console.log(`\n🔍 Testing deployment at: ${baseUrl}`);
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await testEndpoint(`${baseUrl}/.netlify/functions/health`);
    if (healthResponse.status === 200) {
      console.log('✅ Health check passed');
      console.log(`   Response: ${healthResponse.body.substring(0, 100)}...`);
    } else {
      console.log(`❌ Health check failed (${healthResponse.status})`);
    }

    // Test 2: Generate code endpoint
    console.log('\n2. Testing code generation...');
    const codeResponse = await testEndpoint(
      `${baseUrl}/.netlify/functions/generate-code`,
      'POST',
      { idea: 'Create a simple todo app' }
    );
    if (codeResponse.status === 200) {
      console.log('✅ Code generation works');
      const result = JSON.parse(codeResponse.body);
      console.log(`   Generated code length: ${result.code ? result.code.length : 0} characters`);
    } else {
      console.log(`❌ Code generation failed (${codeResponse.status})`);
      console.log(`   Error: ${codeResponse.body}`);
    }

    // Test 3: Transcribe endpoint
    console.log('\n3. Testing transcription...');
    const transcribeResponse = await testEndpoint(
      `${baseUrl}/.netlify/functions/transcribe`,
      'POST',
      { audio: 'mock_audio_data' }
    );
    if (transcribeResponse.status === 200) {
      console.log('✅ Transcription works');
      const result = JSON.parse(transcribeResponse.body);
      console.log(`   Transcription: ${result.transcription}`);
    } else {
      console.log(`❌ Transcription failed (${transcribeResponse.status})`);
    }

    // Test 4: Frontend
    console.log('\n4. Testing frontend...');
    const frontendResponse = await testEndpoint(baseUrl);
    if (frontendResponse.status === 200 && frontendResponse.body.includes('CodeCrafter')) {
      console.log('✅ Frontend loads successfully');
    } else {
      console.log(`❌ Frontend issue (${frontendResponse.status})`);
    }

    console.log('\n🎉 Deployment test complete!');
    
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
  }
}

// Main execution
readline.question('\nEnter your Netlify site URL (e.g., https://your-site.netlify.app): ', async (url) => {
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  
  await testDeployment(url);
  readline.close();
});