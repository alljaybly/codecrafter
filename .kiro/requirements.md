# CodeCrafter Badge Library System

## Overview
The Badge Library is a comprehensive achievement system with 20+ unique badges that users can earn by performing various actions in CodeCrafter. The system uses Supabase for data storage and React with Tailwind CSS for the frontend display.

## Database Schema

### Badges Table
```sql
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    color VARCHAR(50) NOT NULL, -- Tailwind color class
    icon VARCHAR(50) NOT NULL,  -- React Icons name
    criteria VARCHAR(100) NOT NULL, -- Award criteria identifier
    category VARCHAR(50) NOT NULL, -- Badge category
    rarity VARCHAR(20) NOT NULL DEFAULT 'common', -- common, rare, epic, legendary
    points INTEGER NOT NULL DEFAULT 10, -- Points awarded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Badges Table
```sql
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id) -- Prevent duplicate badges
);
```

## Badge Categories and Examples

### Starter Badges (Common)
- **Idea Pioneer**: Submitted your first brilliant idea
- **Voice Master**: Used voice input to describe an idea
- **Code Wizard**: Generated your first piece of code
- **Early Adopter**: One of the first users of CodeCrafter

### Productivity Badges (Common to Legendary)
- **Idea Machine**: Submitted 5 different ideas (20 points)
- **Prolific Creator**: Submitted 10 different ideas (35 points)
- **Innovation Engine**: Submitted 25 different ideas (50 points)
- **Idea Mastermind**: Submitted 50 different ideas (100 points)

### Consistency Badges (Rare to Legendary)
- **Streak Starter**: Generated ideas for 3 consecutive days (30 points)
- **Consistency King**: Generated ideas for 7 consecutive days (60 points)
- **Dedication Master**: Generated ideas for 14 consecutive days (120 points)

### Specialty Badges (Common to Epic)
- **Todo Master**: Created a todo application idea
- **Weather Wizard**: Built a weather application idea
- **Game Developer**: Created a game application idea
- **E-commerce Expert**: Created an e-commerce application idea
- **Social Media Guru**: Created a social media application idea
- **AI Enthusiast**: Created an AI-powered application idea

### Technical Badges (Rare to Epic)
- **Voice Virtuoso**: Used voice input 10 times
- **Speed Demon**: Generated code in under 5 seconds
- **Night Owl**: Generated ideas between 10PM and 6AM
- **Weekend Warrior**: Generated ideas on weekends

### Achievement Badges (Epic to Legendary)
- **Perfectionist**: Generated 10 ideas without errors (75 points)
- **Community Builder**: Shared ideas that inspired others (80 points)
- **Innovation Legend**: Reached the highest tier of creativity (200 points)

## Award Criteria

### Automatic Badge Awarding
Badges are automatically awarded based on user actions:

- `first_idea`: First idea submission
- `first_voice`: First voice input usage
- `first_code`: First code generation
- `ideas_5`, `ideas_10`, `ideas_25`, `ideas_50`: Idea count milestones
- `voice_10`: Voice input usage milestone
- `todo_app`, `weather_app`, `game_app`, etc.: Content-based awards
- `night_activity`: Time-based awards (10PM-6AM)
- `weekend_activity`: Day-based awards (Saturday/Sunday)
- `streak_3`, `streak_7`, `streak_14`: Consecutive day streaks

## Frontend Implementation

### Badge Display Features
- **Responsive Grid**: 3 columns on desktop, 1 on mobile
- **Rarity-based Styling**: Different colors and effects for common, rare, epic, legendary
- **Category Filtering**: Filter badges by category (starter, productivity, etc.)
- **Progress Tracking**: Visual progress bar and statistics
- **Accessibility**: Full ARIA labels and keyboard navigation
- **Hover Effects**: Scale and glow effects on hover

### Styling Classes
- **Earned Badges**: `bg-gradient-to-r from-{color}-500 to-{color}-600`
- **Unearned Badges**: `bg-gray-100 opacity-50`
- **Rarity Borders**: Different border colors for each rarity
- **Icons**: React Icons from `react-icons/hi` package

## API Endpoints

### GET /badge-library
Returns complete badge library data:
```json
{
  "badges": [...], // All available badges
  "userBadges": [...], // User's earned badges
  "stats": {
    "totalBadges": 23,
    "earnedBadges": 8,
    "totalPoints": 180,
    "completionPercentage": 35
  }
}
```

### POST /generate-code
Enhanced to award badges automatically:
```json
{
  "id": 123,
  "idea": "Build a todo app",
  "code": "...",
  "newBadges": [
    {
      "name": "Todo Master",
      "points": 15,
      "rarity": "common"
    }
  ]
}
```

## Testing

### Frontend Tests
- Badge rendering (earned vs unearned)
- Category filtering functionality
- Hover effects and accessibility
- Statistics calculation
- Progress bar display

### Backend Tests
- Badge award logic for different criteria
- Duplicate badge prevention
- Database query performance
- Error handling

## Setup Instructions

1. **Database Setup**: Run `database/badge-library-setup.sql` in Supabase
2. **Install Dependencies**: `npm install react-icons` in frontend
3. **Environment**: Ensure Supabase credentials are configured
4. **Deploy**: Build and deploy to Netlify

## Performance Considerations

- **Efficient Queries**: Uses joins to fetch user badges with badge details
- **Caching**: Badge library data is cached and only updates when changed
- **Event-driven Updates**: Real-time updates triggered by user actions
- **Optimized Rendering**: Only re-renders when badge data actually changes

## Future Enhancements

- **Streak Tracking**: Advanced consecutive day tracking
- **Social Features**: Badge sharing and leaderboards
- **Custom Badges**: User-created or admin-awarded special badges
- **Badge Notifications**: Toast notifications when badges are earned
- **Export Features**: Badge collection export and sharing