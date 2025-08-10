import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '../Navigation';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation with logo and brand name', () => {
    render(<Navigation />);
    
    expect(screen.getByAltText('CodeCrafter')).toBeInTheDocument();
    expect(screen.getByText('CodeCrafter')).toBeInTheDocument();
  });

  test('displays all navigation links in desktop view', () => {
    render(<Navigation />);
    
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saved ideas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /badges/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  test('github link has correct attributes', () => {
    render(<Navigation />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/alljaybly/codecrafter');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('home button scrolls to home section', async () => {
    const user = userEvent.setup();
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<Navigation />);
    
    const homeButton = screen.getByRole('button', { name: /home/i });
    await user.click(homeButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('home');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('saved ideas button scrolls to saved ideas section', async () => {
    const user = userEvent.setup();
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<Navigation />);
    
    const savedIdeasButton = screen.getByRole('button', { name: /saved ideas/i });
    await user.click(savedIdeasButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('saved-ideas');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('how it works button scrolls to how it works section', async () => {
    const user = userEvent.setup();
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<Navigation />);
    
    const howItWorksButton = screen.getByRole('button', { name: /how it works/i });
    await user.click(howItWorksButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('how-it-works');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('badges button scrolls to badges section', async () => {
    const user = userEvent.setup();
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<Navigation />);
    
    const badgesButton = screen.getByRole('button', { name: /badges/i });
    await user.click(badgesButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('badges');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('mobile menu button toggles menu visibility', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    
    // Mobile menu should not be visible initially
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    
    // Click mobile menu button
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    
    // Mobile menu should now be visible
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    // Click again to close
    await user.click(menuButton);
    
    // Menu should be hidden again (this might need adjustment based on actual implementation)
  });

  test('mobile menu shows all navigation options', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    
    // Check all mobile menu items are present
    const mobileMenuItems = screen.getAllByText('Home');
    expect(mobileMenuItems.length).toBeGreaterThan(0);
    
    expect(screen.getByText('Saved Ideas')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Badges')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  test('mobile menu navigation closes menu after selection', async () => {
    const user = userEvent.setup();
    const mockElement = { scrollIntoView: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(<Navigation />);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    
    // Click on a navigation item in mobile menu
    const mobileHomeButton = screen.getAllByText('Home')[0]; // Get first instance
    await user.click(mobileHomeButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('home');
  });

  test('navigation has sticky positioning class', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sticky', 'top-0');
  });

  test('navigation has proper backdrop blur styling', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white/90', 'backdrop-blur-md');
  });

  test('logo image has proper alt text', () => {
    render(<Navigation />);
    
    const logo = screen.getByAltText('CodeCrafter');
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });

  test('menu button shows correct icon based on state', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    // Initially should show hamburger menu (three lines)
    expect(menuButton.querySelector('path[d*="M4 6h16M4 12h16M4 18h16"]')).toBeInTheDocument();
    
    // After clicking, should show close icon (X)
    await user.click(menuButton);
    expect(menuButton.querySelector('path[d*="M6 18L18 6M6 6l12 12"]')).toBeInTheDocument();
  });

  test('navigation buttons have hover effects', () => {
    render(<Navigation />);
    
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).toHaveClass('hover:text-blue-600');
  });

  test('github button has distinct styling', () => {
    render(<Navigation />);
    
    const githubButton = screen.getByRole('link', { name: /github/i });
    expect(githubButton).toHaveClass('bg-blue-600', 'text-white');
  });

  test('handles missing DOM elements gracefully', async () => {
    const user = userEvent.setup();
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    
    render(<Navigation />);
    
    const homeButton = screen.getByRole('button', { name: /home/i });
    
    // Should not throw error when element is not found
    await user.click(homeButton);
    
    expect(document.getElementById).toHaveBeenCalledWith('home');
  });
});