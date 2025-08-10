import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import InputForm from '../InputForm';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock navigator.mediaDevices
const mockMediaDevices = {
  getUserMedia: jest.fn()
};

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: mockMediaDevices
});

// Mock MediaRecorder
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: null,
  onstop: null,
  onerror: null
};

global.MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder);

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
});

describe('InputForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input form with all elements', () => {
    render(<InputForm />);
    
    expect(screen.getByText('Start Creating')).toBeInTheDocument();
    expect(screen.getByLabelText(/describe your app idea/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voice input/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate code from idea/i })).toBeInTheDocument();
  });

  test('allows user to type in textarea', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    await user.type(textarea, 'Create a todo app');
    
    expect(textarea).toHaveValue('Create a todo app');
  });

  test('submit button is disabled when textarea is empty', () => {
    render(<InputForm />);
    
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when textarea has content', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(textarea, 'Create a todo app');
    
    expect(submitButton).not.toBeDisabled();
  });

  test('submits form and displays generated code', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        id: 1,
        idea: 'Create a todo app',
        code: 'const TodoApp = () => { return <div>Todo App</div>; };',
        generated_at: new Date().toISOString()
      }
    };
    
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(textarea, 'Create a todo app');
    await user.click(submitButton);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/.netlify/functions/generate-code',
      { idea: 'Create a todo app' }
    );
    
    await waitFor(() => {
      expect(screen.getByText('Generated Code')).toBeInTheDocument();
      expect(screen.getByText(/const TodoApp/)).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
    
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(textarea, 'Create a todo app');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to generate code/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during form submission', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(textarea, 'Create a todo app');
    await user.click(submitButton);
    
    expect(screen.getByText(/generating code/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('clear button clears textarea', async () => {
    const user = userEvent.setup();
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    await user.type(textarea, 'Create a todo app');
    
    const clearButton = screen.getByRole('button', { name: /clear idea text/i });
    await user.click(clearButton);
    
    expect(textarea).toHaveValue('');
  });

  test('copy button copies code to clipboard', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        id: 1,
        idea: 'Create a todo app',
        code: 'const TodoApp = () => { return <div>Todo App</div>; };',
        generated_at: new Date().toISOString()
      }
    };
    
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    
    await user.type(textarea, 'Create a todo app');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Generated Code')).toBeInTheDocument();
    });
    
    const copyButton = screen.getByRole('button', { name: /copy generated code to clipboard/i });
    await user.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockResponse.data.code);
  });

  test('voice input button starts recording', async () => {
    const user = userEvent.setup();
    const mockStream = {
      getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }])
    };
    
    mockMediaDevices.getUserMedia.mockResolvedValueOnce(mockStream as any);
    
    render(<InputForm />);
    
    const voiceButton = screen.getByRole('button', { name: /start voice recording/i });
    await user.click(voiceButton);
    
    expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    });
    
    expect(mockMediaRecorder.start).toHaveBeenCalledWith(1000);
  });

  test('handles microphone permission denied', async () => {
    const user = userEvent.setup();
    const permissionError = new Error('Permission denied');
    permissionError.name = 'NotAllowedError';
    
    mockMediaDevices.getUserMedia.mockRejectedValueOnce(permissionError);
    
    render(<InputForm />);
    
    const voiceButton = screen.getByRole('button', { name: /start voice recording/i });
    await user.click(voiceButton);
    
    await waitFor(() => {
      expect(screen.getByText(/microphone access denied/i)).toBeInTheDocument();
    });
  });

  test('form has proper accessibility attributes', () => {
    render(<InputForm />);
    
    const textarea = screen.getByLabelText(/describe your app idea/i);
    const submitButton = screen.getByRole('button', { name: /generate code from idea/i });
    const voiceButton = screen.getByRole('button', { name: /start voice recording/i });
    
    expect(textarea).toHaveAttribute('aria-describedby', 'idea-help');
    expect(textarea).toHaveAttribute('required');
    expect(submitButton).toHaveAttribute('aria-label');
    expect(voiceButton).toHaveAttribute('aria-label');
  });
});