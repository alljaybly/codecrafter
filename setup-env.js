#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 CodeCrafter Environment Setup');
console.log('=================================');

const questions = [
  {
    key: 'SUPABASE_URL',
    question: 'Enter your Supabase Project URL: ',
    example: 'https://your-project.supabase.co'
  },
  {
    key: 'SUPABASE_ANON_KEY',
    question: 'Enter your Supabase Anon Key: ',
    example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
  },
  {
    key: 'REACT_APP_API_URL',
    question: 'Enter your Backend URL (leave empty for localhost): ',
    example: 'https://your-backend.railway.app',
    default: 'http://localhost:3001'
  }
];

let envVars = {};
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    createEnvFiles();
    return;
  }

  const q = questions[currentQuestion];
  console.log(`\nExample: ${q.example}`);
  
  readline.question(q.question, (answer) => {
    envVars[q.key] = answer.trim() || q.default || '';
    currentQuestion++;
    askQuestion();
  });
}

function createEnvFiles() {
  // Create backend .env
  const backendEnv = `# Supabase Configuration
SUPABASE_URL=${envVars.SUPABASE_URL}
SUPABASE_ANON_KEY=${envVars.SUPABASE_ANON_KEY}

# AWS Configuration (optional for now)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# Server Configuration
PORT=3001
NODE_ENV=development
`;

  // Create frontend .env
  const frontendEnv = `# API Configuration
REACT_APP_API_URL=${envVars.REACT_APP_API_URL}
`;

  try {
    fs.writeFileSync('backend/.env', backendEnv);
    console.log('✅ Created backend/.env');
    
    fs.writeFileSync('frontend/.env', frontendEnv);
    console.log('✅ Created frontend/.env');
    
    console.log('\n🎉 Environment files created successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review the .env files and update any missing values');
    console.log('2. For AWS Transcribe, add your AWS credentials to backend/.env');
    console.log('3. Start development: npm run dev (in backend) and npm start (in frontend)');
    console.log('4. For deployment, see quick-deploy.md');
    
  } catch (error) {
    console.error('❌ Error creating environment files:', error.message);
  }
  
  readline.close();
}

console.log('\nThis will help you create .env files for both frontend and backend.');
console.log('You can find these values in your Supabase dashboard (Settings > API).\n');

askQuestion();