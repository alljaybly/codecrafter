#!/usr/bin/env node

const https = require('https');

async function testFunction(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CodeCrafter-Test/1.0'
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

async function runTests(baseUrl) {
  console.log('🧪 Testing Netlify Functions');
  console.log('============================');
  console.log(`Base URL: ${baseUrl}`);
  
  const tests = [
    {
      name: 'Health Check',
      url: `${baseUrl}/.netlify/functions/health`,
      method: 'GET'
    },
    {
      name: 'Environment Test',
      url: `${baseUrl}/.netlify/functions/test`,
      method: 'GET'
    },
    {
      name: 'Simple Code Generation',
      url: `${baseUrl}/.netlify/functions/generate-code-simple`,
      method: 'POST',
      data: { idea: 'Create a test app' }
    },
    {
      name: 'Original Code Generation',
      url: `${baseUrl}/.netlify/functions/generate-code`,
      method: 'POST',
      data: { idea: 'Create a test app' }
    }
  ];

  for (const test of tests) {
    console.log(`\n🔍 Testing: ${test.name}`);
    try {
      const result = await testFunction(test.url, test.method, test.data);
      
      if (result.status === 200) {
        console.log(`✅ SUCCESS (${result.status})`);
        try {
          const json = JSON.parse(result.body);
          console.log(`   Response: ${JSON.stringify(json, null, 2).substring(0, 200)}...`);
        } catch {
          console.log(`   Response: ${result.body.substring(0, 100)}...`);
        }
      } else if (result.status === 404) {
        console.log(`❌ NOT FOUND (${result.status}) - Function not deployed`);
      } else {
        console.log(`⚠️  ERROR (${result.status})`);
        console.log(`   Response: ${result.body.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('- If all tests show 404: Functions not deployed properly');
  console.log('- If health/test work but generate-code fails: Environment/database issue');
  console.log('- If simple works but original fails: Supabase connection issue');
}

// Get URL from command line or prompt
const url = process.argv[2];
if (url) {
  runTests(url);
} else {
  console.log('Usage: node test-functions.js https://your-site.netlify.app');
  console.log('Example: node test-functions.js https://codecrafter-web.netlify.app');
}