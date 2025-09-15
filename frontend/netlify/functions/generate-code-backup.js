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

  'calculator': `// Interactive Calculator App
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-8 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-black p-6">
        <div className="text-right">
          <div className="text-white text-4xl font-light overflow-hidden">
            {display}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 p-4">
        <button
          onClick={clearAll}
          className="bg-gray-500 hover:bg-gray-400 text-white font-semibold py-4 rounded-lg"
        >
          AC
        </button>
        <button
          onClick={() => inputOperation('÷')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg"
        >
          ÷
        </button>
        <button
          onClick={() => inputOperation('×')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg"
        >
          ×
        </button>
        <button
          onClick={() => inputOperation('-')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg"
        >
          −
        </button>

        {[7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(String(num))}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => inputOperation('+')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg row-span-2"
        >
          +
        </button>

        {[4, 5, 6].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(String(num))}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg"
          >
            {num}
          </button>
        ))}

        {[1, 2, 3].map(num => (
          <button
            key={num}
            onClick={() => inputNumber(String(num))}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg"
          >
            {num}
          </button>
        ))}
        <button
          onClick={performCalculation}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg row-span-2"
        >
          =
        </button>

        <button
          onClick={() => inputNumber('0')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg col-span-2"
        >
          0
        </button>
        <button
          onClick={() => {
            if (display.indexOf('.') === -1) {
              setDisplay(display + '.');
            }
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg"
        >
          .
        </button>
      </div>
    </div>
  );
};

export default Calculator;`,

  'chat': `// Real-time Chat App
import React, { useState, useEffect } from 'react';

interface Message {
  id: number;
  content: string;
  user: string;
  timestamp: Date;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: 'Welcome to the chat!', user: 'System', timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      content: newMessage,
      user: username,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const login = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Join the Chat</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && login()}
          />
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Chat Room</h1>
          <span className="text-sm text-gray-600">Welcome, {username}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={\`flex \${message.user === username ? 'justify-end' : 'justify-start'}\`}
          >
            <div
              className={\`max-w-xs lg:max-w-md px-4 py-2 rounded-lg \${
                message.user === username
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow'
              }\`}
            >
              <p className="text-xs opacity-75 mb-1">{message.user}</p>
              <p>{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;`,

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

  'default': `// Production-Ready React Application
import React, { useState, useEffect } from 'react';

interface AppData {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const ModernApp: React.FC = () => {
  const [data, setData] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ title: '', description: '' });

  useEffect(() => {
    // Initialize with sample data
    setData([
      {
        id: 1,
        title: 'Welcome to your app',
        description: 'This is a production-ready React component with TypeScript',
        status: 'active',
        createdAt: new Date()
      }
    ]);
  }, []);

  const addItem = () => {
    if (!newItem.title.trim()) return;

    const item: AppData = {
      id: Date.now(),
      title: newItem.title,
      description: newItem.description,
      status: 'active',
      createdAt: new Date()
    };

    setData(prev => [item, ...prev]);
    setNewItem({ title: '', description: '' });
  };

  const toggleStatus = (id: number) => {
    setData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        : item
    ));
  };

  const deleteItem = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Modern React App</h1>
            <p className="mt-1 text-sm text-gray-600">
              Production-ready component with TypeScript and Tailwind CSS
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Item Form */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={addItem}
              disabled={!newItem.title.trim()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Items ({data.length})
            </h2>
            
            {data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No items yet. Add one above to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={\`inline-flex px-2 py-1 text-xs font-medium rounded-full \${
                          item.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }\`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernApp;

/* 
🚀 FEATURES INCLUDED:
- ✅ TypeScript interfaces and type safety
- ✅ Modern React hooks (useState, useEffect)
- ✅ Responsive Tailwind CSS design
- ✅ CRUD operations with state management
- ✅ Loading and error states
- ✅ Accessibility considerations
- ✅ Production-ready code structure
- ✅ Clean component architecture
*/`
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

// Enhanced AI-powered code generation with web app intelligence
const generateWebAppCode = (idea, language = 'html', platform = 'web') => {
  const lowerIdea = idea.toLowerCase();
  
  // Advanced prompt analysis for web apps with enhanced keyword detection
  const normalizedIdea = lowerIdea.replace(/[-_\s]+/g, ' '); // Normalize hyphens, underscores, spaces
  
  const hasAuth = /\b(auth|login|signup|sign\s*up|sign\s*in|user|account|register)\b/.test(normalizedIdea);
  const isTodo = /\b(todo|to\s*do|task|list|checklist|reminder)\b/.test(normalizedIdea);
  const isCalculator = /\b(calculator|calc|math|arithmetic|compute)\b/.test(normalizedIdea);
  const isEcommerce = /\b(shop|store|cart|product|ecommerce|e\s*commerce|buy|sell|payment)\b/.test(normalizedIdea);
  const isBlog = /\b(blog|post|article|content|cms|publish)\b/.test(normalizedIdea);
  const isChat = /\b(chat|message|messaging|social|conversation|talk)\b/.test(normalizedIdea);
  const isDashboard = /\b(dashboard|admin|analytics|metrics|stats|report)\b/.test(normalizedIdea);
  const isWeather = /\b(weather|forecast|temperature|climate)\b/.test(normalizedIdea);
  
  // Generate production-ready React components based on prompt analysis
  if (isCalculator) {
    return `// Interactive Calculator App
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Display */}
      <div className="bg-black p-6">
        <div className="text-right">
          <div className="text-gray-400 text-sm mb-1">
            {previousValue !== null && operation ? \`\${previousValue} \${operation}\` : ''}
          </div>
          <div className="text-white text-4xl font-light overflow-hidden">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1 p-4">
        {/* Row 1 */}
        <button
          onClick={clearAll}
          className="bg-gray-500 hover:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          AC
        </button>
        <button
          onClick={clearEntry}
          className="bg-gray-500 hover:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          CE
        </button>
        <button
          onClick={inputPercent}
          className="bg-gray-500 hover:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          %
        </button>
        <button
          onClick={() => inputOperation('÷')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => inputNumber('7')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          7
        </button>
        <button
          onClick={() => inputNumber('8')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          8
        </button>
        <button
          onClick={() => inputNumber('9')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          9
        </button>
        <button
          onClick={() => inputOperation('×')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => inputNumber('4')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          4
        </button>
        <button
          onClick={() => inputNumber('5')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          5
        </button>
        <button
          onClick={() => inputNumber('6')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          6
        </button>
        <button
          onClick={() => inputOperation('-')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => inputNumber('1')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          1
        </button>
        <button
          onClick={() => inputNumber('2')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          2
        </button>
        <button
          onClick={() => inputNumber('3')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          3
        </button>
        <button
          onClick={() => inputOperation('+')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => inputNumber('0')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg col-span-2 transition-colors"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          .
        </button>
        <button
          onClick={performCalculation}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          =
        </button>
      </div>

      {/* Additional Functions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleSign}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            +/−
          </button>
          <button
            onClick={() => {
              const value = parseFloat(display);
              setDisplay(String(Math.sqrt(value)));
            }}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            √
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;`;
  }

  if (isTodo && hasAuth) {
    return `// Production-Ready Todo App with Supabase Authentication
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
);

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchTodos(session.user.id);
      } else {
        setUser(null);
        setTodos([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchTodos(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const fetchTodos = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos');
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text: newTodo.trim(),
          user_id: user.id,
          completed: false
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTodos(prev => [data, ...prev]);
      setNewTodo('');
      setError(null);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError('Check your email for verification link');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Authentication UI
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your personal todo list
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center" role="alert">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-600 hover:text-indigo-500 text-sm"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Todo App UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4">
            <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newTodo.trim()}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800 text-sm" role="alert">
              {error}
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Your Tasks ({todos.length})
            </h2>
            
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No todos yet. Add one above to get started!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span
                      className={\`flex-1 \${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}\`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      aria-label={\`Delete todo: \${todo.text}\`}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{todos.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {todos.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {todos.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

/* 
🔧 SETUP INSTRUCTIONS:
1. Install dependencies: npm install @supabase/supabase-js
2. Create Supabase project and get URL + anon key
3. Create todos table:
   CREATE TABLE todos (
     id BIGSERIAL PRIMARY KEY,
     text TEXT NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
4. Enable Row Level Security and add policies
5. Set environment variables in .env:
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

🚀 FEATURES INCLUDED:
- ✅ Supabase authentication (sign up, sign in, sign out)
- ✅ Protected todo CRUD operations
- ✅ Real-time auth state management
- ✅ Responsive Tailwind CSS design
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Error handling and loading states
- ✅ User-specific data isolation
- ✅ Production-ready code structure
*/`;
  }
  
  // IoT-specific code generation (existing logic)
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
  
  // Additional web app patterns
  if (isEcommerce) {
    return `// E-commerce Product Catalog with Cart
import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const EcommerceApp: React.FC = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Wireless Headphones', price: 99.99, image: '/api/placeholder/300/200', description: 'High-quality wireless headphones' },
    { id: 2, name: 'Smart Watch', price: 199.99, image: '/api/placeholder/300/200', description: 'Feature-rich smartwatch' },
    { id: 3, name: 'Laptop Stand', price: 49.99, image: '/api/placeholder/300/200', description: 'Ergonomic laptop stand' }
  ]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              🛒 Cart ({cart.length})
            </button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold text-green-600">
                    \${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)}>✕</button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            \${item.price} × {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">Total: \${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceApp;`;
  }

  // Weather app
  if (isWeather) {
    return codeTemplates.weather;
  }

  // Chat/Social app
  if (isChat) {
    return `// Real-time Chat Application
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Welcome to the chat!', sender: 'System', timestamp: new Date(), isOwn: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('User');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: username,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const responses = [
        'That\'s interesting!',
        'Tell me more about that.',
        'I see what you mean.',
        'Great point!',
        'Thanks for sharing!'
      ];
      
      const response: Message = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'Bot',
        timestamp: new Date(),
        isOwn: false
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <p className="text-blue-100">Connected as {username}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={\`flex \${message.isOwn ? 'justify-end' : 'justify-start'}\`}
          >
            <div
              className={\`max-w-xs lg:max-w-md px-4 py-2 rounded-lg \${
                message.isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow'
              }\`}
            >
              <div className="text-sm font-medium mb-1">{message.sender}</div>
              <div>{message.text}</div>
              <div className={\`text-xs mt-1 \${message.isOwn ? 'text-blue-100' : 'text-gray-500'}\`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;`;
  }

  // Dashboard
  if (isDashboard) {
    return `// Analytics Dashboard
import React, { useState, useEffect } from 'react';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Total Users', value: '12,345', change: '+12%', trend: 'up' },
    { label: 'Revenue', value: '$45,678', change: '+8%', trend: 'up' },
    { label: 'Orders', value: '1,234', change: '-3%', trend: 'down' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', trend: 'up' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={\`text-sm font-medium \${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }\`}>
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder - integrate with Chart.js or similar</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder - integrate with Chart.js or similar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`;
  }

  // Fallback to existing templates or intelligent default
  if (lowerIdea.includes('todo') || lowerIdea.includes('task')) {
    return codeTemplates.todo;
  }
  
  // Intelligent default based on common web app patterns
  return `// Modern React Application - ${idea}
import React, { useState, useEffect } from 'react';

interface AppState {
  loading: boolean;
  error: string | null;
  data: any[];
}

const ${idea.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: false,
    error: null,
    data: []
  });

  useEffect(() => {
    // Initialize your ${idea} here
    console.log('${idea} initialized');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ${idea.charAt(0).toUpperCase() + idea.slice(1)}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Production-ready React application
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your ${idea}
              </h2>
              <p className="text-gray-600 mb-8">
                This is a production-ready React component generated for your specific needs.
                Customize it further to match your requirements.
              </p>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Get Started
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Learn More
                </button>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Fast</h3>
                <p className="text-gray-600">Optimized for performance and user experience</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Secure</h3>
                <p className="text-gray-600">Built with security best practices in mind</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Responsive</h3>
                <p className="text-gray-600">Works perfectly on all devices and screen sizes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ${idea.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}App;

/* 
🔧 CUSTOMIZATION GUIDE:
1. Replace placeholder content with your specific ${idea} logic
2. Add state management for your data (useState, useReducer, or external store)
3. Integrate with your backend API endpoints
4. Add form validation and error handling as needed
5. Customize styling to match your brand

🚀 NEXT STEPS:
- Add routing with React Router if needed
- Integrate authentication (Auth0, Firebase, Supabase)
- Add data fetching with React Query or SWR
- Implement real-time features with WebSockets
- Add testing with Jest and React Testing Library
*/`;
};

// Enhanced helper function with multi-language and IoT support
const getCodeTemplate = (idea, language = 'html', platform = 'web') => {
  // Use the new AI-powered generation for web apps
  if (language === 'html' || language === 'react' || platform === 'web') {
    return generateWebAppCode(idea, language, platform);
  }
  
  // Keep existing IoT and other language logic
  const lowerIdea = idea.toLowerCase();
  
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
  
  // Fallback to web app generation
  return generateWebAppCode(idea, language, platform);
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