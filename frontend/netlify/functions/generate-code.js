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

// Enhanced badge awarding function with IoT-specific badges
const awardBadges = async (supabase, userId, idea, usedVoiceInput, language, platform) => {
  const newBadges = [];
  
  try {
    // Get user's current badge count for progression badges
    const { data: userBadgeCount } = await supabase
      .from('user_badges')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);
    
    const currentBadgeCount = userBadgeCount || 0;
    
    // Get user's idea count for progression badges
    const { data: ideaCount } = await supabase
      .from('generated_code')
      .select('id', { count: 'exact' })
      .eq('user_id', userId || 'demo-user'); // Fallback for current system
    
    const currentIdeaCount = (ideaCount || 0) + 1; // +1 for current idea
    
    // Enhanced badge criteria with IoT and language-specific badges
    const badgeCriteria = [
      // Basic progression badges
      { criteria: 'first_idea', condition: currentIdeaCount === 1 },
      { criteria: 'first_code', condition: true },
      { criteria: 'first_voice', condition: usedVoiceInput },
      { criteria: 'ideas_5', condition: currentIdeaCount >= 5 },
      { criteria: 'ideas_10', condition: currentIdeaCount >= 10 },
      { criteria: 'ideas_25', condition: currentIdeaCount >= 25 },
      { criteria: 'ideas_50', condition: currentIdeaCount >= 50 },
      
      // Voice input badges
      { criteria: 'voice_10', condition: usedVoiceInput },
      
      // App type badges
      { criteria: 'todo_app', condition: idea.toLowerCase().includes('todo') || idea.toLowerCase().includes('task') },
      { criteria: 'weather_app', condition: idea.toLowerCase().includes('weather') },
      { criteria: 'game_app', condition: idea.toLowerCase().includes('game') },
      { criteria: 'ecommerce_app', condition: idea.toLowerCase().includes('shop') || idea.toLowerCase().includes('store') || idea.toLowerCase().includes('ecommerce') },
      { criteria: 'social_app', condition: idea.toLowerCase().includes('social') || idea.toLowerCase().includes('chat') || idea.toLowerCase().includes('message') },
      { criteria: 'ai_app', condition: idea.toLowerCase().includes('ai') || idea.toLowerCase().includes('artificial intelligence') || idea.toLowerCase().includes('machine learning') },
      
      // IoT-specific badges
      { criteria: 'iot_pioneer', condition: platform && ['arduino', 'raspberry-pi', 'esp32'].includes(platform) },
      { criteria: 'arduino_master', condition: language === 'arduino' || platform === 'arduino' },
      { criteria: 'raspberry_pi_expert', condition: platform === 'raspberry-pi' },
      { criteria: 'esp32_wizard', condition: platform === 'esp32' },
      { criteria: 'sensor_specialist', condition: idea.toLowerCase().includes('sensor') || idea.toLowerCase().includes('temperature') || idea.toLowerCase().includes('humidity') },
      { criteria: 'led_controller', condition: idea.toLowerCase().includes('led') || idea.toLowerCase().includes('blink') },
      
      // Language-specific badges
      { criteria: 'rust_developer', condition: language === 'rust' },
      { criteria: 'python_expert', condition: language === 'python' },
      { criteria: 'javascript_ninja', condition: language === 'javascript' },
      
      // Time-based badges
      { criteria: 'night_activity', condition: new Date().getHours() >= 22 || new Date().getHours() <= 6 },
      { criteria: 'weekend_activity', condition: [0, 6].includes(new Date().getDay()) },
      { criteria: 'early_bird', condition: new Date().getHours() >= 5 && new Date().getHours() <= 8 },
      
      // Speed badges
      { criteria: 'fast_generation', condition: true }, // Simplified for demo - would track actual generation time
      
      // Streak badges (simplified for demo)
      { criteria: 'streak_3', condition: currentIdeaCount >= 3 },
      { criteria: 'streak_7', condition: currentIdeaCount >= 7 },
      { criteria: 'streak_14', condition: currentIdeaCount >= 14 }
    ];
    
    // Check each criteria and award badges
    for (const { criteria, condition } of badgeCriteria) {
      if (!condition) continue;
      
      // Get badge info
      const { data: badge } = await supabase
        .from('badges')
        .select('*')
        .eq('criteria', criteria)
        .single();
      
      if (!badge) continue;
      
      // Check if user already has this badge
      const { data: existingUserBadge } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .maybeSingle();
      
      if (!existingUserBadge) {
        // Award the badge
        const { data: newUserBadge, error } = await supabase
          .from('user_badges')
          .insert([{
            user_id: userId,
            badge_id: badge.id,
            awarded_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (!error && newUserBadge) {
          newBadges.push(badge);
          console.log(`🏆 Awarded badge: ${badge.name} (${badge.points} points)`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error in badge awarding logic:', error);
  }
  
  return newBadges;
};

// Enhanced helper function with multi-language and IoT support
const getCodeTemplate = (idea, language = 'html', platform = 'web') => {
  const lowerIdea = idea.toLowerCase();
  
  // IoT-specific code generation
  if (language === 'arduino' || platform === 'arduino') {
    if (lowerIdea.includes('led') || lowerIdea.includes('blink')) {
      return `// Arduino LED Control - Auto-Generated
#include <Arduino.h>

const int LED_PIN = 13;
const int BUTTON_PIN = 2;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.println("✅ Arduino LED Controller Ready!");
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("💡 LED ON");
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(100);
}`;
    } else if (lowerIdea.includes('sensor') || lowerIdea.includes('temperature')) {
      return `// Arduino Sensor Reader - Auto-Generated
#include <DHT.h>
#define DHT_PIN 2
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("🌡️ Sensor Ready!");
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (!isnan(temp) && !isnan(humidity)) {
    Serial.print("Temp: "); Serial.print(temp); Serial.print("°C, ");
    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");
  }
  delay(2000);
}`;
    }
  }
  
  // Raspberry Pi Python code
  if (language === 'python' || platform === 'raspberry-pi') {
    return `#!/usr/bin/env python3
# Raspberry Pi ${idea} - Auto-Generated
import RPi.GPIO as GPIO
import time
from datetime import datetime

LED_PIN = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

print("🚀 Raspberry Pi Controller Started!")

try:
    while True:
        GPIO.output(LED_PIN, GPIO.HIGH)
        print(f"💡 LED ON - {datetime.now()}")
        time.sleep(1)
        
        GPIO.output(LED_PIN, GPIO.LOW)
        print(f"⚫ LED OFF - {datetime.now()}")
        time.sleep(1)
        
except KeyboardInterrupt:
    print("🛑 Stopping...")
finally:
    GPIO.cleanup()
    print("✅ Cleanup complete")`;
  }
  
  // Rust code generation
  if (language === 'rust') {
    return `// Rust Application - Auto-Generated
use std::io;
use std::collections::HashMap;

fn main() {
    println!("🦀 Rust Application: ${idea}");
    
    let mut data = HashMap::new();
    data.insert("status", "running");
    data.insert("language", "rust");
    
    println!("✅ Application initialized successfully!");
    println!("📊 Data: {:?}", data);
    
    // Add your ${idea} logic here
    loop {
        println!("Enter command (or 'quit' to exit):");
        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read input");
        
        match input.trim() {
            "quit" => {
                println!("👋 Goodbye!");
                break;
            }
            _ => {
                println!("🔄 Processing: {}", input.trim());
            }
        }
    }
}`;
  }
  
  // JavaScript/Node.js backend
  if (language === 'javascript') {
    return `// Node.js Application - Auto-Generated
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes for ${idea}
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ${idea} API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    data: 'Your ${idea} data here',
    generated: true,
    language: 'javascript'
  });
});

app.post('/api/process', (req, res) => {
  const { input } = req.body;
  res.json({
    processed: input,
    result: \`Processed: \${input}\`,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(\`✅ ${idea} server running on port \${PORT}\`);
});`;
  }
  
  // Default web templates
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
    const { idea, usedVoiceInput, language, platform } = JSON.parse(event.body || '{}');
    
    if (!idea || !idea.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Idea is required' })
      };
    }

    console.log(`🚀 Generating code for: "${idea}" (Language: ${language || 'default'}, Platform: ${platform || 'web'})`);

    // Enhanced code generation with language/platform support
    const generatedCode = getCodeTemplate(idea, language, platform);
    
    // Try to store in Supabase if available
    let responseData = {
      id: Date.now(), // Fallback ID
      idea: idea.trim(),
      code: generatedCode,
      generated_at: new Date().toISOString(),
      supabaseStatus: 'not_configured'
    };

    if (supabase) {
      try {
        console.log('Attempting to save to Supabase...');
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
          console.error('Supabase insertion error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          
          // If table doesn't exist, try to create it
          if (error.message.includes('table') && error.message.includes('generated_code')) {
            console.log('Table does not exist. Please create the generated_code table in Supabase.');
            responseData.supabaseStatus = 'table_missing';
            responseData.supabaseError = 'Table generated_code does not exist. Please run the database setup script.';
          } else {
            responseData.supabaseStatus = 'error';
            responseData.supabaseError = error.message;
          }
          // Continue without database, but log the error
        } else {
          console.log('Successfully saved to Supabase with ID:', data.id);
          responseData.id = data.id;
          responseData.supabaseStatus = 'success';
          
          // Award badges using enhanced badge library system
          try {
            const userId = 'demo-user'; // In a real app, this would come from authentication
            const newBadges = await awardBadges(supabase, userId, idea.trim(), usedVoiceInput, language, platform);
            
            if (newBadges.length > 0) {
              responseData.newBadges = newBadges;
              responseData.totalPointsEarned = newBadges.reduce((sum, badge) => sum + badge.points, 0);
              console.log(`🎉 Awarded ${newBadges.length} new badges (${responseData.totalPointsEarned} points):`, newBadges.map(b => `${b.name} (${b.points}pts)`));
            }

          } catch (badgeError) {
            console.error('Error awarding badges:', badgeError);
            responseData.badgeError = badgeError.message;
            // Don't fail the main request if badge awarding fails
          }
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        console.error('Connection error details:', JSON.stringify(dbError, null, 2));
        responseData.supabaseStatus = 'connection_error';
        responseData.supabaseError = dbError.message;
        // Continue without database
      }
    } else {
      console.log('Supabase not configured, returning generated code without database storage');
      responseData.supabaseStatus = 'not_configured';
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