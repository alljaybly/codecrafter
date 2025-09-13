import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputForm from '../InputForm';

// Mock all external dependencies properly
jest.mock('axios', () => ({
  post: jest.fn()
}));

jest.mock('../../utils/generatedCode', () => ({
  generateCode: jest.fn()
}));

jest.mock('dompurify', () => ({
  sanitize: jest.fn()
}));

// Import mocked modules
import axios from 'axios';
import { generateCode } from '../../utils/generatedCode';
import DOMPurify from 'dompurify';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGenerateCode = generateCode as jest.MockedFunction<typeof generateCode>;
const mockedDOMPurify = DOMPurify as jest.Mocked<typeof DOMPurify>;

// Mock MediaRecorder
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

describe('InputForm Component - Fixed Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockedGenerateCode.mockReturnValue({
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
    });
    
    mockedDOMPurify.sanitize.mockImplementation((html) => html as string);
    
    mockedAxios.post.mockResolvedValue({
      data: { code: '<div>API generated code</div>', id: 1 }
    });
  });

  test('renders without crashing', () => {
    render(<InputForm />);
    expect(screen.getByText('Start Creating')).toBeInTheDocument();
  });

  test('has input field with correct placeholder', () => {
    render(<InputForm />);
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    expect(input).toBeInTheDocument();
  });

  test('has generate button that is initially disabled', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /generate code from idea/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('has voice button', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /start voice recording/i });
    expect(button).toBeInTheDocument();
  });

  test('enables generate button when input has text', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    expect(generateButton).toBeDisabled();
    
    await act(async () => {
      await user.type(input, 'build a to-do list app');
    });
    
    expect(generateButton).not.toBeDisabled();
  });

  test('calls generateCode when form is submitted', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await act(async () => {
      await user.type(input, 'build a to-do list app');
      await user.click(generateButton);
    });
    
    expect(mockedGenerateCode).toHaveBeenCalledWith('build a to-do list app');
  });

  test('shows success message after code generation', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const input = screen.getByPlaceholderText(/enter your app idea here/i);
    const generateButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await act(async () => {
      await user.type(input, 'build a to-do list app');
      await user.click(generateButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/code generated successfully/i)).toBeInTheDocument();
    });
  });

  test('validates generateCode utility', () => {
    // Test the actual generateCode function
    jest.unmock('../../utils/generatedCode');
    const actualGenerateCode = require('../../utils/generatedCode').generateCode;
    
    const result = actualGenerateCode('build a to-do list app');
    
    expect(result).toBeDefined();
    expect(result.code).toContain('<div');
    expect(result.code).toContain('To-Do List');
    expect(result.points).toBe(100);
  });
});