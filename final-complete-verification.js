const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const NETLIFY_URL = process.env.NETLIFY_URL || 'https://your-site.netlify.app';

console.log('🔍 Starting Complete System Verification...\n');

async function verifySupabaseConnection() {
    console.log('1. Testing Supabase Connection...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Test basic connection
        const { data, error } = await supabase.from('ideas').select('count').limit(1);
        
        if (error) {
            console.log('❌ Supabase connection failed:', error.message);
            return false;
        }
        
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.log('❌ Supabase connection error:', error.message);
        return false;
    }
}

async function verifyDatabaseTables() {
    console.log('\n2. Verifying Database Tables...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Check ideas table
        const { data: ideasData, error: ideasError } = await supabase
            .from('ideas')
            .select('*')
            .limit(1);
            
        if (ideasError) {
            console.log('❌ Ideas table error:', ideasError.message);
            return false;
        }
        
        // Check badges table
        const { data: badgesData, error: badgesError } = await supabase
            .from('badges')
            .select('*')
            .limit(1);
            
        if (badgesError) {
            console.log('❌ Badges table error:', badgesError.message);
            return false;
        }
        
        console.log('✅ Database tables verified');
        return true;
    } catch (error) {
        console.log('❌ Database verification error:', error.message);
        return false;
    }
}

async function verifyNetlifyFunctions() {
    console.log('\n3. Testing Netlify Functions...');
    
    const functions = [
        '/api/health',
        '/api/generate-code',
        '/api/ideas',
        '/api/badges'
    ];
    
    let allWorking = true;
    
    for (const func of functions) {
        try {
            const response = await fetch(`${NETLIFY_URL}/.netlify/functions${func}`, {
                method: 'GET',
                timeout: 10000
            });
            
            if (response.ok) {
                console.log(`✅ ${func} - Working`);
            } else {
                console.log(`❌ ${func} - Status: ${response.status}`);
                allWorking = false;
            }
        } catch (error) {
            console.log(`❌ ${func} - Error: ${error.message}`);
            allWorking = false;
        }
    }
    
    return allWorking;
}

async function testCodeGeneration() {
    console.log('\n4. Testing Code Generation...');
    try {
        const response = await fetch(`${NETLIFY_URL}/.netlify/functions/generate-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idea: 'Simple calculator app',
                type: 'web'
            }),
            timeout: 30000
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.html && data.css && data.js) {
                console.log('✅ Code generation working');
                return true;
            } else {
                console.log('❌ Code generation incomplete response');
                return false;
            }
        } else {
            console.log('❌ Code generation failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Code generation error:', error.message);
        return false;
    }
}

async function testIdeaStorage() {
    console.log('\n5. Testing Idea Storage...');
    try {
        const testIdea = {
            title: 'Test Idea ' + Date.now(),
            description: 'Test description',
            type: 'web',
            generated_code: JSON.stringify({
                html: '<div>Test</div>',
                css: 'body { margin: 0; }',
                js: 'console.log("test");'
            })
        };
        
        const response = await fetch(`${NETLIFY_URL}/.netlify/functions/ideas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testIdea),
            timeout: 10000
        });
        
        if (response.ok) {
            console.log('✅ Idea storage working');
            return true;
        } else {
            console.log('❌ Idea storage failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Idea storage error:', error.message);
        return false;
    }
}

async function testBadgeSystem() {
    console.log('\n6. Testing Badge System...');
    try {
        const response = await fetch(`${NETLIFY_URL}/.netlify/functions/badges`, {
            method: 'GET',
            timeout: 10000
        });
        
        if (response.ok) {
            const badges = await response.json();
            console.log('✅ Badge system working');
            console.log(`   Found ${badges.length} badges`);
            return true;
        } else {
            console.log('❌ Badge system failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Badge system error:', error.message);
        return false;
    }
}

async function runCompleteVerification() {
    console.log('🚀 CodeCrafter System Verification\n');
    console.log('Configuration:');
    console.log(`- Supabase URL: ${SUPABASE_URL}`);
    console.log(`- Netlify URL: ${NETLIFY_URL}`);
    console.log('');
    
    const results = {
        supabase: await verifySupabaseConnection(),
        database: await verifyDatabaseTables(),
        functions: await verifyNetlifyFunctions(),
        generation: await testCodeGeneration(),
        storage: await testIdeaStorage(),
        badges: await testBadgeSystem()
    };
    
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log('========================');
    
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    const allPassed = Object.values(results).every(result => result);
    
    console.log('\n🎯 OVERALL STATUS:');
    console.log(`${allPassed ? '✅ ALL SYSTEMS OPERATIONAL' : '❌ ISSUES DETECTED'}`);
    
    if (!allPassed) {
        console.log('\n🔧 NEXT STEPS:');
        console.log('1. Check environment variables are set correctly');
        console.log('2. Verify Supabase project is active');
        console.log('3. Ensure Netlify deployment is complete');
        console.log('4. Check function logs for specific errors');
    } else {
        console.log('\n🎉 System is ready for use!');
        console.log('Visit your Netlify URL to start using CodeCrafter');
    }
    
    return allPassed;
}

// Run verification
runCompleteVerification()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    });