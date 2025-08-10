#!/usr/bin/env node

const axios = require('axios');

async function verifyDeployment(baseUrl) {
  console.log(`🔍 Verifying CodeCrafter deployment at: ${baseUrl}\n`);

  try {
    // Test 1: Check if the main site loads
    console.log('1. Testing main site...');
    const siteResponse = await axios.get(baseUrl);
    if (siteResponse.status === 200) {
      console.log('✅ Main site is accessible');
    }
  } catch (error) {
    console.log('❌ Main site failed:', error.message);
    return;
  }

  try {
    // Test 2: Check if Netlify functions are accessible
    console.log('\n2. Testing Netlify function health...');
    const healthResponse = await axios.get(`${baseUrl}/.netlify/functions/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Netlify functions are accessible');
      console.log('Environment:', healthResponse.data.environment);
    }
  } catch (error) {
    console.log('❌ Netlify functions not accessible:', error.message);
    return;
  }

  try {
    // Test 3: Check code generation function
    console.log('\n3. Testing code generation...');
    const functionResponse = await axios.post(`${baseUrl}/.netlify/functions/generate-code`, {
      idea: 'Create a simple counter app'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (functionResponse.status === 200 && functionResponse.data.code) {
      console.log('✅ Code generation is working');
      console.log('Generated code preview:', functionResponse.data.code.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Code generation failed:', error.response?.data || error.message);
    console.log('💡 This might work anyway - check the function logs in Netlify dashboard');
  }

  console.log('\n🎉 Deployment verification complete!');
  console.log('\nIf functions failed, check:');
  console.log('1. Environment variables are set in Netlify dashboard');
  console.log('2. Supabase database is set up with the schema from database/setup.sql');
  console.log('3. Function logs in Netlify dashboard for detailed errors');
}

// Usage: node verify-deployment.js https://your-site.netlify.app
const url = process.argv[2];
if (!url) {
  console.log('Usage: node verify-deployment.js <netlify-url>');
  console.log('Example: node verify-deployment.js https://codecrafter.netlify.app');
  process.exit(1);
}

verifyDeployment(url).catch(console.error);