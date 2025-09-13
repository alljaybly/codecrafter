-- CodeCrafter Badge Library Setup
-- Enhanced badge system with 20+ unique badges

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

-- Create the badges library table
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

-- Create user_badges junction table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL, -- Using string for demo user
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id) -- Prevent duplicate badges
);

-- Create indexes for performance
CREATE INDEX idx_badges_criteria ON badges(criteria);
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_awarded_at ON user_badges(awarded_at);

-- Enable Row Level Security
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Allow all operations on user_badges" ON user_badges FOR ALL USING (true);

-- Insert 20+ unique badges
INSERT INTO badges (name, description, color, icon, criteria, category, rarity, points) VALUES
-- Starter Badges (Common)
('Idea Pioneer', 'Submitted your first brilliant idea', 'blue-500', 'HiLightBulb', 'first_idea', 'starter', 'common', 10),
('Voice Master', 'Used voice input to describe an idea', 'purple-500', 'HiMicrophone', 'first_voice', 'starter', 'common', 15),
('Code Wizard', 'Generated your first piece of code', 'green-500', 'HiCode', 'first_code', 'starter', 'common', 10),
('Early Adopter', 'One of the first users of CodeCrafter', 'red-500', 'HiStar', 'early_user', 'starter', 'rare', 25),

-- Productivity Badges (Common to Rare)
('Idea Machine', 'Submitted 5 different ideas', 'cyan-500', 'HiCog', 'ideas_5', 'productivity', 'common', 20),
('Prolific Creator', 'Submitted 10 different ideas', 'indigo-500', 'HiCollection', 'ideas_10', 'productivity', 'rare', 35),
('Innovation Engine', 'Submitted 25 different ideas', 'pink-500', 'HiSparkles', 'ideas_25', 'productivity', 'epic', 50),
('Idea Mastermind', 'Submitted 50 different ideas', 'yellow-500', 'HiAcademicCap', 'ideas_50', 'productivity', 'legendary', 100),

-- Streak Badges (Rare to Epic)
('Streak Starter', 'Generated ideas for 3 consecutive days', 'orange-500', 'HiFire', 'streak_3', 'consistency', 'rare', 30),
('Consistency King', 'Generated ideas for 7 consecutive days', 'red-600', 'HiTrendingUp', 'streak_7', 'consistency', 'epic', 60),
('Dedication Master', 'Generated ideas for 14 consecutive days', 'purple-600', 'HiShieldCheck', 'streak_14', 'consistency', 'legendary', 120),

-- Specialty Badges (Common to Epic)
('Todo Master', 'Created a todo application idea', 'yellow-600', 'HiCheckCircle', 'todo_app', 'specialty', 'common', 15),
('Weather Wizard', 'Built a weather application idea', 'blue-400', 'HiSun', 'weather_app', 'specialty', 'common', 15),
('Game Developer', 'Created a game application idea', 'green-600', 'HiPuzzle', 'game_app', 'specialty', 'rare', 25),
('E-commerce Expert', 'Created an e-commerce application idea', 'emerald-500', 'HiShoppingCart', 'ecommerce_app', 'specialty', 'rare', 25),
('Social Media Guru', 'Created a social media application idea', 'pink-400', 'HiHeart', 'social_app', 'specialty', 'rare', 25),
('AI Enthusiast', 'Created an AI-powered application idea', 'violet-500', 'HiChip', 'ai_app', 'specialty', 'epic', 40),

-- Technical Badges (Rare to Epic)
('Voice Virtuoso', 'Used voice input 10 times', 'purple-400', 'HiSpeakerphone', 'voice_10', 'technical', 'rare', 35),
('Speed Demon', 'Generated code in under 5 seconds', 'red-400', 'HiLightningBolt', 'fast_generation', 'technical', 'rare', 30),
('Night Owl', 'Generated ideas between 10PM and 6AM', 'indigo-400', 'HiMoon', 'night_activity', 'technical', 'common', 20),
('Weekend Warrior', 'Generated ideas on weekends', 'teal-500', 'HiCalendar', 'weekend_activity', 'technical', 'common', 20),

-- IoT Specialist Badges (Rare to Epic)
('IoT Pioneer', 'Created your first IoT device code', 'blue-600', 'HiChip', 'iot_pioneer', 'iot', 'rare', 40),
('Arduino Master', 'Generated Arduino code like a pro', 'green-600', 'HiCog', 'arduino_master', 'iot', 'rare', 35),
('Raspberry Pi Expert', 'Mastered Raspberry Pi development', 'red-500', 'HiDesktopComputer', 'raspberry_pi_expert', 'iot', 'rare', 35),
('ESP32 Wizard', 'Created WiFi-enabled IoT solutions', 'purple-600', 'HiWifi', 'esp32_wizard', 'iot', 'epic', 50),
('Sensor Specialist', 'Built sensor monitoring systems', 'yellow-500', 'HiEye', 'sensor_specialist', 'iot', 'rare', 30),
('LED Controller', 'Mastered LED control and automation', 'orange-500', 'HiLightBulb', 'led_controller', 'iot', 'common', 20),

-- Language Mastery Badges (Rare to Epic)
('Rust Developer', 'Generated Rust code with precision', 'orange-600', 'HiCode', 'rust_developer', 'language', 'epic', 60),
('Python Expert', 'Mastered Python development', 'blue-500', 'HiTerminal', 'python_expert', 'language', 'rare', 30),
('JavaScript Ninja', 'Created powerful JavaScript applications', 'yellow-400', 'HiLightningBolt', 'javascript_ninja', 'language', 'rare', 30),

-- Time-based Achievement Badges
('Early Bird', 'Generated code in the early morning', 'yellow-300', 'HiSun', 'early_bird', 'time', 'common', 15),

-- Achievement Badges (Epic to Legendary)
('Perfectionist', 'Generated 10 ideas without errors', 'gold', 'HiShield', 'perfect_streak', 'achievement', 'epic', 75),
('Community Builder', 'Shared ideas that inspired others', 'rose-500', 'HiUsers', 'community_impact', 'achievement', 'epic', 80),
('Innovation Legend', 'Reached the highest tier of creativity', 'gradient-to-r from-purple-500 to-pink-500', 'HiSparkles', 'legend_status', 'achievement', 'legendary', 200);

-- Create a view for badge statistics
CREATE OR REPLACE VIEW badge_stats AS
SELECT 
    b.id,
    b.name,
    b.category,
    b.rarity,
    b.points,
    COUNT(ub.id) as times_awarded,
    COUNT(DISTINCT ub.user_id) as unique_users
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.id, b.name, b.category, b.rarity, b.points
ORDER BY b.rarity DESC, b.points DESC;

-- Create a view for user progress
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

-- Award some initial badges to demo user
INSERT INTO user_badges (user_id, badge_id) 
SELECT 'demo-user', id FROM badges 
WHERE criteria IN ('early_user', 'first_idea', 'first_code') 
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- Success message
SELECT 'Badge Library setup completed successfully!' as message;
SELECT COUNT(*) as total_badges FROM badges;
SELECT COUNT(*) as demo_user_badges FROM user_badges WHERE user_id = 'demo-user';