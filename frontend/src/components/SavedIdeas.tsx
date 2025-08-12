import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SavedIdea {
  id: number;
  idea: string;
  generated_at: string;
}

const SavedIdeas: React.FC = () => {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(false); // Toggle state for collapsible section

  const API_BASE_URL = process.env.REACT_APP_API_URL || '/.netlify/functions';

  useEffect(() => {
    // Initial load
    fetchIdeas();
    
    // Set up event-driven updates - refresh when new ideas are generated
    const handleIdeasUpdate = () => {
      console.log('💡 Ideas update event triggered');
      fetchIdeas();
    };
    
    // Listen for custom ideas update events
    window.addEventListener('ideasUpdate', handleIdeasUpdate);
    
    // Listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      fetchIdeas();
    };
    window.addEventListener('focus', handleFocus);
    
    // Background sync every 2 minutes (much less aggressive)
    const interval = setInterval(() => {
      fetchIdeas();
    }, 120000); // 2 minutes
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('ideasUpdate', handleIdeasUpdate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchIdeas = async () => {
    try {
      // Only show loading on initial load, not on updates
      if (ideas.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      // Fetch real ideas from the API - no mock data
      const response = await axios.get(`${API_BASE_URL}/ideas`, {
        timeout: 10000 // 10 second timeout
      });
      
      // Ensure response.data is an array
      const responseData = Array.isArray(response.data) ? response.data : [];
      
      // Only update if data has actually changed
      const currentIdeaIds = ideas.map(i => i.id).sort();
      const newIdeaIds = responseData.map(i => i.id).sort();
      const hasChanged = JSON.stringify(currentIdeaIds) !== JSON.stringify(newIdeaIds);
      
      if (hasChanged || ideas.length === 0) {
        console.log('💡 Ideas updated:', responseData.length, 'ideas');
        if (responseData.length > ideas.length) {
          console.log(`🎉 New ideas found: ${responseData.length - ideas.length}`);
        }
        setIdeas(responseData);
        setLastUpdateTime(new Date());
      }
      
    } catch (apiError) {
      console.error('Failed to fetch ideas:', apiError);
      setIdeas([]); // Set empty array - no mock data
      
      if (axios.isAxiosError(apiError)) {
        if (apiError.code === 'ECONNABORTED') {
          setError('Request timeout. Please check your internet connection and try again.');
        } else if (apiError.response?.status === 404) {
          setError('Ideas service not available. Please try again later.');
        } else if (apiError.response && apiError.response.status >= 500) {
          setError('Database temporarily unavailable. Your ideas will appear here once you generate them.');
        } else {
          setError('Unable to connect to database. Generate ideas to see them appear here.');
        }
      } else {
        setError('Connection error. Generate ideas and they will appear here once connected.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const truncateIdea = (idea: string, maxLength: number = 100) => {
    if (idea.length <= maxLength) return idea;
    return idea.substring(0, maxLength) + '...';
  };

  const toggleExpanded = (ideaId: number) => {
    setExpandedIdea(expandedIdea === ideaId ? null : ideaId);
  };

  if (loading) {
    return (
      <section id="saved-ideas" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Toggle Header - Loading State */}
          <div className="text-center mb-8 animate-fade-in">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center justify-center mx-auto px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
              aria-expanded={isExpanded}
              aria-controls="saved-ideas-content"
              aria-label={`${isExpanded ? 'Hide' : 'Show'} saved ideas section`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mr-3">
                Saved Ideas (Loading...)
              </h2>
              <svg
                className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Loading skeleton */}
          {isExpanded && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600" aria-live="polite">Loading ideas...</p>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="saved-ideas" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Toggle Header */}
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center justify-center mx-auto px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
            aria-expanded={isExpanded}
            aria-controls="saved-ideas-content"
            aria-label={`${isExpanded ? 'Hide' : 'Show'} saved ideas section`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mr-3">
              Saved Ideas ({Array.isArray(ideas) ? ideas.length : 0})
            </h2>
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="mt-6 animate-fade-in">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
                Real-time view of your generated ideas. Create new ideas above to see them appear here instantly!
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdateTime.toLocaleTimeString()} • Updates automatically when you generate new ideas
              </p>
            </div>
          )}
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div id="saved-ideas-content" className="animate-fade-in">
            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Array.isArray(ideas) ? ideas.length : 0}
              </div>
              <div className="text-gray-600">Total Ideas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Array.isArray(ideas) ? ideas.filter(idea => {
                  const date = new Date(idea.generated_at);
                  const today = new Date();
                  return date.toDateString() === today.toDateString();
                }).length : 0}
              </div>
              <div className="text-gray-600">Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Array.isArray(ideas) ? ideas.filter(idea => {
                  const date = new Date(idea.generated_at);
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return date >= weekAgo;
                }).length : 0}
              </div>
              <div className="text-gray-600">This Week</div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchIdeas}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
              aria-label="Retry loading ideas"
            >
              Try again
            </button>
          </div>
        )}

        {/* Ideas Grid */}
        {!Array.isArray(ideas) || ideas.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No ideas yet</h3>
            <p className="text-gray-500 mb-6">Start creating your first app idea to see it here!</p>
            <button
              onClick={() => {
                const element = document.getElementById('home');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              aria-label="Go to idea generator"
            >
              Create Your First Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(ideas) && ideas.map((idea, index) => (
              <div
                key={idea.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">
                        Idea #{idea.id}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {expandedIdea === idea.id ? idea.idea : truncateIdea(idea.idea)}
                    </p>
                    {idea.idea.length > 100 && (
                      <button
                        onClick={() => toggleExpanded(idea.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                        aria-label={expandedIdea === idea.id ? 'Show less' : 'Show more'}
                      >
                        {expandedIdea === idea.id ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {formatDate(idea.generated_at)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        // Copy idea to clipboard
                        navigator.clipboard.writeText(idea.idea);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      aria-label="Copy idea to clipboard"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        // Regenerate code for this idea
                        const element = document.getElementById('home');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          // You could also pre-fill the form with this idea
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      aria-label="Regenerate code for this idea"
                      title="Regenerate code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchIdeas}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Refresh ideas list"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Ideas
              </span>
            )}
          </button>
        </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedIdeas;