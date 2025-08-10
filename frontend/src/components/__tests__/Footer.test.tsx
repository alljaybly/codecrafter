import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  test('renders footer with logo and brand name', () => {
    render(<Footer />);
    
    expect(screen.getByAltText('CodeCrafter')).toBeInTheDocument();
    expect(screen.getByText('CodeCrafter')).toBeInTheDocument();
  });

  test('displays project description', () => {
    render(<Footer />);
    
    expect(screen.getByText(/transform your ideas into code with ai-powered generation/i)).toBeInTheDocument();
    expect(screen.getByText(/built for the code with kiro hackathon/i)).toBeInTheDocument();
  });

  test('shows quick links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /badges/i })).toBeInTheDocument();
  });

  test('displays connect section with external links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  test('github link has correct attributes', () => {
    render(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/alljaybly/codecrafter');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('github link includes github icon', () => {
    render(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    const githubIcon = githubLink.querySelector('svg');
    expect(githubIcon).toBeInTheDocument();
    expect(githubIcon).toHaveClass('w-4', 'h-4');
  });

  test('displays copyright with creator attribution', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2025 codecrafter/i)).toBeInTheDocument();
    expect(screen.getByText(/allen j blythe\(nxlevel\)/i)).toBeInTheDocument();
    expect(screen.getByText(/code with kiro hackathon/i)).toBeInTheDocument();
  });

  test('copyright includes heart emojis', () => {
    render(<Footer />);
    
    const copyrightText = screen.getByText(/allen j blythe\(nxlevel\)/i);
    expect(copyrightText.textContent).toContain('❤️');
  });

  test('quick links have proper href attributes', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '#home');
    expect(screen.getByRole('link', { name: /how it works/i })).toHaveAttribute('href', '#how-it-works');
    expect(screen.getByRole('link', { name: /badges/i })).toHaveAttribute('href', '#badges');
  });

  test('connect links have proper href attributes', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact');
  });

  test('footer has proper styling classes', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gray-900', 'text-white');
  });

  test('logo has proper styling', () => {
    render(<Footer />);
    
    const logo = screen.getByAltText('CodeCrafter');
    expect(logo).toHaveClass('w-8', 'h-8');
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });

  test('links have hover effects', () => {
    render(<Footer />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('hover:text-white');
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveClass('hover:text-white');
  });

  test('footer sections are properly organized', () => {
    render(<Footer />);
    
    // Check grid layout
    const footerContent = screen.getByRole('contentinfo').querySelector('.grid');
    expect(footerContent).toHaveClass('grid-cols-1', 'md:grid-cols-4');
  });

  test('copyright section is separated with border', () => {
    render(<Footer />);
    
    const copyrightSection = screen.getByText(/© 2025 codecrafter/i).closest('div');
    expect(copyrightSection).toHaveClass('border-t', 'border-gray-800');
  });

  test('footer is accessible', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // Check that all links are accessible
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toBeVisible();
    });
  });

  test('footer sections have proper headings', () => {
    render(<Footer />);
    
    expect(screen.getByRole('heading', { name: /codecrafter/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /connect/i })).toBeInTheDocument();
  });

  test('footer maintains responsive design', () => {
    render(<Footer />);
    
    const mainGrid = screen.getByRole('contentinfo').querySelector('.grid');
    expect(mainGrid).toHaveClass('grid-cols-1', 'md:grid-cols-4');
    
    const logoSection = screen.getByText('CodeCrafter').closest('.col-span-1');
    expect(logoSection).toHaveClass('md:col-span-2');
  });

  test('all text content is properly styled', () => {
    render(<Footer />);
    
    const description = screen.getByText(/transform your ideas into code/i);
    expect(description).toHaveClass('text-gray-400');
    
    const copyright = screen.getByText(/© 2025 codecrafter/i);
    expect(copyright).toHaveClass('text-gray-400');
  });
});