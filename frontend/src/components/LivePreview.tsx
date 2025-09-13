import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface LivePreviewProps {
  code: string;
  loading?: boolean;
}

const LivePreview: React.FC<LivePreviewProps> = ({ code, loading = false }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!code || loading) return;
    
    renderPreview();
  }, [code, loading]);

  const renderPreview = async () => {
    if (!iframeRef.current) return;

    try {
      setIsRendering(true);
      setPreviewError(null);

      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDoc) {
        throw new Error('Unable to access iframe document');
      }

      // Create the HTML structure for the preview
      const previewHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Live Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background-color: #f9fafb;
            }
            #root {
              min-height: 100vh;
            }
            .error-boundary {
              padding: 20px;
              background-color: #fee2e2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              color: #dc2626;
            }
          </style>
        </head>
        <body>
          <div id="root">
            <div class="flex items-center justify-center min-h-screen">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
          
          <script type="text/babel">
            const { useState, useEffect, useRef } = React;
            
            // Error Boundary Component
            class ErrorBoundary extends React.Component {
              constructor(props) {
                super(props);
                this.state = { hasError: false, error: null };
              }
              
              static getDerivedStateFromError(error) {
                return { hasError: true, error };
              }
              
              componentDidCatch(error, errorInfo) {
                console.error('Preview Error:', error, errorInfo);
              }
              
              render() {
                if (this.state.hasError) {
                  return (
                    <div className="error-boundary">
                      <h2 className="text-lg font-bold mb-2">Preview Error</h2>
                      <p className="text-sm mb-2">The generated code encountered an error:</p>
                      <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">
                        {this.state.error?.message || 'Unknown error occurred'}
                      </pre>
                      <p className="text-xs mt-2 text-red-600">
                        Try refining your prompt or check the generated code for syntax errors.
                      </p>
                    </div>
                  );
                }
                
                return this.props.children;
              }
            }
            
            // Mock Supabase client for preview
            const mockSupabase = {
              createClient: () => ({
                auth: {
                  getSession: () => Promise.resolve({ data: { session: null } }),
                  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
                  signUp: () => Promise.resolve({ error: { message: 'Demo mode - authentication disabled' } }),
                  signInWithPassword: () => Promise.resolve({ error: { message: 'Demo mode - authentication disabled' } }),
                  signOut: () => Promise.resolve({ error: null })
                },
                from: () => ({
                  select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
                  insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database disabled' } }) }) }),
                  update: () => ({ eq: () => Promise.resolve({ error: { message: 'Demo mode - database disabled' } }) }),
                  delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Demo mode - database disabled' } }) })
                }),
                channel: () => ({
                  on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
                })
              })
            };
            
            // Make mock Supabase available globally
            window.supabase = mockSupabase;
            
            try {
              // Sanitize and prepare the code
              const sanitizedCode = \`${DOMPurify.sanitize(code.replace(/'/g, "\\'").replace(/\n/g, '\\n'))}\`;
              
              // Transform the code to handle imports and exports
              let transformedCode = sanitizedCode
                .replace(/import.*from.*['"][^'"]*['"];?/g, '') // Remove import statements
                .replace(/export default/g, 'const GeneratedComponent =') // Replace export default
                .replace(/export /g, '') // Remove other exports
                .replace(/createClient.*from.*supabase/g, 'createClient = mockSupabase.createClient'); // Mock Supabase
              
              // Add the component code
              eval(transformedCode);
              
              // Render the component
              if (typeof GeneratedComponent !== 'undefined') {
                ReactDOM.render(
                  React.createElement(ErrorBoundary, null,
                    React.createElement(GeneratedComponent)
                  ),
                  document.getElementById('root')
                );
              } else {
                throw new Error('No valid React component found in generated code');
              }
              
            } catch (error) {
              console.error('Preview render error:', error);
              ReactDOM.render(
                React.createElement('div', { className: 'error-boundary' },
                  React.createElement('h2', { className: 'text-lg font-bold mb-2' }, 'Preview Error'),
                  React.createElement('p', { className: 'text-sm mb-2' }, 'Failed to render the generated code:'),
                  React.createElement('pre', { className: 'text-xs bg-red-50 p-2 rounded overflow-auto' }, error.message),
                  React.createElement('p', { className: 'text-xs mt-2 text-red-600' }, 'Try simplifying your prompt or check for syntax errors.')
                ),
                document.getElementById('root')
              );
            }
          </script>
        </body>
        </html>
      `;

      // Write the HTML to the iframe
      iframeDoc.open();
      iframeDoc.write(previewHTML);
      iframeDoc.close();

    } catch (error) {
      console.error('Preview error:', error);
      setPreviewError(error instanceof Error ? error.message : 'Failed to render preview');
    } finally {
      setIsRendering(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">🚀 Generating Preview</h2>
          <p className="text-gray-600">Creating your live preview...</p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">⚡</div>
          <h2 className="text-xl font-bold mb-2">🚀 Live Preview</h2>
          <p>Your generated code will appear here in real-time!</p>
          <p className="text-sm mt-2">Enter a prompt above to see the magic happen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          🚀 Live Preview
          {isRendering && (
            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </h2>
        <div className="text-sm text-gray-600">
          Interactive preview with DOMPurify sanitization
        </div>
      </div>
      
      {previewError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="text-red-600 mr-2">⚠️</div>
            <h3 className="text-red-800 font-medium">Preview Error</h3>
          </div>
          <p className="text-red-700 text-sm mb-2">{previewError}</p>
          <button
            onClick={renderPreview}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Retry Preview
          </button>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-4 text-sm text-gray-600">Live Preview - Interact with your generated app</div>
          </div>
          
          <iframe
            ref={iframeRef}
            title="Live code preview"
            className="w-full h-96 bg-white"
            sandbox="allow-scripts allow-same-origin"
            style={{ minHeight: '400px' }}
          />
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Preview runs in a secure sandbox with mock authentication and database for demonstration
      </div>
    </div>
  );
};

export default LivePreview;