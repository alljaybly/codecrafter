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
    // Test 2: Check if Netlify function is accessible
    console.log('\n2. Testing Netlify function...');
    const functionResponse = await axios.post(`${baseUrl}/.netlify/functions/generate-code`, {
      idea: 'Create a simple counter app'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (functionResponse.status === 200 && functionResponse.data.code) {
      console.log('✅ Netlify function is working');
      console.log('Generated code preview:', functionResponse.data.code.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Netlify function failed:', error.response?.data || error.message);
    console.log('💡 Make sure to set environment variables in Netlify dashboard:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY');
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