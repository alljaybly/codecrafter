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
    // Debug environment variables
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 20) + '...' : 'undefined'
    });

    if (!supabase) {
      console.log('Supabase not configured - returning empty array');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    console.log('Fetching real-time ideas from Supabase...');
    
    // First, let's try to get a count of all records
    const { count, error: countError } = await supabase
      .from('generated_code')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting count:', countError);
    } else {
      console.log(`Total records in database: ${count}`);
    }
    
    // Fetch real data from Supabase
    const { data, error } = await supabase
      .from('generated_code')
      .select('id, idea, generated_at')
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // If table doesn't exist, provide helpful message
      if (error.message.includes('table') && error.message.includes('generated_code')) {
        console.log('Table generated_code does not exist. Please run database setup.');
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    const ideas = data || [];
    console.log(`Successfully fetched ${ideas.length} real ideas from database`);
    
    if (ideas.length > 0) {
      console.log('Sample idea:', ideas[0]);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(ideas)
    };

  } catch (error) {
    console.error('Error fetching real-time ideas:', error);
    console.error('Error stack:', error.stack);
    
    // Return empty array instead of error to prevent 500s
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }
};