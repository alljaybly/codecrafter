import React, { useState, useEffect } from 'react';

interface Badge {
  id: number;
  user_id: string;
  badge_name: string;
  awarded_at: string;
}

const Badges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Badge definitions with icons and descriptions
  const badgeDefinitions = {
    'First Idea': {
      icon: '🎯',
      description: 'Submitted your first app idea',
      color: 'bg-blue-500'
    },
    'Voice Input Used': {
      icon: '🎤',
      description: 'Used voice input to describe an idea',
      color: 'bg-purple-500'
    },
    'Code Generator': {
      icon: '⚡',
      description: 'Generated your first piece of code',
      color: 'bg-green-500'
    },
    'Todo Master': {
      icon: '✅',
      description: 'Created a todo application',
      color: 'bg-yellow-500'
    },
    'Weather Wizard': {
      icon: '🌤️',
      description: 'Built a weather application',
      color: 'bg-cyan-500'
    },
    'Early Adopter': {
      icon: '🚀',
      description: 'One of the first users of CodeCrafter',
      color: 'bg-red-500'
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll simulate some badges
      // In a real app, you'd fetch from your API
      const mockBadges: Badge[] = [
        {
          id: 1,
          user_id: 'demo-user',
          badge_name: 'First Idea',
          awarded_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: 'demo-user',
          badge_name: 'Code Generator',
          awarded_at: new Date().toISOString()
        }
      ];
      
      setBadges(mockBadges);
    } catch (err) {
      setError('Failed to load badges');
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = (badgeName: string, isEarned: boolean = false, awardedAt?: string) => {
    const badge = badgeDefinitions[badgeName as keyof typeof badgeDefinitions];
    if (!badge) return null;

    return (
      <div
        className={`relative p-6 rounded-xl border-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 ${
          isEarned
            ? `${badge.color} text-white shadow-lg transform hover:scale-105 animate-bounce-in`
            : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
        }`}
        role="article"
        aria-label={`${badgeName} badge ${isEarned ? 'earned' : 'not earned'}`}
        tabIndex={0}
      >
        <div className="text-center">
          <div className="text-4xl mb-3" role="img" aria-label={`${badgeName} icon`}>
            {badge.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{badgeName}</h3>
          <p className={`text-sm ${isEarned ? 'text-white/90' : 'text-gray-500'}`}>
            {badge.description}
          </p>
          {isEarned && awardedAt && (
            <p className="text-xs text-white/70 mt-2">
              Earned {new Date(awardedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {isEarned && (
          <div 
            className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce-in"
            aria-label="Badge earned"
            role="img"
          >
            ✓
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="badges" className="py-16 bg-white" aria-label="Achievement badges section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Achievement Badges
            </h2>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading badges">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600" aria-live="polite">Loading badges...</p>
          </div>
        </div>
      </section>
    );
  }

  const earnedBadges = Array.isArray(badges) ? badges.map(b => b.badge_name) : [];
  const allBadgeNames = Object.keys(badgeDefinitions);

  return (
    <section id="badges" className="py-16 bg-white" aria-label="Achievement badges section">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Achievement Badges
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock badges as you explore CodeCrafter's features. 
            Each badge represents a milestone in your coding journey.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2" aria-label={`${earnedBadges.length} badges earned`}>
                {earnedBadges.length}
              </div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2" aria-label={`${allBadgeNames.length} total badges available`}>
                {allBadgeNames.length}
              </div>
              <div className="text-gray-600">Total Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2" aria-label={`${Math.round((earnedBadges.length / allBadgeNames.length) * 100)}% completion rate`}>
                {Math.round((earnedBadges.length / allBadgeNames.length) * 100)}%
              </div>
              <div className="text-gray-600">Completion</div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 animate-fade-in" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchBadges}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
              aria-label="Retry loading badges"
            >
              Try again
            </button>
          </div>
        )}

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Achievement badges">
          {allBadgeNames.map((badgeName, index) => {
            const earnedBadge = Array.isArray(badges) ? badges.find(b => b.badge_name === badgeName) : undefined;
            return (
              <div
                key={badgeName}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
              >
                {renderBadge(
                  badgeName,
                  !!earnedBadge,
                  earnedBadge?.awarded_at
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Earning Badges Today!
            </h3>
            <p className="text-gray-600 mb-6">
              Use CodeCrafter to generate your first app and unlock the "First Idea" badge.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('home');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Go to code generator to start earning badges"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Badges;