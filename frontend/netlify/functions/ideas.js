// Simple mock data for demonstration
const mockIdeas = [
  {
    id: 1,
    idea: "Build a todo app with React",
    generated_at: new Date().toISOString()
  },
  {
    id: 2,
    idea: "Create a weather dashboard",
    generated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    idea: "Develop a chat application",
    generated_at: new Date(Date.now() - 172800000).toISOString()
  }
];

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
    console.log('Returning mock ideas for demonstration');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockIdeas)
    };

  } catch (error) {
    console.error('Error in ideas function:', error);
    
    // Always return empty array instead of error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }
};