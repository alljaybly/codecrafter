// Try to import Supabase, but don't fail if it's not available
let supabase = null;
let createClient = null;

try {
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
  
  // Only create Supabase client if environment variables are available
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }
} catch (error) {
  console.log('Supabase not available:', error.message);
}

// No mock data - only real data from Supabase

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Only fetch real data from Supabase - no mock data
    if (!supabase) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Database not configured',
          message: 'Supabase connection not available'
        })
      };
    }

    const { data, error } = await supabase
      .from('generated_code')
      .select('id, idea, generated_at')
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database query failed',
          message: error.message
        })
      };
    }

    // Return actual data from database (could be empty array)
    const ideas = data || [];
    console.log(`Returning ${ideas.length} real ideas from database`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(ideas)
    };

  } catch (error) {
    console.error('Error fetching ideas:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};