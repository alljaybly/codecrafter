const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// AWS Transcribe configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const transcribeService = new AWS.TranscribeService();

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

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'CodeCrafter API is running!' });
});

app.post('/generate-code', async (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    // Generate code based on the idea
    const generatedCode = getCodeTemplate(idea);
    
    // Store in Supabase
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
      return res.status(500).json({ error: 'Failed to save to database' });
    }

    res.json({
      id: data.id,
      idea: data.idea,
      code: generatedCode,
      generated_at: data.generated_at
    });

  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/ideas', async (req, res) => {
  try {
    // Fetch ideas from Supabase
    const { data, error } = await supabase
      .from('generated_code')
      .select('id, idea, generated_at')
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch ideas from database' });
    }

    res.json(data || []);

  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/transcribe', async (req, res) => {
  try {
    const { audio } = req.body;
    
    if (!audio) {
      return res.status(400).json({ error: 'Audio data is required' });
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
    
    res.json({
      transcription: randomTranscription
    });

  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase URL configured: ${!!process.env.SUPABASE_URL}`);
});