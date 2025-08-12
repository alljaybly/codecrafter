-- CodeCrafter Complete Database Setup (FIXED for Supabase)
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE IDEAS TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS generated_code (
    id BIGSERIAL PRIMARY KEY,
    idea TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_code_generated_at ON generated_code(generated_at DESC);
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists, then create it (FIXED)
DROP POLICY IF EXISTS "Allow all operations on generated_code" ON generated_code;
CREATE POLICY "Allow all operations on generated_code" ON generated_code FOR ALL USING (true);

-- =====================================================
-- 2. CREATE ENHANCED BADGE LIBRARY SYSTEM
-- =====================================================

-- Drop existing badge tables for clean setup
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

-- Create the badges library table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    color VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    criteria VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) NOT NULL DEFAULT 'common',
    points INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges junction table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Create indexes
CREATE INDEX idx_badges_criteria ON badges(criteria);
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_awarded_at ON user_badges(awarded_at);

-- Enable Row Level Security
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies (FIXED - no IF NOT EXISTS)
DROP POLICY IF EXISTS "Allow read access to badges" ON badges;
CREATE POLICY "Allow read access to badges" ON badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all operations on user_badges" ON user_badges;
CREATE POLICY "Allow all operations on user_badges" ON user_badges FOR ALL USING (true);

-- =====================================================
-- 3. INSERT 23 UNIQUE BADGES
-- =====================================================

INSERT INTO badges (name, description, color, icon, criteria, category, rarity, points) VALUES
-- Starter Badges
('Idea Pioneer', 'Submitted your first brilliant idea', 'blue-500', 'HiLightBulb', 'first_idea', 'starter', 'common', 10),
('Voice Master', 'Used voice input to describe an idea', 'purple-500', 'HiMicrophone', 'first_voice', 'starter', 'common', 15),
('Code Wizard', 'Generated your first piece of code', 'green-500', 'HiCode', 'first_code', 'starter', 'common', 10),
('Early Adopter', 'One of the first users of CodeCrafter', 'red-500', 'HiStar', 'early_user', 'starter', 'rare', 25),

-- Productivity Badges
('Idea Machine', 'Submitted 5 different ideas', 'cyan-500', 'HiCog', 'ideas_5', 'productivity', 'common', 20),
('Prolific Creator', 'Submitted 10 different ideas', 'indigo-500', 'HiCollection', 'ideas_10', 'productivity', 'rare', 35),
('Innovation Engine', 'Submitted 25 different ideas', 'pink-500', 'HiSparkles', 'ideas_25', 'productivity', 'epic', 50),
('Idea Mastermind', 'Submitted 50 different ideas', 'yellow-500', 'HiAcademicCap', 'ideas_50', 'productivity', 'legendary', 100),

-- Consistency Badges
('Streak Starter', 'Generated ideas for 3 consecutive days', 'orange-500', 'HiFire', 'streak_3', 'consistency', 'rare', 30),
('Consistency King', 'Generated ideas for 7 consecutive days', 'red-600', 'HiTrendingUp', 'streak_7', 'consistency', 'epic', 60),
('Dedication Master', 'Generated ideas for 14 consecutive days', 'purple-600', 'HiShieldCheck', 'streak_14', 'consistency', 'legendary', 120),

-- Specialty Badges
('Todo Master', 'Created a todo application idea', 'yellow-600', 'HiCheckCircle', 'todo_app', 'specialty', 'common', 15),
('Weather Wizard', 'Built a weather application idea', 'blue-400', 'HiSun', 'weather_app', 'specialty', 'common', 15),
('Game Developer', 'Created a game application idea', 'green-600', 'HiPuzzle', 'game_app', 'specialty', 'rare', 25),
('E-commerce Expert', 'Created an e-commerce application idea', 'emerald-500', 'HiShoppingCart', 'ecommerce_app', 'specialty', 'rare', 25),
('Social Media Guru', 'Created a social media application idea', 'pink-400', 'HiHeart', 'social_app', 'specialty', 'rare', 25),
('AI Enthusiast', 'Created an AI-powered application idea', 'violet-500', 'HiChip', 'ai_app', 'specialty', 'epic', 40),

-- Technical Badges
('Voice Virtuoso', 'Used voice input 10 times', 'purple-400', 'HiSpeakerphone', 'voice_10', 'technical', 'rare', 35),
('Speed Demon', 'Generated code in under 5 seconds', 'red-400', 'HiLightningBolt', 'fast_generation', 'technical', 'rare', 30),
('Night Owl', 'Generated ideas between 10PM and 6AM', 'indigo-400', 'HiMoon', 'night_activity', 'technical', 'common', 20),
('Weekend Warrior', 'Generated ideas on weekends', 'teal-500', 'HiCalendar', 'weekend_activity', 'technical', 'common', 20),

-- Achievement Badges
('Perfectionist', 'Generated 10 ideas without errors', 'yellow-400', 'HiShield', 'perfect_streak', 'achievement', 'epic', 75),
('Community Builder', 'Shared ideas that inspired others', 'rose-500', 'HiUsers', 'community_impact', 'achievement', 'epic', 80),
('Innovation Legend', 'Reached the highest tier of creativity', 'purple-500', 'HiSparkles', 'legend_status', 'achievement', 'legendary', 200);

-- =====================================================
-- 4. AWARD INITIAL BADGES TO DEMO USER
-- =====================================================

INSERT INTO user_badges (user_id, badge_id) 
SELECT 'demo-user', id FROM badges 
WHERE criteria IN ('early_user', 'first_idea', 'first_code', 'todo_app', 'weather_wizard') 
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- =====================================================
-- 5. CREATE USEFUL VIEWS
-- =====================================================

CREATE OR REPLACE VIEW badge_stats AS
SELECT 
    b.id, b.name, b.category, b.rarity, b.points,
    COUNT(ub.id) as times_awarded,
    COUNT(DISTINCT ub.user_id) as unique_users
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.id, b.name, b.category, b.rarity, b.points
ORDER BY b.rarity DESC, b.points DESC;

CREATE OR REPLACE VIEW user_progress AS
SELECT 
    ub.user_id,
    COUNT(*) as badges_earned,
    SUM(b.points) as total_points,
    COUNT(CASE WHEN b.rarity = 'common' THEN 1 END) as common_badges,
    COUNT(CASE WHEN b.rarity = 'rare' THEN 1 END) as rare_badges,
    COUNT(CASE WHEN b.rarity = 'epic' THEN 1 END) as epic_badges,
    COUNT(CASE WHEN b.rarity = 'legendary' THEN 1 END) as legendary_badges,
    MIN(ub.awarded_at) as first_badge,
    MAX(ub.awarded_at) as latest_badge
FROM user_badges ub
JOIN badges b ON ub.badge_id = b.id
GROUP BY ub.user_id
ORDER BY total_points DESC;

-- =====================================================
-- 6. INSERT SAMPLE IDEAS (optional)
-- =====================================================

INSERT INTO generated_code (idea, generated_at) VALUES 
    ('Create a todo app with user authentication', NOW() - INTERVAL '2 days'),
    ('Build a weather dashboard with real-time data', NOW() - INTERVAL '1 day'),
    ('Make a simple blog platform', NOW() - INTERVAL '1 hour'),
    ('Develop a chat application with WebSocket', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

SELECT '🎉 CodeCrafter Database Setup Complete!' as status;
SELECT COUNT(*) as total_badges FROM badges;
SELECT COUNT(*) as demo_user_badges FROM user_badges WHERE user_id = 'demo-user';
SELECT COUNT(*) as total_ideas FROM generated_code;

-- Show awarded badges
SELECT 
    b.name as badge_name,
    b.rarity,
    b.points,
    ub.awarded_at
FROM user_badges ub
JOIN badges b ON ub.badge_id = b.id
WHERE ub.user_id = 'demo-user'
ORDER BY ub.awarded_at DESC;

SELECT 'Badge Library API will now work with 23+ badges!' as final_message;