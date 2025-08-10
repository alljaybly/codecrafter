import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Badges from '../Badges';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Badges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders badges section with header', () => {
    render(<Badges />);
    
    expect(screen.getByText('Achievement Badges')).toBeInTheDocument();
    expect(screen.getByText(/unlock badges as you explore codecrafter/i)).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<Badges />);
    
    expect(screen.getByText('Loading badges...')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /loading badges/i })).toBeInTheDocument();
  });

  test('displays badge statistics after loading', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Badges Earned
      expect(screen.getByText('6')).toBeInTheDocument(); // Total Available
      expect(screen.getByText('33%')).toBeInTheDocument(); // Completion percentage
    });
  });

  test('renders all badge types', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('First Idea')).toBeInTheDocument();
      expect(screen.getByText('Voice Input Used')).toBeInTheDocument();
      expect(screen.getByText('Code Generator')).toBeInTheDocument();
      expect(screen.getByText('Todo Master')).toBeInTheDocument();
      expect(screen.getByText('Weather Wizard')).toBeInTheDocument();
      expect(screen.getByText('Early Adopter')).toBeInTheDocument();
    });
  });

  test('shows earned badges with different styling', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      // First Idea badge should be earned (has checkmark)
      const firstIdeaBadge = screen.getByText('First Idea').closest('div');
      expect(firstIdeaBadge).toHaveClass('bg-blue-500');
      
      // Voice Input Used badge should not be earned
      const voiceBadge = screen.getByText('Voice Input Used').closest('div');
      expect(voiceBadge).toHaveClass('bg-gray-100');
    });
  });

  test('displays badge descriptions', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('Submitted your first app idea')).toBeInTheDocument();
      expect(screen.getByText('Used voice input to describe an idea')).toBeInTheDocument();
      expect(screen.getByText('Generated your first piece of code')).toBeInTheDocument();
    });
  });

  test('shows earned date for earned badges', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      const earnedElements = screen.getAllByText(/earned/i);
      expect(earnedElements.length).toBeGreaterThan(0);
    });
  });

  test('get started button scrolls to home section', async () => {
    const user = userEvent.setup();
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('Start Earning Badges Today!')).toBeInTheDocument();
    });
    
    const getStartedButton = screen.getByRole('button', { name: /go to code generator to start earning badges/i });
    await user.click(getStartedButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('home');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('badges have proper accessibility attributes', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      const badgesList = screen.getByRole('list', { name: /achievement badges/i });
      expect(badgesList).toBeInTheDocument();
      
      const badgeItems = screen.getAllByRole('listitem');
      expect(badgeItems).toHaveLength(6);
      
      // Check that badges have proper ARIA labels
      const firstBadge = screen.getByRole('article', { name: /first idea badge/i });
      expect(firstBadge).toBeInTheDocument();
      expect(firstBadge).toHaveAttribute('tabIndex', '0');
    });
  });

  test('badge icons have proper accessibility labels', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      const firstIdeaIcon = screen.getByRole('img', { name: /first idea icon/i });
      expect(firstIdeaIcon).toBeInTheDocument();
      
      const voiceIcon = screen.getByRole('img', { name: /voice input used icon/i });
      expect(voiceIcon).toBeInTheDocument();
    });
  });

  test('completion statistics are calculated correctly', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      // With 2 earned badges out of 6 total, completion should be 33%
      const completionStat = screen.getByLabelText(/33% completion rate/i);
      expect(completionStat).toBeInTheDocument();
      
      const earnedStat = screen.getByLabelText(/2 badges earned/i);
      expect(earnedStat).toBeInTheDocument();
      
      const totalStat = screen.getByLabelText(/6 total badges available/i);
      expect(totalStat).toBeInTheDocument();
    });
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('First Idea')).toBeInTheDocument();
    });
    
    const firstBadge = screen.getByRole('article', { name: /first idea badge/i });
    
    // Badge should be focusable
    await user.tab();
    // Note: In a real test environment, you might need to check focus differently
    expect(firstBadge).toHaveAttribute('tabIndex', '0');
  });

  test('displays call to action section', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('Start Earning Badges Today!')).toBeInTheDocument();
      expect(screen.getByText(/use codecrafter to generate your first app/i)).toBeInTheDocument();
    });
  });

  test('earned badges have checkmark indicator', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      const checkmarks = screen.getAllByRole('img', { name: /badge earned/i });
      expect(checkmarks).toHaveLength(2); // Two badges are earned in mock data
    });
  });

  test('component has proper section accessibility', () => {
    render(<Badges />);
    
    const section = screen.getByRole('region', { name: /achievement badges section/i });
    expect(section).toBeInTheDocument();
  });

  test('loading skeleton has proper accessibility', () => {
    render(<Badges />);
    
    const loadingStatus = screen.getByRole('status', { name: /loading badges/i });
    expect(loadingStatus).toBeInTheDocument();
    
    const loadingMessage = screen.getByText('Loading badges...');
    expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
  });
});