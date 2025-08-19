// CodeCrafter Code Generation Utilities
export interface CodeResult {
  code: string;
  points: number;
}

export const generateCode = (prompt: string): CodeResult => {
  const normalizedPrompt = prompt.toLowerCase()
    .replace(/im/, 'in')
    .replace(/direcion/, 'direction')
    .trim();

  const promptMap: { [key: string]: CodeResult } = {
    "build a to-do list app": {
      code: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; background: #f8f9fa; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #ed64a6; text-align: center; margin-bottom: 20px;">✨ To-Do List App ✨</h2>
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <input 
              id="taskInput" 
              type="text" 
              placeholder="Add a new task..." 
              style="flex: 1; padding: 12px; border: 2px solid #ed64a6; border-radius: 6px; font-size: 14px;"
              onkeypress="if(event.key==='Enter') addTask()"
            />
            <button 
              onclick="addTask()" 
              style="padding: 12px 20px; background: #48bb78; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;"
              onmouseover="this.style.background='#38a169'" 
              onmouseout="this.style.background='#48bb78'"
            >
              Add
            </button>
          </div>
          <ul id="taskList" style="list-style: none; padding: 0; margin: 0;"></ul>
          <div id="stats" style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            Tasks completed: <span id="completedCount">0</span> | Total: <span id="totalCount">0</span>
          </div>
          
          <script>
            let taskCount = 0;
            let completedCount = 0;
            
            function addTask() {
              const input = document.getElementById('taskInput');
              const list = document.getElementById('taskList');
              const task = input.value.trim();
              
              if (task) {
                taskCount++;
                const li = document.createElement('li');
                li.innerHTML = \`
                  <div style="display: flex; align-items: center; padding: 12px; background: white; margin: 8px 0; border-radius: 6px; border-left: 4px solid #ed64a6; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <input type="checkbox" onchange="toggleTask(this)" style="margin-right: 12px; transform: scale(1.2);">
                    <span style="flex: 1; font-size: 14px;">\${task}</span>
                    <button onclick="removeTask(this.parentElement.parentElement)" style="background: #e53e3e; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
                  </div>
                \`;
                list.appendChild(li);
                input.value = '';
                updateStats();
              }
            }
            
            function toggleTask(checkbox) {
              const span = checkbox.nextElementSibling;
              if (checkbox.checked) {
                span.style.textDecoration = 'line-through';
                span.style.color = '#999';
                completedCount++;
              } else {
                span.style.textDecoration = 'none';
                span.style.color = 'black';
                completedCount--;
              }
              updateStats();
            }
            
            function removeTask(li) {
              const checkbox = li.querySelector('input[type="checkbox"]');
              if (checkbox.checked) completedCount--;
              taskCount--;
              li.remove();
              updateStats();
            }
            
            function updateStats() {
              document.getElementById('completedCount').textContent = completedCount;
              document.getElementById('totalCount').textContent = taskCount;
            }
          </script>
        </div>
      `,
      points: 100
    },

    "create a weather app": {
      code: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 20px auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
          <h2 style="margin-bottom: 20px; font-size: 24px;">🌤️ Weather Dashboard</h2>
          <div id="weatherDisplay">
            <div style="font-size: 48px; margin: 20px 0;">☀️</div>
            <h3 style="font-size: 28px; margin: 10px 0;">25°C</h3>
            <p style="font-size: 18px; opacity: 0.9;">Sunny</p>
            <p style="font-size: 16px; opacity: 0.8;">Cape Town, South Africa</p>
          </div>
          <button onclick="refreshWeather()" style="margin-top: 20px; padding: 12px 24px; background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); border-radius: 25px; cursor: pointer; font-size: 14px; backdrop-filter: blur(10px);">
            🔄 Refresh Weather
          </button>
          
          <script>
            const weatherData = [
              { temp: 25, condition: 'Sunny', icon: '☀️', city: 'Cape Town' },
              { temp: 18, condition: 'Cloudy', icon: '☁️', city: 'London' },
              { temp: 30, condition: 'Hot', icon: '🔥', city: 'Dubai' },
              { temp: 12, condition: 'Rainy', icon: '🌧️', city: 'Seattle' },
              { temp: 22, condition: 'Partly Cloudy', icon: '⛅', city: 'Sydney' }
            ];
            
            function refreshWeather() {
              const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
              const display = document.getElementById('weatherDisplay');
              
              display.innerHTML = \`
                <div style="font-size: 48px; margin: 20px 0;">\${randomWeather.icon}</div>
                <h3 style="font-size: 28px; margin: 10px 0;">\${randomWeather.temp}°C</h3>
                <p style="font-size: 18px; opacity: 0.9;">\${randomWeather.condition}</p>
                <p style="font-size: 16px; opacity: 0.8;">\${randomWeather.city}</p>
              \`;
            }
          </script>
        </div>
      `,
      points: 80
    },

    "draw a red star": {
      code: `
        <div style="text-align: center; padding: 20px;">
          <h3 style="color: #ed64a6; margin-bottom: 20px;">✨ Animated Red Star ✨</h3>
          <svg width="200" height="200" style="border: 2px solid #ed64a6; border-radius: 10px; background: #f8f9fa;">
            <polygon 
              points="100,20 120,70 170,70 130,100 140,150 100,120 60,150 70,100 30,70 80,70" 
              fill="red" 
              stroke="#8b0000" 
              stroke-width="2"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="3s"
                repeatCount="indefinite"
              />
            </polygon>
          </svg>
        </div>
      `,
      points: 50
    },

    "create a calculator": {
      code: `
        <div style="font-family: Arial, sans-serif; max-width: 300px; margin: 20px auto; padding: 20px; background: #2d3748; border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
          <div id="display" style="background: #1a202c; color: #48bb78; padding: 20px; margin-bottom: 15px; border-radius: 8px; text-align: right; font-size: 24px; min-height: 30px; border: 2px solid #ed64a6;">0</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <button onclick="clearDisplay()" style="grid-column: span 2; padding: 15px; background: #e53e3e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">Clear</button>
            <button onclick="deleteLast()" style="padding: 15px; background: #ed8936; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">⌫</button>
            <button onclick="appendToDisplay('/')" style="padding: 15px; background: #ed64a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">÷</button>
            
            <button onclick="appendToDisplay('7')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">7</button>
            <button onclick="appendToDisplay('8')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">8</button>
            <button onclick="appendToDisplay('9')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">9</button>
            <button onclick="appendToDisplay('*')" style="padding: 15px; background: #ed64a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">×</button>
            
            <button onclick="appendToDisplay('4')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">4</button>
            <button onclick="appendToDisplay('5')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">5</button>
            <button onclick="appendToDisplay('6')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">6</button>
            <button onclick="appendToDisplay('-')" style="padding: 15px; background: #ed64a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">−</button>
            
            <button onclick="appendToDisplay('1')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">1</button>
            <button onclick="appendToDisplay('2')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">2</button>
            <button onclick="appendToDisplay('3')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">3</button>
            <button onclick="appendToDisplay('+')" style="padding: 15px; background: #ed64a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">+</button>
            
            <button onclick="appendToDisplay('0')" style="grid-column: span 2; padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">0</button>
            <button onclick="appendToDisplay('.')" style="padding: 15px; background: #4a5568; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">.</button>
            <button onclick="calculate()" style="padding: 15px; background: #48bb78; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">=</button>
          </div>
          
          <script>
            let currentInput = '0';
            let shouldResetDisplay = false;
            
            function updateDisplay() {
              document.getElementById('display').textContent = currentInput;
            }
            
            function appendToDisplay(value) {
              if (shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
              }
              
              if (currentInput === '0' && value !== '.') {
                currentInput = value;
              } else {
                currentInput += value;
              }
              updateDisplay();
            }
            
            function clearDisplay() {
              currentInput = '0';
              updateDisplay();
            }
            
            function deleteLast() {
              if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
              } else {
                currentInput = '0';
              }
              updateDisplay();
            }
            
            function calculate() {
              try {
                const result = eval(currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'));
                currentInput = result.toString();
                shouldResetDisplay = true;
                updateDisplay();
              } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
                updateDisplay();
              }
            }
          </script>
        </div>
      `,
      points: 120
    },

    "build a clock": {
      code: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background: linear-gradient(45deg, #1a202c, #2d3748); color: white; border-radius: 20px; max-width: 400px; margin: 20px auto;">
          <h2 style="color: #ed64a6; margin-bottom: 30px;">🕐 Digital Clock</h2>
          <div id="clock" style="font-size: 48px; font-weight: bold; color: #48bb78; margin: 20px 0; text-shadow: 0 0 20px rgba(72, 187, 120, 0.5);"></div>
          <div id="date" style="font-size: 18px; color: #a0aec0; margin-bottom: 20px;"></div>
          <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
            <div style="text-align: center;">
              <div id="hours" style="font-size: 24px; color: #ed64a6;">00</div>
              <div style="font-size: 12px; color: #a0aec0;">HOURS</div>
            </div>
            <div style="font-size: 24px; color: #ed64a6;">:</div>
            <div style="text-align: center;">
              <div id="minutes" style="font-size: 24px; color: #ed64a6;">00</div>
              <div style="font-size: 12px; color: #a0aec0;">MINUTES</div>
            </div>
            <div style="font-size: 24px; color: #ed64a6;">:</div>
            <div style="text-align: center;">
              <div id="seconds" style="font-size: 24px; color: #ed64a6;">00</div>
              <div style="font-size: 12px; color: #a0aec0;">SECONDS</div>
            </div>
          </div>
          
          <script>
            function updateClock() {
              const now = new Date();
              const hours = now.getHours().toString().padStart(2, '0');
              const minutes = now.getMinutes().toString().padStart(2, '0');
              const seconds = now.getSeconds().toString().padStart(2, '0');
              
              const timeString = hours + ':' + minutes + ':' + seconds;
              const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
              
              document.getElementById('clock').textContent = timeString;
              document.getElementById('date').textContent = dateString;
              document.getElementById('hours').textContent = hours;
              document.getElementById('minutes').textContent = minutes;
              document.getElementById('seconds').textContent = seconds;
            }
            
            updateClock();
            setInterval(updateClock, 1000);
          </script>
        </div>
      `,
      points: 90
    }
  };

  return promptMap[normalizedPrompt] || { 
    code: `<div style="padding: 20px; text-align: center; color: #ed64a6; font-family: Arial, sans-serif;">
      <h3>🤖 Custom Code Generation</h3>
      <p>Prompt: "${prompt}"</p>
      <p>This would be generated using AI for custom prompts!</p>
    </div>`, 
    points: 10 
  };
};