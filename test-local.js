#!/usr/bin/env node

const axios = require('axios');

async function testLocalSetup() {
  console.log('🧪 Testing CodeCrafter Local Setup...\n');

  // Test 1: Check if backend is running
  try {
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Backend is healthy:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend not running. Start it with: cd backend && node server.js');
    return;
  }

  // Test 2: Test code generation endpoint
  try {
    console.log('\n2. Testing code generation...');
    const codeResponse = await axios.post('http://localhost:3001/generate-code', {
      idea: 'Create a simple todo app'
    });
    console.log('✅ Code generation working');
    console.log('Generated code preview:', codeResponse.data.code.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Code generation failed:', error.response?.data || error.message);
  }

  // Test 3: Test transcription endpoint
  try {
    console.log('\n3. Testing transcription...');
    const transcribeResponse = await axios.post('http://localhost:3001/transcribe', {
      audio: 'mock_audio_data'
    });
    console.log('✅ Transcription working:', transcribeResponse.data);
  } catch (error) {
    console.log('❌ Transcription failed:', error.response?.data || error.message);
  }

  console.log('\n🎉 Local testing complete!');
  console.log('\nNext steps:');
  console.log('1. Start frontend: cd frontend && npm start');
  console.log('2. Visit http://localhost:3000 to test the full app');
  console.log('3. Configure your .env files with real Supabase/AWS credentials');
}

testLocalSetup().catch(console.error);