exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseUrl: process.env.SUPABASE_URL || 'undefined',
      supabaseKeyLength: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.length : 0
    };

    // Test Supabase import and connection
    let supabaseTest = {};
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseTest.import = 'success';

      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        supabaseTest.clientCreated = 'success';

        // Test a simple query to check connection
        try {
          const { data, error } = await supabase
            .from('generated_code')
            .select('count')
            .limit(1);
          
          if (error) {
            supabaseTest.connectionTest = `error: ${error.message}`;
            supabaseTest.errorCode = error.code;
            supabaseTest.errorDetails = error.details;
          } else {
            supabaseTest.connectionTest = 'success';
            supabaseTest.queryResult = data;
          }
        } catch (queryError) {
          supabaseTest.connectionTest = `query failed: ${queryError.message}`;
        }
      } else {
        supabaseTest.clientCreated = 'skipped - missing env vars';
      }
    } catch (importError) {
      supabaseTest.import = `failed: ${importError.message}`;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'supabase test complete',
        timestamp: new Date().toISOString(),
        environment: envCheck,
        supabase: supabaseTest
      }, null, 2)
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