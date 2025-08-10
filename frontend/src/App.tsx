import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import InputForm from './components/InputForm';
import HowItWorks from './components/HowItWorks';
import Badges from './components/Badges';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-x">
        <Navigation />
        
        {/* Hero Section */}
        <main id="home" className="py-16">
          <div className="max-w-6xl mx-auto px-4 text-center mb-16">
            <div className="mb-8">
              <img src="/logo.svg" alt="CodeCrafter" className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Code<span className="text-blue-600">Crafter</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform your ideas into production-ready React components with AI-powered code generation
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="bg-white/50 px-3 py-1 rounded-full">🚀 Built for Code with Kiro Hackathon</span>
                <span className="bg-white/50 px-3 py-1 rounded-full">⚡ Powered by AI</span>
                <span className="bg-white/50 px-3 py-1 rounded-full">🎯 TypeScript Ready</span>
              </div>
            </div>
          </div>
          
          <InputForm />
        </main>

        <HowItWorks />
        <Badges />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;