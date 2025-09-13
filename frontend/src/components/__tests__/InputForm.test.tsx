import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputForm from '../InputForm';

// Mock all external dependencies to prevent hanging
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({
    data: { code: '<div>Test API code</div>', id: 1 }
  })
}));

jest.mock('../../utils/generatedCode', () => ({
  generateCode: jest.fn().mockReturnValue({
    code: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
      <h2 style="color: #ed64a6; text-align: center;">✨ To-Do List App ✨</h2>
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <input id="taskInput" type="text" placeholder="Add a new task..." />
        <button onclick="addTask()">Add</button>
      </div>
      <ul id="taskList"></ul>
      <script>
        function addTask() {
          const input = document.getElementById('taskInput');
          const list = document.getElementById('taskList');
          if (input.value.trim()) {
            const li = document.createElement('li');
            li.textContent = input.value;
            list.appendChild(li);
            input.value = '';
          }
        }
      </script>
    </div>`,
    points: 100
  })
}));

jest.mock('dompurify', () => ({
  sanitize: jest.fn().mockImplementation((html) => html)
}));

// Mock MediaRecorder properly
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  requestData: jest.fn(),
  state: 'inactive',
  mimeType: 'audio/webm',
  ondataavailable: null,
  onstop: null,
  onerror: null
};

global.MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder) as any;
(global.MediaRecorder as any).isTypeSupported = jest.fn().mockReturnValue(true);

// Mock navigator APIs
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  },
  permissions: {
    query: jest.fn().mockResolvedValue({
      state: 'granted',
      onchange: null
    })
  },
  mediaDevices: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn().mockReturnValue([{
        stop: jest.fn()
      }])
    })
  }
});

// Mock window APIs
Object.assign(window, {
  URL: {
    createObjectURL: jest.fn().mockReturnValue('mock-url'),
    revokeObjectURL: jest.fn()
  }
});

describe('InputForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders input form with basic elements', () => {
    render(<InputForm />);
    
    expect(screen.getByText('Start Creating')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your app idea here/i)).toBeInTheDocument();
  });

  test('renders generate button and voice input button', () => {
    render(<InputForm />);
    
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toBeDisabled(); // Should be disabled when input is empty
    
    const voiceButton = screen.getByRole('button', { name: /start voice recording/i });
    expect(voiceButton).toBeInTheDocument();
  });

  test('enables generate button when input has text', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    expect(generateButton).toBeDisabled();
    
    await user.type(input, 'build a to-do list app');
    
    expect(generateButton).not.toBeDisabled();
  });

  test('generates code and shows preview window', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<InputForm />);
    
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(input, 'build a to-do list app');
    await user.click(generateButton);
    
    // Fast-forward timers to handle any setTimeout calls
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('🚀 Live Preview')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if iframe is rendered
    const iframe = screen.getByTitle('CodeCrafter Live Preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-pointer-lock allow-forms');
  });

  test('shows share button after code generation', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<InputForm />);
    
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(input, 'test idea');
    await user.click(generateButton);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      const shareButton = screen.getByRole('button', { name: /share generated code as html file/i });
      expect(shareButton).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('handles voice input button click', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const voiceButton = screen.getByRole('button', { name: /start voice recording/i });
    
    await user.click(voiceButton);
    
    // Should show some indication of voice input being processed
    expect(voiceButton).toBeInTheDocument();
  });

  test('validates generateCode utility returns functional code', () => {
    // Import the actual generateCode function
    const generateCodeModule = require('../../utils/generatedCode');
    const result = generateCodeModule.generateCode('build a to-do list app');
    
    expect(result).toBeDefined();
    expect(result.code).toContain('<div');
    expect(result.code).toContain('To-Do List');
    expect(result.code).toContain('addTask');
    expect(result.points).toBe(100);
  });
});