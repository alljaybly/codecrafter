#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CodeCrafter Netlify Deployment');
console.log('==================================');

// Check if we're in the right directory
if (!fs.existsSync('frontend/package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

console.log('📦 Building frontend...');
try {
  process.chdir('frontend');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend built successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Go back to root
process.chdir('..');

console.log('\n🎉 Build Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Go to https://netlify.com');
console.log('2. Drag the frontend/build folder to deploy');
console.log('3. Or connect your Git repository for auto-deploy');
console.log('4. Add environment variables in Netlify dashboard:');
console.log('   - SUPABASE_URL');
console.log('   - SUPABASE_ANON_KEY');

console.log('\n🔗 Your build is ready in: frontend/build/');
console.log('📖 See NETLIFY-DEPLOY.md for detailed instructions');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\nWould you like to open the build folder? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    try {
      const buildPath = path.resolve('frontend', 'build');
      execSync(`explorer "${buildPath}"`, { stdio: 'ignore' });
      console.log('📁 Build folder opened');
    } catch (error) {
      console.log('📁 Build folder location: frontend/build/');
    }
  }
  
  console.log('\n🌐 Ready to deploy to Netlify!');
  readline.close();
});