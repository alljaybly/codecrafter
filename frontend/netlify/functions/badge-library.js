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
    console.log('Badge Library API - Environment check:', {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY
    });

    if (!supabase) {
      console.log('Supabase not configured - returning empty badge library');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          badges: [],
          userBadges: [],
          stats: {
            totalBadges: 0,
            earnedBadges: 0,
            totalPoints: 0,
            completionPercentage: 0
          }
        })
      };
    }

    console.log('Fetching badge library from Supabase...');
    
    // Fetch all badges
    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .order('rarity', { ascending: false })
      .order('points', { ascending: false });

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      throw badgesError;
    }

    // Fetch user badges with badge details
    const { data: userBadges, error: userBadgesError } = await supabase
      .from('user_badges')
      .select(`
        id,
        user_id,
        badge_id,
        awarded_at,
        badge:badges(*)
      `)
      .eq('user_id', 'demo-user')
      .order('awarded_at', { ascending: false });

    if (userBadgesError) {
      console.error('Error fetching user badges:', userBadgesError);
      throw userBadgesError;
    }

    // Calculate stats
    const totalBadges = badges?.length || 0;
    const earnedBadges = userBadges?.length || 0;
    const totalPoints = userBadges?.reduce((sum, ub) => sum + (ub.badge?.points || 0), 0) || 0;
    const completionPercentage = totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;

    const response = {
      badges: badges || [],
      userBadges: userBadges || [],
      stats: {
        totalBadges,
        earnedBadges,
        totalPoints,
        completionPercentage
      }
    };

    console.log(`Badge library loaded: ${totalBadges} total badges, ${earnedBadges} earned, ${totalPoints} points`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error in badge library API:', error);
    
    // Check for specific table errors
    if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('Badge library tables do not exist. Please run the badge-library-setup.sql script.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          badges: [],
          userBadges: [],
          stats: {
            totalBadges: 0,
            earnedBadges: 0,
            totalPoints: 0,
            completionPercentage: 0
          },
          error: 'Badge library not set up. Please run database setup.'
        })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};