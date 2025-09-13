import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Footer from '../Footer';

expect.extend(toHaveNoViolations);

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('renders footer with logo and brand name', () => {
    expect(screen.getByAltText('CodeCrafter')).toBeInTheDocument();
    expect(screen.getByText('CodeCrafter')).toBeInTheDocument();
  });

  test('displays enhanced project description', () => {
    expect(screen.getByText(/Transform your IoT ideas into production-ready code/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-powered generation and comprehensive gamification/i)).toBeInTheDocument();
  });

  test('shows feature badges', () => {
    expect(screen.getByText('IoT-First')).toBeInTheDocument();
    expect(screen.getByText('Accessible')).toBeInTheDocument();
    expect(screen.getByText('Gamified')).toBeInTheDocument();
  });

  test('shows quick links section', () => {
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /badges/i })).toBeInTheDocument();
  });

  describe('About Section', () => {
    test('displays about section with proper content', () => {
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText(/CodeCrafter is an AI-powered IoT code generation platform/)).toBeInTheDocument();
      expect(screen.getByText(/Arduino, Raspberry Pi, and ESP32 code/)).toBeInTheDocument();
    });

    test('github link has proper accessibility attributes', () => {
      const githubLink = screen.getByRole('link', { name: 'CodeCrafter GitHub Repository' });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/alljaybly/codecrafter');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(githubLink).toHaveAttribute('aria-label', 'CodeCrafter GitHub Repository');
    });
  });

  describe('Contact Section', () => {
    test('displays contact section with proper content', () => {
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Allen J Blythe')).toBeInTheDocument();
    });

    test('email link has proper attributes and accessibility', () => {
      const emailLink = screen.getByRole('link', { name: 'Email Allen J Blythe' });
      expect(emailLink).toHaveAttribute('href', 'mailto:allanjblythe@gmail.com');
      expect(emailLink).toHaveAttribute('aria-label', 'Email Allen J Blythe');
      expect(screen.getByText('allanjblythe@gmail.com')).toBeInTheDocument();
    });

    test('phone link has proper attributes and accessibility', () => {
      const phoneLink = screen.getByRole('link', { name: 'Call Allen J Blythe' });
      expect(phoneLink).toHaveAttribute('href', 'tel:+27834782235');
      expect(phoneLink).toHaveAttribute('aria-label', 'Call Allen J Blythe');
      expect(screen.getByText('+27 83 478 2235')).toBeInTheDocument();
    });

    test('displays complete address', () => {
      expect(screen.getByText(/12 Claasens Rd, Bishop Lavis/)).toBeInTheDocument();
      expect(screen.getByText(/Cape Town, South Africa/)).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    test('should not have any accessibility violations', async () => {
      const { container } = render(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper heading structure', () => {
      expect(screen.getByRole('heading', { name: 'CodeCrafter' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Quick Links' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    });

    test('all interactive elements have proper ARIA labels', () => {
      const githubLink = screen.getByLabelText('CodeCrafter GitHub Repository');
      const emailLink = screen.getByLabelText('Email Allen J Blythe');
      const phoneLink = screen.getByLabelText('Call Allen J Blythe');
      
      expect(githubLink).toBeInTheDocument();
      expect(emailLink).toBeInTheDocument();
      expect(phoneLink).toBeInTheDocument();
    });

    test('icons have proper aria-hidden attributes', () => {
      const { container } = render(<Footer />);
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  test('displays enhanced copyright with tagline', () => {
    expect(screen.getByText(/© 2025 CodeCrafter/i)).toBeInTheDocument();
    expect(screen.getByText(/Built with ❤️ by Allen J Blythe/i)).toBeInTheDocument();
    expect(screen.getByText(/IoT-First Code Generation • Accessibility-Focused • Production-Ready/i)).toBeInTheDocument();
  });

  test('quick links have proper href attributes', () => {
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '#home');
    expect(screen.getByRole('link', { name: /how it works/i })).toHaveAttribute('href', '#how-it-works');
    expect(screen.getByRole('link', { name: /badges/i })).toHaveAttribute('href', '#badges');
  });

  test('footer has proper responsive grid layout', () => {
    const { container } = render(<Footer />);
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  test('footer has proper styling classes', () => {
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gray-900', 'text-white');
  });

  test('logo has proper styling and attributes', () => {
    const logo = screen.getByAltText('CodeCrafter');
    expect(logo).toHaveClass('w-8', 'h-8');
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });

  test('links have proper hover effects and color classes', () => {
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('hover:text-white');
    
    const emailLink = screen.getByRole('link', { name: 'Email Allen J Blythe' });
    expect(emailLink).toHaveClass('hover:text-blue-400');
    
    const phoneLink = screen.getByRole('link', { name: 'Call Allen J Blythe' });
    expect(phoneLink).toHaveClass('hover:text-green-400');
  });

  test('copyright section is properly separated', () => {
    const copyrightSection = screen.getByText(/© 2025 CodeCrafter/i).closest('div');
    expect(copyrightSection).toHaveClass('border-t', 'border-gray-800');
  });

  test('contact icons are properly styled', () => {
    const { container } = render(<Footer />);
    const contactIcons = container.querySelectorAll('.space-y-3 svg');
    contactIcons.forEach(icon => {
      expect(icon).toHaveClass('w-4', 'h-4');
    });
  });
});