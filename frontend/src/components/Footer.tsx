import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo.svg" alt="CodeCrafter" className="w-8 h-8 mr-2" />
              <h3 className="text-xl font-bold">CodeCrafter</h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Transform your IoT ideas into production-ready code with AI-powered generation and comprehensive gamification.
            </p>
            <div className="flex space-x-2">
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">IoT-First</span>
              <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Accessible</span>
              <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded">Gamified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#badges" className="text-gray-400 hover:text-white transition-colors">
                  Badges
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <p className="text-gray-400 text-sm mb-4">
              CodeCrafter is an AI-powered IoT code generation platform built for the Code with Kiro Hackathon. 
              It generates Arduino, Raspberry Pi, and ESP32 code with gamified badges and accessibility features.
            </p>
            <a 
              href="https://github.com/alljaybly/codecrafter" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="CodeCrafter GitHub Repository"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-300 font-medium text-sm">Allen J Blythe</p>
              </div>
              <div>
                <a 
                  href="mailto:allanjblythe@gmail.com" 
                  aria-label="Email Allen J Blythe"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  allanjblythe@gmail.com
                </a>
              </div>
              <div>
                <a 
                  href="tel:+27834782235" 
                  aria-label="Call Allen J Blythe"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +27 83 478 2235
                </a>
              </div>
              <div>
                <p className="text-gray-400 text-sm flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>12 Claasens Rd, Bishop Lavis<br />Cape Town, South Africa</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 CodeCrafter. Built with ❤️ by Allen J Blythe for the Code with Kiro Hackathon.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            IoT-First Code Generation • Accessibility-Focused • Production-Ready
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;