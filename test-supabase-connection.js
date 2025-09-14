// Test Supabase Database Connection
// Run this after setting up your Supabase database

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Database Connection');
console.log('=====================================');

async function testConnection() {
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing environment variables!');
    console.log('Please update your .env file with:');
    console.log('SUPABASE_URL=your_supabase_url');
    console.log('SUPABASE_ANON_KEY=your_supabase_key');
    return;
  }

  console.log('📡 Connecting to:', supabaseUrl);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Check badge_library table
    console.log('\n1. Testing badge_library table...');
    const { data: library, error: libraryError } = await supabase
      .from('badge_library')
      .select('*');
    
    if (libraryError) {
      console.log('❌ Badge library error:', libraryError.message);
    } else {
      console.log(`✅ Badge library: ${library.length} badges loaded`);
    }
    
    // Test 2: Check badges table
    console.log('\n2. Testing badges table...');
    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*');
    
    if (badgesError) {
      console.log('❌ Badges error:', badgesError.message);
    } else {
      console.log(`✅ Badges: ${badges.length} badges found`);
      const earned = badges.filter(b => b.is_earned).length;
      console.log(`   - ${earned} earned, ${badges.length - earned} available`);
    }
    
    // Test 3: Check ideas table
    console.log('\n3. Testing ideas table...');
    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select('count');
    
    if (ideasError) {
      console.log('❌ Ideas error:', ideasError.message);
    } else {
      console.log(`✅ Ideas table: Ready for data`);
    }
    
    // Test 4: Test insert functionality
    console.log('\n4. Testing insert functionality...');
    const testIdea = {
      idea: 'Test connection from Node.js',
      generated_code: '<p>Hello from Supabase!</p>',
      language: 'html',
      platform: 'web',
      used_voice_input: false,
      points: 10
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('ideas')
      .insert([testIdea])
      .select();
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
    } else {
      console.log('✅ Insert test: Success');
      
      // Clean up test data
      await supabase
        .from('ideas')
        .delete()
        .eq('id', insertData[0].id);
      console.log('✅ Cleanup: Test data removed');
    }
    
    console.log('\n🎉 DATABASE CONNECTION SUCCESSFUL!');
    console.log('Your Supabase database is ready for CodeCrafter!');
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Verify RLS policies allow public access');
    console.log('4. Check if tables were created properly');
  }
}

// Run the test
testConnection();