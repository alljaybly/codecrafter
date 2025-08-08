exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { audio } = JSON.parse(event.body);
    
    if (!audio) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Audio data is required' })
      };
    }

    // For demo purposes, return a mock transcription
    // In production, you would use AWS Transcribe here
    const mockTranscriptions = [
      'Create a todo application with user authentication',
      'Build a weather app that shows current conditions',
      'Make a simple counter application',
      'Design a blog platform with comments'
    ];
    
    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        transcription: randomTranscription
      })
    };

  } catch (error) {
    console.error('Error transcribing audio:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Transcription failed' })
    };
  }
};