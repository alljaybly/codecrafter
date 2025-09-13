import React from 'react';
import { render, screen } from '@testing-library/react';
import InputForm from '../InputForm';

// Mock all external dependencies
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({
    data: { code: '<div>Test code</div>', id: 1 }
  })
}));

jest.mock('../../utils/generatedCode', () => ({
  generateCode: jest.fn().mockReturnValue({
    code: '<div>Test generated code</div>',
    points: 100
  })
}));

jest.mock('dompurify', () => ({
  sanitize: jest.fn().mockImplementation((html) => html)
}));

// Mock MediaRecorder
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  state: 'inactive'
})) as any;
(global.MediaRecorder as any).isTypeSupported = jest.fn().mockReturnValue(true);

// Mock navigator APIs
Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
  permissions: { query: jest.fn().mockResolvedValue({ state: 'granted' }) },
  mediaDevices: { getUserMedia: jest.fn().mockResolvedValue({}) }
});

describe('InputForm Basic Tests', () => {
  test('renders without crashing', () => {
    render(<InputForm />);
    expect(screen.getByText('Start Creating')).toBeInTheDocument();
  });

  test('has input field', () => {
    render(<InputForm />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('has generate button', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /generate code from idea/i });
    expect(button).toBeInTheDocument();
  });

  test('has voice button', () => {
    render(<InputForm />);
    const button = screen.getByRole('button', { name: /start voice recording/i });
    expect(button).toBeInTheDocument();
  });
});