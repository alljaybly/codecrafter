const fs = require('fs');
const path = require('path');

console.log('🔍 Quick System Check');
console.log('====================');

// Check if key files exist
const keyFiles = [
  'frontend/src/components/LivePreview.tsx',
  'frontend/src/components/InputForm.tsx',
  'frontend/netlify/functions/generate-code.js',
  'frontend/netlify/functions/badges.js',
  'frontend/netlify/functions/badge-library.js',
  'database/badge-library-setup.sql'
];

console.log('\n📁 File Existence Check:');
keyFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Check LivePreview integration
console.log('\n🔗 LivePreview Integration Check:');
try {
  const inputFormPath = 'frontend/src/components/InputForm.tsx';
  if (fs.existsSync(inputFormPath)) {
    const content = fs.readFileSync(inputFormPath, 'utf8');
    const hasImport = content.includes("import LivePreview from './LivePreview'");
    const hasUsage = content.includes('<LivePreview');
    
    console.log(`${hasImport ? '✅' : '❌'} LivePreview imported`);
    console.log(`${hasUsage ? '✅' : '❌'} LivePreview used in JSX`);
  }
} catch (error) {
  console.log('❌ Error checking LivePreview integration:', error.message);
}

// Check package.json
console.log('\n📦 Package Configuration:');
try {
  const packagePath = 'frontend/package.json';
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('✅ Frontend package.json exists');
    console.log('Dependencies:', Object.keys(pkg.dependencies || {}).length);
    console.log('DevDependencies:', Object.keys(pkg.devDependencies || {}).length);
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check environment setup
console.log('\n🌍 Environment Check:');
const envFiles = ['.env', '.env.example', 'frontend/.env'];
envFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n✨ System check complete!');