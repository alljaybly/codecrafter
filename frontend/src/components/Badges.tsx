import React, { useState, useEffect } from 'react';
import * as HiIcons from 'react-icons/hi';

interface Badge {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  criteria: string;
  category: string;
  rarity: string;
  points: number;
  created_at: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  badge: Badge;
}

interface BadgeLibraryResponse {
  badges: Badge[];
  userBadges: UserBadge[];
  stats: {
    totalBadges: number;
    earnedBadges: number;
    totalPoints: number;
    completionPercentage: number;
  };
}

const Badges: React.FC = () => {
  const [badgeLibrary, setBadgeLibrary] = useState<BadgeLibraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Rarity colors and styles
  const rarityStyles = {
    common: {
      border: 'border-gray-300',
      glow: 'shadow-md',
      textColor: 'text-gray-700'
    },
    rare: {
      border: 'border-blue-400',
      glow: 'shadow-lg shadow-blue-200',
      textColor: 'text-blue-700'
    },
    epic: {
      border: 'border-purple-400',
      glow: 'shadow-lg shadow-purple-200',
      textColor: 'text-purple-700'
    },
    legendary: {
      border: 'border-yellow-400',
      glow: 'shadow-xl shadow-yellow-200',
      textColor: 'text-yellow-700'
    }
  };

  // Category colors
  const categoryColors = {
    all: 'bg-gray-500',
    starter: 'bg-green-500',
    productivity: 'bg-blue-500',
    consistency: 'bg-orange-500',
    specialty: 'bg-purple-500',
    technical: 'bg-cyan-500',
    achievement: 'bg-pink-500'
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL || '/.netlify/functions';

  useEffect(() => {
    // Initial load
    fetchBadgeLibrary();
    
    // Set up event-driven updates
    const handleBadgeUpdate = () => {
      console.log('🏆 Badge library update event triggered');
      fetchBadgeLibrary();
    };
    
    // Listen for custom badge update events
    window.addEventListener('badgeUpdate', handleBadgeUpdate);
    
    // Listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      fetchBadgeLibrary();
    };
    window.addEventListener('focus', handleFocus);
    
    // Background sync every 2 minutes
    const interval = setInterval(() => {
      fetchBadgeLibrary();
    }, 120000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('badgeUpdate', handleBadgeUpdate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBadgeLibrary = async () => {
    try {
      // Only show loading on initial load
      if (!badgeLibrary) {
        setLoading(true);
      }
      setError(null);
      
      // Fetch badge library from the API
      const response = await fetch(`${API_BASE_URL}/badge-library`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData: BadgeLibraryResponse = await response.json();
      
      // Only update if data has actually changed
      const hasChanged = !badgeLibrary || 
        JSON.stringify(badgeLibrary.userBadges.map(b => b.id).sort()) !== 
        JSON.stringify(responseData.userBadges.map(b => b.id).sort());
      
      if (hasChanged || !badgeLibrary) {
        console.log('🏆 Badge library updated:', responseData.stats);
        if (badgeLibrary && responseData.userBadges.length > badgeLibrary.userBadges.length) {
          console.log(`🎉 New badges earned: ${responseData.userBadges.length - badgeLibrary.userBadges.length}`);
        }
        setBadgeLibrary(responseData);
      }
      
    } catch (apiError) {
      console.error('Failed to fetch badge library:', apiError);
      
      if (apiError instanceof Error) {
        if (apiError.message.includes('404')) {
          setError('Badge library service not available. Please try again later.');
        } else if (apiError.message.includes('500')) {
          setError('Database temporarily unavailable. Your badges will appear here once you earn them.');
        } else {
          setError('Unable to connect to database. Generate ideas and use features to earn badges.');
        }
      } else {
        setError('Connection error. Earn badges by using CodeCrafter features.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = (badge: Badge, isEarned: boolean = false, awardedAt?: string) => {
    const IconComponent = HiIcons[badge.icon as keyof typeof HiIcons] as React.ComponentType<any>;
    const rarityStyle = rarityStyles[badge.rarity as keyof typeof rarityStyles];
    
    return (
      <div
        className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-110 transform cursor-pointer ${
          isEarned
            ? `bg-gradient-to-r from-${badge.color} to-${badge.color.replace('-500', '-600')} text-white ${rarityStyle.glow} ${rarityStyle.border}`
            : `bg-gray-100 ${rarityStyle.border} opacity-50 hover:opacity-75`
        }`}
        role="article"
        aria-label={`Badge: ${badge.name} - ${badge.description} ${isEarned ? '(earned)' : '(not earned)'}`}
        tabIndex={0}
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            {IconComponent && (
              <IconComponent 
                className={`w-8 h-8 ${isEarned ? 'text-white' : 'text-gray-400'}`}
                aria-hidden="true"
              />
            )}
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isEarned ? 'text-white' : 'text-gray-600'}`}>
            {badge.name}
          </h3>
          <p className={`text-sm mb-2 ${isEarned ? 'text-white/90' : 'text-gray-500'}`}>
            {badge.description}
          </p>
          <div className={`text-xs ${isEarned ? 'text-white/80' : 'text-gray-400'}`}>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-1 ${
              isEarned ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {badge.rarity.toUpperCase()}
            </span>
            <div>{badge.points} points</div>
          </div>
          {isEarned && awardedAt && (
            <p className="text-xs text-white/70 mt-2">
              Earned {new Date(awardedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {isEarned && (
          <div 
            className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce"
            aria-label="Badge earned"
            role="img"
          >
            ✓
          </div>
        )}
        {badge.rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 pointer-events-none animate-pulse"></div>
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

  if (!badgeLibrary) {
    return null;
  }

  const { badges, userBadges, stats } = badgeLibrary;
  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
  
  // Filter badges by category
  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(badges.map(b => b.category)))];
  
  // Group badges by rarity for display
  const badgesByRarity = {
    legendary: filteredBadges.filter(b => b.rarity === 'legendary'),
    epic: filteredBadges.filter(b => b.rarity === 'epic'),
    rare: filteredBadges.filter(b => b.rarity === 'rare'),
    common: filteredBadges.filter(b => b.rarity === 'common')
  };

  return (
    <section id="badges" className="py-16 bg-white" aria-label="Achievement badges section">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Badge Library
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Discover and collect 20+ unique achievement badges! Each badge represents a milestone in your coding journey.
          </p>
          <p className="text-sm text-gray-500">
            Updates automatically when you earn new badges • Generate ideas and use features to unlock achievements
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2" aria-label={`${stats.earnedBadges} badges earned`}>
                {stats.earnedBadges}
              </div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2" aria-label={`${stats.totalBadges} total badges available`}>
                {stats.totalBadges}
              </div>
              <div className="text-gray-600">Total Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2" aria-label={`${stats.completionPercentage}% completion rate`}>
                {stats.completionPercentage}%
              </div>
              <div className="text-gray-600">Completion</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2" aria-label={`${stats.totalPoints} total points earned`}>
                {stats.totalPoints}
              </div>
              <div className="text-gray-600">Total Points</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? `${categoryColors[category as keyof typeof categoryColors]} text-white shadow-lg`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`Filter badges by ${category} category`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && (
                <span className="ml-1 text-xs opacity-75">
                  ({badges.filter(b => b.category === category).length})
                </span>
              )}
            </button>
          ))}
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
              onClick={fetchBadgeLibrary}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
              aria-label="Retry loading badge library"
            >
              Try again
            </button>
          </div>
        )}

        {/* Badges Grid by Rarity */}
        {Object.entries(badgesByRarity).map(([rarity, rarityBadges]) => {
          if (rarityBadges.length === 0) return null;
          
          return (
            <div key={rarity} className="mb-12">
              <h3 className={`text-2xl font-bold mb-6 text-center ${rarityStyles[rarity as keyof typeof rarityStyles].textColor}`}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)} Badges
                <span className="text-sm font-normal ml-2 opacity-75">
                  ({rarityBadges.filter(b => earnedBadgeIds.includes(b.id)).length}/{rarityBadges.length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label={`${rarity} badges`}>
                {rarityBadges.map((badge, index) => {
                  const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
                  const isEarned = !!userBadge;
                  
                  return (
                    <div
                      key={badge.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                      role="listitem"
                    >
                      {renderBadge(badge, isEarned, userBadge?.awarded_at)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Progress and Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {stats.earnedBadges === 0 ? 'Start Your Badge Collection!' : 'Keep Collecting Badges!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {stats.earnedBadges === 0 
                ? 'Generate your first idea to unlock the "Idea Pioneer" badge and begin your journey!'
                : `You've earned ${stats.earnedBadges} badges and ${stats.totalPoints} points. Keep going to unlock more achievements!`
              }
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
                aria-label={`${stats.completionPercentage}% progress`}
              ></div>
            </div>
            
            <button
              onClick={() => {
                const element = document.getElementById('home');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
              aria-label="Go to code generator to earn more badges"
            >
              {stats.earnedBadges === 0 ? 'Start Earning Badges' : 'Earn More Badges'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Badges;