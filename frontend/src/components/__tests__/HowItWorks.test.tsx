import React from 'react';
import { render, screen } from '@testing-library/react';
import HowItWorks from '../HowItWorks';

describe('HowItWorks', () => {
  test('renders section header', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('How CodeCrafter Works')).toBeInTheDocument();
    expect(screen.getByText(/transform your ideas into production-ready react components/i)).toBeInTheDocument();
  });

  test('displays all four main steps', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('Describe Your Idea')).toBeInTheDocument();
    expect(screen.getByText('Voice Input (Optional)')).toBeInTheDocument();
    expect(screen.getByText('AI Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Supabase Storage')).toBeInTheDocument();
  });

  test('shows step descriptions', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText(/type your app idea in the text area or use voice input/i)).toBeInTheDocument();
    expect(screen.getByText(/click the microphone button to use aws transcribe/i)).toBeInTheDocument();
    expect(screen.getByText(/our ai analyzes your idea and generates a complete react/i)).toBeInTheDocument();
    expect(screen.getByText(/your ideas and generated code are automatically saved/i)).toBeInTheDocument();
  });

  test('displays feature highlights section', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('Why Choose CodeCrafter?')).toBeInTheDocument();
    expect(screen.getByText('Multiple Templates')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Ready')).toBeInTheDocument();
    expect(screen.getByText('Tailwind Styled')).toBeInTheDocument();
    expect(screen.getByText('Production Ready')).toBeInTheDocument();
  });

  test('shows feature descriptions', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText(/supports todo apps, weather apps, counters/i)).toBeInTheDocument();
    expect(screen.getByText(/all generated code includes proper typescript types/i)).toBeInTheDocument();
    expect(screen.getByText(/beautiful, responsive designs with tailwind css/i)).toBeInTheDocument();
    expect(screen.getByText(/clean, optimized code ready for deployment/i)).toBeInTheDocument();
  });

  test('displays technology stack section', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('Built with Modern Technology')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Supabase')).toBeInTheDocument();
    expect(screen.getByText('AWS Transcribe')).toBeInTheDocument();
    expect(screen.getByText('Netlify')).toBeInTheDocument();
  });

  test('step icons are present', () => {
    render(<HowItWorks />);
    
    // Check for SVG icons in each step
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('feature emojis are displayed', () => {
    render(<HowItWorks />);
    
    const multipleTemplatesSection = screen.getByText('Multiple Templates').closest('div');
    expect(multipleTemplatesSection?.textContent).toContain('🎯');
    
    const typescriptSection = screen.getByText('TypeScript Ready').closest('div');
    expect(typescriptSection?.textContent).toContain('📝');
    
    const tailwindSection = screen.getByText('Tailwind Styled').closest('div');
    expect(tailwindSection?.textContent).toContain('🎨');
    
    const productionSection = screen.getByText('Production Ready').closest('div');
    expect(productionSection?.textContent).toContain('🚀');
  });

  test('section has proper id for navigation', () => {
    render(<HowItWorks />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('id', 'how-it-works');
  });

  test('section has proper styling classes', () => {
    render(<HowItWorks />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('py-16', 'bg-gray-50');
  });

  test('content is properly centered', () => {
    render(<HowItWorks />);
    
    const container = screen.getByRole('region').querySelector('.max-w-6xl');
    expect(container).toHaveClass('mx-auto', 'px-4');
  });

  test('steps are displayed in grid layout', () => {
    render(<HowItWorks />);
    
    const stepsContainer = screen.getByText('Describe Your Idea').closest('.grid');
    expect(stepsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  test('features are displayed in grid layout', () => {
    render(<HowItWorks />);
    
    const featuresContainer = screen.getByText('Multiple Templates').closest('.grid');
    expect(featuresContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  test('features section has proper background styling', () => {
    render(<HowItWorks />);
    
    const featuresSection = screen.getByText('Why Choose CodeCrafter?').closest('.bg-white');
    expect(featuresSection).toHaveClass('rounded-2xl', 'p-8', 'shadow-lg');
  });

  test('technology stack has proper opacity styling', () => {
    render(<HowItWorks />);
    
    const techStackContainer = screen.getByText('React').closest('.flex');
    expect(techStackContainer?.parentElement).toHaveClass('opacity-60');
  });

  test('all step icons have proper styling', () => {
    render(<HowItWorks />);
    
    const stepIcons = screen.getAllByRole('img', { hidden: true });
    stepIcons.forEach(icon => {
      const iconContainer = icon.closest('.bg-blue-600');
      expect(iconContainer).toHaveClass('text-white', 'w-16', 'h-16', 'rounded-full');
    });
  });

  test('section is accessible', () => {
    render(<HowItWorks />);
    
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    // Check headings hierarchy
    expect(screen.getByRole('heading', { level: 2, name: /how codecrafter works/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /why choose codecrafter/i })).toBeInTheDocument();
  });

  test('responsive design classes are applied', () => {
    render(<HowItWorks />);
    
    // Check responsive grid classes
    const stepsGrid = screen.getByText('Describe Your Idea').closest('.grid');
    expect(stepsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    
    const featuresGrid = screen.getByText('Multiple Templates').closest('.grid');
    expect(featuresGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  test('text content is properly structured', () => {
    render(<HowItWorks />);
    
    // Check that step titles are properly styled
    const stepTitle = screen.getByText('Describe Your Idea');
    expect(stepTitle).toHaveClass('text-xl', 'font-semibold');
    
    // Check that feature titles are properly styled
    const featureTitle = screen.getByText('Multiple Templates');
    expect(featureTitle).toHaveClass('text-lg', 'font-semibold');
  });
});