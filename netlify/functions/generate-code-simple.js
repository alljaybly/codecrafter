// Simple version without database for testing
const codeTemplate = `// Simple React Component
import React, { useState } from 'react';

const MyApp: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">My App</h1>
      <div className="text-center">
        <p className="text-xl mb-4">Count: {count}</p>
        <div className="space-x-2">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            -
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyApp;`;

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { idea } = JSON.parse(event.body || '{}');
    
    if (!idea || !idea.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Idea is required' })
      };
    }

    // Return mock response without database
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: Math.floor(Math.random() * 1000),
        idea: idea.trim(),
        code: codeTemplate,
        generated_at: new Date().toISOString(),
        note: 'This is a test version without database'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};