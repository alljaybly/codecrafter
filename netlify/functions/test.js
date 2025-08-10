exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Test environment variables
    const envTest = {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseUrlLength: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.length : 0,
      supabaseKeyLength: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.length : 0,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
    };

    // Test Supabase import
    let supabaseTest = 'not tested';
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseTest = 'import successful';
      
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        supabaseTest = 'client created successfully';
      }
    } catch (error) {
      supabaseTest = `import failed: ${error.message}`;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'test successful',
        timestamp: new Date().toISOString(),
        environment: envTest,
        supabase: supabaseTest,
        event: {
          httpMethod: event.httpMethod,
          hasBody: !!event.body
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test function failed',
        message: error.message,
        stack: error.stack
      })
    };
  }
};