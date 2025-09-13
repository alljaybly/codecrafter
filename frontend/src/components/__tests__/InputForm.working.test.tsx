import React from 'react';
import { render, screen } from '@testing-library/react';
import InputForm from '../InputForm';

// Mock everything that could cause issues
jest.mock('axios');
jest.mock('../../utils/generatedCode');
jest.mock('dompurify');

// Mock MediaRecorder
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  state: 'inactive'
})) as any;
(global.MediaRecorder as any).isTypeSupported = jest.fn().mockReturnValue(true);

// Mock navigator APIs
Object.assign(navigator, {
  clipboard: { writeText: jest.fn() },
  permissions: { query: jest.fn().mockResolvedValue({ state: 'granted' }) },
  mediaDevices: { getUserMedia: jest.fn().mockResolvedValue({}) }
});

// Mock window APIs
Object.assign(window, {
  URL: { createObjectURL: jest.fn(), revokeObjectURL: jest.fn() }
});

describe('InputForm - Working Tests', () => {
  beforeEach(() => {
    // Suppress console errors for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the main heading', () => {
    render(<InputForm />);
    expect(screen.getByText('Start Creating')).toBeInTheDocument();
  });

  test('renders the description text', () => {
    render(<InputForm />);
    expect(screen.getByText(/describe your app idea or use voice input/i)).toBeInTheDocument();
  });

  test('renders the textarea input', () => {
    render(<InputForm />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', expect.stringContaining('Enter your app idea'));
  });

  test('renders the generate button', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /generate code from idea/i });
    expect(button).toBeInTheDocument();
  });

  test('renders the voice input button', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /start voice recording/i });
    expect(button).toBeInTheDocument();
  });

  test('generate button is initially disabled', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /generate code from idea/i });
    expect(button).toBeDisabled();
  });

  test('has proper form structure', () => {
    render(<InputForm />);
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  test('has proper accessibility labels', () => {
    render(<InputForm />);
    const textarea = screen.getByLabelText(/describe your app idea/i);
    expect(textarea).toBeInTheDocument();
  });
});