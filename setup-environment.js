const fs = require('fs');
const path = require('path');

console.log('🔧 CodeCrafter Environment Setup\n');

// Check if .env file exists
const envPath = '.env';
const envExamplePath = '.env.example';

function createEnvFile() {
    console.log('📝 Setting up environment variables...\n');
    
    if (fs.existsSync(envPath)) {
        console.log('✅ .env file already exists');
        console.log('📖 Current .env contents:');
        console.log(fs.readFileSync(envPath, 'utf8'));
    } else {
        console.log('📄 Creating .env file from template...');
        if (fs.existsSync(envExamplePath)) {
            fs.copyFileSync(envExamplePath, envPath);
            console.log('✅ .env file created');
        } else {
            // Create basic .env file
            const envContent = `# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# Frontend Configuration
REACT_APP_API_URL=/.netlify/functions
`;
            fs.writeFileSync(envPath, envContent);
            console.log('✅ .env file created with template');
        }
    }
}

function checkNetlifyConfig() {
    console.log('\n🌐 Checking Netlify configuration...');
    
    const netlifyTomlPath = 'netlify.toml';
    if (fs.existsSync(netlifyTomlPath)) {
        console.log('✅ netlify.toml exists');
        const content = fs.readFileSync(netlifyTomlPath, 'utf8');
        if (content.includes('[build]') && content.includes('functions')) {
            console.log('✅ Netlify functions configured');
        } else {
            console.log('⚠️  Netlify functions may not be properly configured');
        }
    } else {
        console.log('❌ netlify.toml not found');
    }
}

function checkFunctions() {
    console.log('\n⚡ Checking Netlify functions...');
    
    const functionsDir = 'frontend/netlify/functions';
    if (fs.existsSync(functionsDir)) {
        const functions = fs.readdirSync(functionsDir).filter(f => f.endsWith('.js'));
        console.log(`✅ Found ${functions.length} functions:`);
        functions.forEach(func => {
            console.log(`   - ${func}`);
        });
    } else {
        console.log('❌ Functions directory not found');
    }
}

function checkDatabase() {
    console.log('\n🗄️  Checking database setup files...');
    
    const dbFiles = [
        'database/supabase-complete-setup.sql',
        'database/supabase-fixed-complete-setup.sql',
        'SUPABASE-SETUP-GUIDE.md'
    ];
    
    dbFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} exists`);
        } else {
            console.log(`❌ ${file} missing`);
        }
    });
}

function showNextSteps() {
    console.log('\n🎯 NEXT STEPS TO COMPLETE SETUP:\n');
    
    console.log('1. 🗄️  SET UP SUPABASE:');
    console.log('   - Go to https://supabase.com');
    console.log('   - Create a new project');
    console.log('   - Get your Project URL and anon key');
    console.log('   - Run the SQL setup script in Supabase SQL Editor');
    console.log('');
    
    console.log('2. 📝 UPDATE ENVIRONMENT VARIABLES:');
    console.log('   - Edit the .env file');
    console.log('   - Replace placeholder values with real Supabase credentials');
    console.log('   - Example:');
    console.log('     SUPABASE_URL=https://abcdefgh.supabase.co');
    console.log('     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    console.log('');
    
    console.log('3. 🚀 DEPLOY TO NETLIFY:');
    console.log('   - Connect your GitHub repo to Netlify');
    console.log('   - Set environment variables in Netlify dashboard');
    console.log('   - Deploy the site');
    console.log('');
    
    console.log('4. ✅ TEST THE SYSTEM:');
    console.log('   - Run: node final-complete-verification.js');
    console.log('   - All tests should pass');
    console.log('');
    
    console.log('📚 For detailed instructions, see:');
    console.log('   - SUPABASE-SETUP-GUIDE.md');
    console.log('   - DEPLOY-NOW.md');
}

// Run setup checks
createEnvFile();
checkNetlifyConfig();
checkFunctions();
checkDatabase();
showNextSteps();

console.log('\n🎉 Environment setup check complete!');
console.log('Follow the next steps above to finish configuration.');