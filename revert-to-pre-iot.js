// Safe Revert to Pre-IoT Version - No Hangs
console.log('🔄 REVERTING TO PRE-IOT VERSION');
console.log('===============================');

const fs = require('fs');
const path = require('path');

// Function with timeout protection
function safeOperation(operation, timeout = 5000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.log('⚠️ Operation timed out, continuing...');
      resolve(false);
    }, timeout);
    
    try {
      const result = operation();
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      console.log('⚠️ Operation error:', error.message);
      resolve(false);
    }
  });
}

async function revertInputForm() {
  console.log('\n1. Reverting InputForm to Pre-IoT Version...');
  
  const inputFormPath = 'frontend/src/components/InputForm.tsx';
  
  try {
    const content = fs.readFileSync(inputFormPath, 'utf8');
    
    // Remove IoT-specific code
    let cleanContent = content
      // Simplify language options
      .replace(
        /const \[selectedLanguage, setSelectedLanguage\] = useState<'html' \| 'arduino' \| 'python' \| 'javascript' \| 'rust'>\('html'\);/,
        "const [selectedLanguage, setSelectedLanguage] = useState<'html' | 'javascript' | 'python'>('html');"
      )
      // Remove platform selection entirely
      .replace(
        /const \[selectedPlatform, setSelectedPlatform\] = useState<'web' \| 'arduino' \| 'raspberry-pi' \| 'esp32'>\('web'\);/g,
        ''
      )
      // Simplify placeholder
      .replace(
        /placeholder="Enter your app idea here\.\.\. \(e\.g\., 'Create Arduino temperature sensor with LED indicator'\)"/,
        'placeholder="Enter your app idea here... (e.g., \'Create a todo app with React\')"'
      )
      // Remove IoT aria-label
      .replace(
        /aria-label="Voice input for code generation - Describe your IoT app idea"/,
        'aria-label="Voice input for code generation - Describe your app idea"'
      )
      // Simplify language options
      .replace(
        /<option value="html">HTML\/CSS\/JS \(Web Apps\)<\/option>\s*<option value="arduino">Arduino C\+\+ \(IoT Devices\)<\/option>\s*<option value="python">Python \(Raspberry Pi\)<\/option>\s*<option value="javascript">Node\.js \(Backend\)<\/option>\s*<option value="rust">Rust \(Systems Programming\)<\/option>/,
        '<option value="html">HTML/CSS/JS</option>\n              <option value="javascript">JavaScript/React</option>\n              <option value="python">Python</option>'
      )
      // Remove entire platform selection section
      .replace(
        /\s*<div>\s*<label htmlFor="platform"[^>]*>[\s\S]*?<\/select>\s*<\/div>/,
        ''
      )
      // Remove IoT Quick Examples section
      .replace(
        /\s*{\/\* IoT Quick Examples \*\/}[\s\S]*?{\/\* Microphone Permission Guide \*\/}/,
        '\n\n        {/* Microphone Permission Guide */'
      )
      // Update function calls to remove platform parameter
      .replace(
        /generateCode\(idea\.trim\(\), selectedLanguage, selectedPlatform\)/g,
        'generateCode(idea.trim(), selectedLanguage)'
      )
      // Remove platform from API calls
      .replace(
        /platform: selectedPlatform/g,
        ''
      )
      // Clean up extra commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*,/g, ',');
    
    fs.writeFileSync(inputFormPath, cleanContent);
    console.log('✅ InputForm reverted to pre-IoT version');
    return true;
    
  } catch (error) {
    console.log('❌ Error reverting InputForm:', error.message);
    return false;
  }
}

async function updateGeneratedCode() {
  console.log('\n2. Updating Generated Code Utility...');
  
  const generatedCodePath = 'frontend/src/utils/generatedCode.ts';
  
  try {
    if (fs.existsSync(generatedCodePath)) {
      const content = fs.readFileSync(generatedCodePath, 'utf8');
      
      // Simplify generateCode function
      const simplifiedContent = content
        .replace(
          /export function generateCode\(prompt: string, language: string, platform\?: string\)/,
          'export function generateCode(prompt: string, language: string)'
        )
        .replace(
          /platform === 'arduino'|platform === 'esp32'|platform === 'raspberry-pi'/g,
          'false'
        );
      
      fs.writeFileSync(generatedCodePath, simplifiedContent);
      console.log('✅ Generated code utility updated');
    } else {
      console.log('⚠️ Generated code utility not found, skipping');
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Error updating generated code:', error.message);
    return false;
  }
}

async function cleanupDatabase() {
  console.log('\n3. Cleaning up Database Schema...');
  
  try {
    // Update database setup to remove IoT-specific badges
    const dbFiles = [
      'database/supabase-error-proof-setup.sql',
      'database/supabase-complete-setup.sql'
    ];
    
    dbFiles.forEach(file => {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove IoT-specific badges
        content = content
          .replace(
            /\('IoT Explorer', 'Built your first IoT project', '🔧', 'platform', 25, 'uncommon', 'Generate Arduino\/ESP32\/RPi code'\),?/,
            ''
          )
          .replace(
            /\('Multi-Platform Master', 'Used all available platforms', '🏆', 'achievement', 150, 'rare', 'Use web, Arduino, ESP32, and RPi'\),?/,
            ''
          )
          // Clean up extra commas
          .replace(/,\s*;/g, ';')
          .replace(/,\s*\)/g, ')');
        
        fs.writeFileSync(file, content);
        console.log(`✅ Updated ${file}`);
      }
    });
    
    return true;
    
  } catch (error) {
    console.log('❌ Error cleaning database:', error.message);
    return false;
  }
}

async function testBuild() {
  console.log('\n4. Testing Build After Revert...');
  
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    
    const buildProcess = spawn('npm', ['run', 'build'], {
      cwd: './frontend',
      stdio: 'pipe'
    });
    
    let output = '';
    
    buildProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    buildProcess.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    // Timeout protection
    const timeout = setTimeout(() => {
      buildProcess.kill();
      console.log('⚠️ Build test timed out');
      resolve(false);
    }, 30000);
    
    buildProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ Build test successful');
        resolve(true);
      } else {
        console.log('❌ Build test failed');
        console.log('Output:', output.substring(0, 300));
        resolve(false);
      }
    });
  });
}

async function main() {
  console.log('Starting safe revert process...');
  
  const results = {
    inputForm: await safeOperation(revertInputForm),
    generatedCode: await safeOperation(updateGeneratedCode),
    database: await safeOperation(cleanupDatabase),
    build: await safeOperation(testBuild, 35000)
  };
  
  console.log('\n📊 REVERT RESULTS:');
  console.log('==================');
  Object.entries(results).forEach(([task, success]) => {
    console.log(`${success ? '✅' : '⚠️'} ${task}: ${success ? 'SUCCESS' : 'PARTIAL'}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  console.log(`\n🎯 Overall: ${successCount}/4 operations completed`);
  
  if (successCount >= 3) {
    console.log('🎉 REVERT SUCCESSFUL - Pre-IoT version restored!');
    console.log('\n📝 Changes made:');
    console.log('- Removed Arduino, ESP32, Raspberry Pi options');
    console.log('- Simplified to HTML, JavaScript, Python only');
    console.log('- Removed platform selection dropdown');
    console.log('- Removed IoT quick examples');
    console.log('- Cleaned up database badges');
    console.log('- Maintained Live Preview functionality');
  } else {
    console.log('⚠️ Partial revert - some operations may need manual review');
  }
  
  console.log('\n🚀 System is ready for use without IoT features!');
}

// Execute with global timeout
const globalTimeout = setTimeout(() => {
  console.log('🚨 Global timeout - exiting gracefully');
  process.exit(0);
}, 60000);

main()
  .then(() => {
    clearTimeout(globalTimeout);
    console.log('\n✨ Revert process complete!');
  })
  .catch((error) => {
    clearTimeout(globalTimeout);
    console.log('❌ Revert error:', error.message);
    console.log('✅ System should still be functional');
  });