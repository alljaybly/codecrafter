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

// Mock ideas for demonstration
const mockIdeas = [
  {
    id: 1,
    idea: 'Create a todo app with user authentication and drag-and-drop functionality',
    generated_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 2,
    idea: 'Build a weather dashboard with location-based forecasts and alerts',
    generated_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 3,
    idea: 'Design a simple counter app with increment and decrement buttons',
    generated_at: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  },
  {
    id: 4,
    idea: 'Create a blog platform with markdown support and comments system',
    generated_at: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    id: 5,
    idea: 'Build a real-time chat application with Socket.io and user presence',
    generated_at: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
  },
  {
    id: 6,
    idea: 'Create an e-commerce platform with payment integration and inventory management',
    generated_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: 7,
    idea: 'Design a social media dashboard with analytics and post scheduling',
    generated_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  },
  {
    id: 8,
    idea: 'Build a task management system with team collaboration features',
    generated_at: new Date(Date.now() - 345600000).toISOString() // 4 days ago
  }
];

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
    let ideas = [];

    // Try to fetch from Supabase if available
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('generated_code')
          .select('id, idea, generated_at')
          .order('generated_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Supabase error:', error);
          ideas = mockIdeas;
        } else {
          ideas = data && data.length > 0 ? data : mockIdeas;
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        ideas = mockIdeas;
      }
    } else {
      console.log('Supabase not configured, returning mock data');
      ideas = mockIdeas;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(ideas)
    };

  } catch (error) {
    console.error('Error fetching ideas:', error);
    
    // Always return mock data as fallback
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockIdeas)
    };
  }
};