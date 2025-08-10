import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import SavedIdeas from '../SavedIdeas';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

const mockIdeas = [
  {
    id: 1,
    idea: 'Create a todo app with user authentication and drag-and-drop functionality',
    generated_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 2,
    idea: 'Build a weather dashboard with location-based forecasts',
    generated_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 3,
    idea: 'Design a simple counter app with increment and decrement buttons',
    generated_at: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  }
];

describe('SavedIdeas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<SavedIdeas />);
    
    expect(screen.getByText('Saved Ideas')).toBeInTheDocument();
    expect(screen.getByText('Loading badges...')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  test('renders ideas after successful API call', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText('Create a todo app with user authentication and drag-and-drop functionality')).toBeInTheDocument();
      expect(screen.getByText('Build a weather dashboard with location-based forecasts')).toBeInTheDocument();
      expect(screen.getByText('Design a simple counter app with increment and decrement buttons')).toBeInTheDocument();
    });
  });

  test('falls back to mock data when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      // Should show mock data
      expect(screen.getByText(/Create a todo app with user authentication/)).toBeInTheDocument();
    });
  });

  test('displays correct stats', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Total Ideas
      expect(screen.getByText('Total Ideas')).toBeInTheDocument();
    });
  });

  test('truncates long ideas and shows expand/collapse', async () => {
    const longIdea = {
      id: 4,
      idea: 'This is a very long idea that should be truncated because it exceeds the maximum length limit that we have set for displaying ideas in the card view',
      generated_at: new Date().toISOString()
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: [longIdea] });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText(/This is a very long idea that should be truncated/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
    });
  });

  test('expands and collapses long ideas', async () => {
    const user = userEvent.setup();
    const longIdea = {
      id: 4,
      idea: 'This is a very long idea that should be truncated because it exceeds the maximum length limit that we have set for displaying ideas in the card view',
      generated_at: new Date().toISOString()
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: [longIdea] });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
    });
    
    const expandButton = screen.getByRole('button', { name: /show more/i });
    await user.click(expandButton);
    
    expect(screen.getByText(longIdea.idea)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
    
    const collapseButton = screen.getByRole('button', { name: /show less/i });
    await user.click(collapseButton);
    
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });

  test('copy button copies idea to clipboard', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText(mockIdeas[0].idea)).toBeInTheDocument();
    });
    
    const copyButtons = screen.getAllByRole('button', { name: /copy idea to clipboard/i });
    await user.click(copyButtons[0]);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockIdeas[0].idea);
  });

  test('regenerate button scrolls to home section', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    // Mock getElementById
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText(mockIdeas[0].idea)).toBeInTheDocument();
    });
    
    const regenerateButtons = screen.getAllByRole('button', { name: /regenerate code for this idea/i });
    await user.click(regenerateButtons[0]);
    
    expect(document.getElementById).toHaveBeenCalledWith('home');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('refresh button refetches ideas', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText(mockIdeas[0].idea)).toBeInTheDocument();
    });
    
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    
    const refreshButton = screen.getByRole('button', { name: /refresh ideas list/i });
    await user.click(refreshButton);
    
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  test('displays empty state when no ideas', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText('No ideas yet')).toBeInTheDocument();
      expect(screen.getByText(/start creating your first app idea/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create your first idea/i })).toBeInTheDocument();
    });
  });

  test('displays error state and retry button', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load saved ideas/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry loading ideas/i })).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button', { name: /retry loading ideas/i });
    await user.click(retryButton);
    
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  test('formats dates correctly', async () => {
    const recentIdea = {
      id: 1,
      idea: 'Recent idea',
      generated_at: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: [recentIdea] });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText('Just now')).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByRole('list', { name: /achievement badges/i })).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(mockIdeas.length);
    });
    
    const copyButtons = screen.getAllByRole('button', { name: /copy idea to clipboard/i });
    const regenerateButtons = screen.getAllByRole('button', { name: /regenerate code for this idea/i });
    
    expect(copyButtons).toHaveLength(mockIdeas.length);
    expect(regenerateButtons).toHaveLength(mockIdeas.length);
  });

  test('shows loading state during refresh', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({ data: mockIdeas });
    
    render(<SavedIdeas />);
    
    await waitFor(() => {
      expect(screen.getByText(mockIdeas[0].idea)).toBeInTheDocument();
    });
    
    // Mock a slow response for refresh
    mockedAxios.get.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: mockIdeas }), 1000)));
    
    const refreshButton = screen.getByRole('button', { name: /refresh ideas list/i });
    await user.click(refreshButton);
    
    expect(screen.getByText(/refreshing/i)).toBeInTheDocument();
    expect(refreshButton).toBeDisabled();
  });
});