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
    console.log('Badges API - Environment check:', {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 20) + '...' : 'undefined'
    });

    if (!supabase) {
      console.log('Supabase not configured - returning empty badges array');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    console.log('Fetching real-time badges from Supabase...');
    
    // First, let's try to get a count of all badge records
    const { count, error: countError } = await supabase
      .from('badges')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting badges count:', countError);
    } else {
      console.log(`Total badge records in database: ${count}`);
    }
    
    // Fetch real badge data from Supabase
    const { data, error } = await supabase
      .from('badges')
      .select('id, user_id, badge_name, awarded_at')
      .order('awarded_at', { ascending: false });

    if (error) {
      console.error('Supabase badges query error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // If table doesn't exist, provide helpful message
      if (error.message.includes('table') && error.message.includes('badges')) {
        console.log('Table badges does not exist. Please run database setup.');
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    const badges = data || [];
    console.log(`Successfully fetched ${badges.length} real badges from database`);
    
    if (badges.length > 0) {
      console.log('Sample badge:', badges[0]);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(badges)
    };

  } catch (error) {
    console.error('Error fetching real-time badges:', error);
    console.error('Error stack:', error.stack);
    
    // Return empty array instead of error to prevent 500s
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }
};