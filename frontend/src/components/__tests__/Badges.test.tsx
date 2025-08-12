import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Badges from '../Badges';

// Mock react-icons
jest.mock('react-icons/hi', () => ({
  HiLightBulb: () => <div data-testid="icon-lightbulb">💡</div>,
  HiMicrophone: () => <div data-testid="icon-microphone">🎤</div>,
  HiCode: () => <div data-testid="icon-code">⚡</div>,
  HiStar: () => <div data-testid="icon-star">⭐</div>,
  HiCog: () => <div data-testid="icon-cog">⚙️</div>,
}));

// Mock fetch for badge library API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      badges: [
        {
          id: '1',
          name: 'Idea Pioneer',
          description: 'Submitted your first brilliant idea',
          color: 'blue-500',
          icon: 'HiLightBulb',
          criteria: 'first_idea',
          category: 'starter',
          rarity: 'common',
          points: 10,
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Voice Master',
          description: 'Used voice input to describe an idea',
          color: 'purple-500',
          icon: 'HiMicrophone',
          criteria: 'first_voice',
          category: 'starter',
          rarity: 'common',
          points: 15,
          created_at: '2025-01-01T00:00:00Z'
        }
      ],
      userBadges: [
        {
          id: 'ub1',
          user_id: 'demo-user',
          badge_id: '1',
          awarded_at: '2025-01-01T12:00:00Z',
          badge: {
            id: '1',
            name: 'Idea Pioneer',
            description: 'Submitted your first brilliant idea',
            color: 'blue-500',
            icon: 'HiLightBulb',
            criteria: 'first_idea',
            category: 'starter',
            rarity: 'common',
            points: 10
          }
        }
      ],
      stats: {
        totalBadges: 2,
        earnedBadges: 1,
        totalPoints: 10,
        completionPercentage: 50
      }
    })
  })
) as jest.Mock;

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Badges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders badge library section with header and toggle button', () => {
    render(<Badges />);
    
    expect(screen.getByText('Badge Library')).toBeInTheDocument();
    expect(screen.getByText(/discover and collect 20\+ unique achievement badges/i)).toBeInTheDocument();
    
    // Check for toggle button
    const toggleButton = screen.getByRole('button', { name: /show badge collection/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('shows loading state initially', () => {
    render(<Badges />);
    
    expect(screen.getByText('Loading badges...')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /loading badges/i })).toBeInTheDocument();
  });

  test('displays badge library statistics after loading', async () => {
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Badges Earned
      expect(screen.getByText('2')).toBeInTheDocument(); // Total Available
      expect(screen.getByText('50%')).toBeInTheDocument(); // Completion percentage
      expect(screen.getByText('10')).toBeInTheDocument(); // Total Points
    });
  });

  test('toggle button shows and hides badge collection', async () => {
    const user = userEvent.setup();
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('Badge Library')).toBeInTheDocument();
    });
    
    const toggleButton = screen.getByRole('button', { name: /show badge collection/i });
    
    // Initially badges should be hidden
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(/show badges/i)).toBeInTheDocument();
    
    // Click to show badges
    await user.click(toggleButton);
    
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(/hide badges/i)).toBeInTheDocument();
    });
    
    // Click to hide badges again
    await user.click(toggleButton);
    
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText(/show badges/i)).toBeInTheDocument();
    });
  });

  test('renders badge library badges when expanded', async () => {
    const user = userEvent.setup();
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('Badge Library')).toBeInTheDocument();
    });
    
    // Expand the badge collection
    const toggleButton = screen.getByRole('button', { name: /show badge collection/i });
    await user.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Idea Pioneer')).toBeInTheDocument();
      expect(screen.getByText('Voice Master')).toBeInTheDocument();
      expect(screen.getByText('Submitted your first brilliant idea')).toBeInTheDocument();
      expect(screen.getByText('Used voice input to describe an idea')).toBeInTheDocument();
    });
  });

  test('shows earned badges with different styling when expanded', async () => {
    const user = userEvent.setup();
    render(<Badges />);
    
    await waitFor(() => {
      expect(screen.getByText('Badge Library')).toBeInTheDocument();
    });
    
    // Expand the badge collection
    const toggleButton = screen.getByRole('button', { name: /show badge collection/i });
    await user.click(toggleButton);
    
    await waitFor(() => {
      // Idea Pioneer badge should be earned (has gradient background)
      const ideaPioneerBadge = screen.getByText('Idea Pioneer').closest('div');
      expect(ideaPioneerBadge).toHaveClass('bg-gradient-to-r');
      
      // Voice Master badge should not be earned (has gray background)
      const voiceBadge = screen.getByText('Voice Master').closest('div');
      expect(voiceBadge).toHaveClass('bg-gray-100');
      expect(voiceBadge).toHaveClass('opacity-50');
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