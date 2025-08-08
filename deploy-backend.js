#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CodeCrafter Backend Deployment Helper');
console.log('=========================================');

// Check if we're in the right directory
if (!fs.existsSync('backend/package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check for Railway CLI
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI found');
} catch (error) {
  console.log('📦 Installing Railway CLI...');
  try {
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    console.log('✅ Railway CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Railway CLI. Please install manually:');
    console.error('   npm install -g @railway/cli');
    process.exit(1);
  }
}

console.log('\n📋 Deployment Steps:');
console.log('1. Make sure you have a Railway account at https://railway.app');
console.log('2. Login to Railway: railway login');
console.log('3. Navigate to backend: cd backend');
console.log('4. Initialize project: railway init');
console.log('5. Deploy: railway up');
console.log('6. Set environment variables in Railway dashboard');

console.log('\n🔧 Required Environment Variables:');
console.log('SUPABASE_URL=your_supabase_project_url');
console.log('SUPABASE_ANON_KEY=your_supabase_anon_key');
console.log('PORT=3001');

console.log('\n💡 After deployment, your backend will be available at:');
console.log('https://your-project-name.railway.app');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\nWould you like to start the deployment process? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Starting deployment...');
    
    try {
      // Check if user is logged in
      execSync('railway whoami', { stdio: 'ignore' });
      console.log('✅ Already logged in to Railway');
    } catch (error) {
      console.log('🔐 Please login to Railway...');
      execSync('railway login', { stdio: 'inherit' });
    }
    
    // Navigate to backend and deploy
    process.chdir('backend');
    console.log('📁 Changed to backend directory');
    
    try {
      console.log('🚀 Initializing Railway project...');
      execSync('railway init', { stdio: 'inherit' });
      
      console.log('📦 Deploying to Railway...');
      execSync('railway up', { stdio: 'inherit' });
      
      console.log('\n✅ Deployment complete!');
      console.log('🔧 Don\'t forget to set your environment variables in the Railway dashboard');
      console.log('🌐 Your backend URL will be shown in the Railway dashboard');
      
    } catch (deployError) {
      console.error('❌ Deployment failed:', deployError.message);
      console.log('\n💡 Try deploying manually:');
      console.log('1. cd backend');
      console.log('2. railway init');
      console.log('3. railway up');
    }
  } else {
    console.log('👍 No problem! You can deploy manually later.');
  }
  
  readline.close();
});