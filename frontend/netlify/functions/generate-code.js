// Try to import Supabase, but don't fail if it's not available
let supabase = null;
let createClient = null;

try {
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
  
  // Debug environment variables
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
    supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 20) + '...' : 'undefined'
  });

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

// Static code snippets for demonstration
const codeTemplates = {
  'todo': `// Todo App Component
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputText,
        completed: false
      }]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-l-md"
          placeholder="Add a todo..."
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`,

  'weather': `// Weather App Component
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  city: string;
}

const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        setWeather({
          temperature: Math.floor(Math.random() * 30) + 10,
          description: 'Sunny',
          city: city || 'New York'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-blue-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-l-md"
          placeholder="Enter city..."
        />
        <button
          onClick={fetchWeather}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
        >
          Get Weather
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {weather && (
        <div className="text-center">
          <h2 className="text-xl font-semibold">{weather.city}</h2>
          <p className="text-3xl font-bold">{weather.temperature}°C</p>
          <p className="text-gray-600">{weather.description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;`,

  'default': `// Basic React Component
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

export default MyApp;`
};

// Helper function to determine code template based on idea
const getCodeTemplate = (idea) => {
  const lowerIdea = idea.toLowerCase();
  
  if (lowerIdea.includes('todo') || lowerIdea.includes('task')) {
    return codeTemplates.todo;
  } else if (lowerIdea.includes('weather')) {
    return codeTemplates.weather;
  } else {
    return codeTemplates.default;
  }
};

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
    const { idea } = JSON.parse(event.body || '{}');
    
    if (!idea || !idea.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Idea is required' })
      };
    }

    // Generate code based on the idea
    const generatedCode = getCodeTemplate(idea);
    
    // Try to store in Supabase if available
    let responseData = {
      id: Date.now(), // Fallback ID
      idea: idea.trim(),
      code: generatedCode,
      generated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('generated_code')
          .insert([
            {
              idea: idea.trim(),
              generated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          // Continue without database, but log the error
        } else {
          responseData.id = data.id;
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        // Continue without database
      }
    } else {
      console.log('Supabase not configured, returning generated code without database storage');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    console.error('Error generating code:', error);
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