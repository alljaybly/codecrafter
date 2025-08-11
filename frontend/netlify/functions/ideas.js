const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

exports.handler = async (event) => {
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
    if (!supabase) {
      console.log('Supabase not configured - returning empty array');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    console.log('Fetching real-time ideas from Supabase...');
    
    // Fetch real data from Supabase
    const { data, error } = await supabase
      .from('generated_code')
      .select('id, idea, generated_at')
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    const ideas = data || [];
    console.log(`Successfully fetched ${ideas.length} real ideas from database`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(ideas)
    };

  } catch (error) {
    console.error('Error fetching real-time ideas:', error);
    
    // Return empty array instead of error to prevent 500s
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }
};