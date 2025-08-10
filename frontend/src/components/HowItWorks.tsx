import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      title: "Describe Your Idea",
      description: "Type your app idea in the text area or use voice input to describe what you want to build."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      title: "Voice Input (Optional)",
      description: "Click the microphone button to use AWS Transcribe for voice-to-text conversion."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "AI Code Generation",
      description: "Our AI analyzes your idea and generates a complete React TypeScript component with Tailwind CSS styling."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: "Supabase Storage",
      description: "Your ideas and generated code are automatically saved to our Supabase database for future reference."
    }
  ];

  const features = [
    {
      title: "Multiple Templates",
      description: "Supports todo apps, weather apps, counters, and more",
      icon: "🎯"
    },
    {
      title: "TypeScript Ready",
      description: "All generated code includes proper TypeScript types",
      icon: "📝"
    },
    {
      title: "Tailwind Styled",
      description: "Beautiful, responsive designs with Tailwind CSS",
      icon: "🎨"
    },
    {
      title: "Production Ready",
      description: "Clean, optimized code ready for deployment",
      icon: "🚀"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How CodeCrafter Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your ideas into production-ready React components in seconds. 
            Our AI-powered platform makes coding accessible to everyone.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose CodeCrafter?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Built with Modern Technology
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">React</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">Tailwind CSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">Supabase</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">AWS Transcribe</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">Netlify</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;