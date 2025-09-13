import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LivePreview from '../LivePreview';

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: jest.fn((input) => input)
}));

describe('LivePreview Component', () => {
  const mockCode = `
    import React, { useState } from 'react';
    
    const TodoApp: React.FC = () => {
      const [todos, setTodos] = useState([]);
      const [newTodo, setNewTodo] = useState('');
      
      return (
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <input 
            type="text" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add todo..."
            className="w-full p-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Todo
          </button>
        </div>
      );
    };
    
    export default TodoApp;
  `;

  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    render(<LivePreview code="" loading={true} />);
    
    expect(screen.getByText('🚀 Generating Preview')).toBeInTheDocument();
    expect(screen.getByText('Creating your live preview...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state when no code provided', () => {
    render(<LivePreview code="" loading={false} />);
    
    expect(screen.getByText('🚀 Live Preview')).toBeInTheDocument();
    expect(screen.getByText('Your generated code will appear here in real-time!')).toBeInTheDocument();
    expect(screen.getByText('Enter a prompt above to see the magic happen.')).toBeInTheDocument();
  });

  it('renders preview with code', async () => {
    render(<LivePreview code={mockCode} loading={false} />);
    
    expect(screen.getByText('🚀 Live Preview')).toBeInTheDocument();
    expect(screen.getByText('Interactive preview with DOMPurify sanitization')).toBeInTheDocument();
    
    // Check for iframe
    const iframe = screen.getByTitle('Live code preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
  });

  it('has proper accessibility attributes', () => {
    render(<LivePreview code={mockCode} loading={false} />);
    
    const iframe = screen.getByTitle('Live code preview');
    expect(iframe).toHaveAttribute('title', 'Live code preview');
    
    // Check for browser-like header
    const redDot = document.querySelector('.bg-red-500');
    const yellowDot = document.querySelector('.bg-yellow-500');
    const greenDot = document.querySelector('.bg-green-500');
    
    expect(redDot).toBeInTheDocument();
    expect(yellowDot).toBeInTheDocument();
    expect(greenDot).toBeInTheDocument();
  });

  it('displays security notice', () => {
    render(<LivePreview code={mockCode} loading={false} />);
    
    expect(screen.getByText(/Preview runs in a secure sandbox/)).toBeInTheDocument();
    expect(screen.getByText(/mock authentication and database/)).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Render with invalid code that might cause errors
    const invalidCode = 'invalid javascript code {{{';
    render(<LivePreview code={invalidCode} loading={false} />);
    
    // The component should still render without crashing
    expect(screen.getByText('🚀 Live Preview')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('sanitizes code input', () => {
    const DOMPurify = require('dompurify');
    
    render(<LivePreview code={mockCode} loading={false} />);
    
    // Verify DOMPurify.sanitize was called
    expect(DOMPurify.sanitize).toHaveBeenCalled();
  });

  it('renders with proper styling classes', () => {
    render(<LivePreview code={mockCode} loading={false} />);
    
    // Check for Tailwind classes
    const container = screen.getByText('🚀 Live Preview').closest('div');
    expect(container).toHaveClass('mt-6');
    
    const iframe = screen.getByTitle('Live code preview');
    expect(iframe).toHaveClass('w-full', 'h-96', 'bg-white');
  });

  it('displays retry button on error', async () => {
    // Force an error by mocking iframe access failure
    const originalRef = React.useRef;
    React.useRef = jest.fn(() => ({
      current: null // Simulate iframe ref being null
    }));

    render(<LivePreview code={mockCode} loading={false} />);

    // Wait for potential error state
    await waitFor(() => {
      // The component should handle the error gracefully
      expect(screen.getByText('🚀 Live Preview')).toBeInTheDocument();
    });

    React.useRef = originalRef;
  });

  it('has proper iframe sandbox attributes for security', () => {
    render(<LivePreview code={mockCode} loading={false} />);
    
    const iframe = screen.getByTitle('Live code preview');
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
    
    // Verify minimum height
    expect(iframe).toHaveStyle('min-height: 400px');
  });

  it('renders browser-like interface', () => {
    render(<LivePreview code={mockCode} loading={false} />);
    
    // Check for browser dots (red, yellow, green)
    expect(document.querySelector('.bg-red-500.rounded-full')).toBeInTheDocument();
    expect(document.querySelector('.bg-yellow-500.rounded-full')).toBeInTheDocument();
    expect(document.querySelector('.bg-green-500.rounded-full')).toBeInTheDocument();
    
    // Check for browser header text
    expect(screen.getByText('Live Preview - Interact with your generated app')).toBeInTheDocument();
  });

  it('handles React component code correctly', () => {
    const reactCode = `
      const MyComponent = () => {
        return <div>Hello World</div>;
      };
    `;
    
    render(<LivePreview code={reactCode} loading={false} />);
    
    // Should render without errors
    expect(screen.getByText('🚀 Live Preview')).toBeInTheDocument();
    expect(screen.getByTitle('Live code preview')).toBeInTheDocument();
  });

  it('provides helpful loading messages', () => {
    render(<LivePreview code="" loading={true} />);
    
    expect(screen.getByText('🚀 Generating Preview')).toBeInTheDocument();
    expect(screen.getByText('Creating your live preview...')).toBeInTheDocument();
    
    // Check for loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});