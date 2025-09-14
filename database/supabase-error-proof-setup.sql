-- CodeCrafter Database Setup - ERROR PROOF VERSION
-- This script handles all edge cases and existing table scenarios

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (clean slate approach)
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS badge_library CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;

-- Create ideas table
CREATE TABLE ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea TEXT NOT NULL,
  generated_code TEXT,
  language VARCHAR(50) DEFAULT 'html',
  platform VARCHAR(50) DEFAULT 'web',
  used_voice_input BOOLEAN DEFAULT false,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badge_library table FIRST (referenced by badges)
CREATE TABLE badge_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  points_required INTEGER NOT NULL DEFAULT 0,
  rarity VARCHAR(20) DEFAULT 'common',
  unlock_condition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badges table with ALL required columns
CREATE TABLE badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(50),
  points_required INTEGER DEFAULT 0,
  is_earned BOOLEAN DEFAULT false,
  earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert badge library data
INSERT INTO badge_library (name, description, icon, category, points_required, rarity, unlock_condition) VALUES
('First Steps', 'Generated your first piece of code', '🚀', 'milestone', 0, 'common', 'Generate any code'),
('Voice Pioneer', 'Used voice input for the first time', '🎤', 'interaction', 0, 'common', 'Use voice input feature'),
('Web Developer', 'Created 5 web applications', '🌐', 'platform', 50, 'uncommon', 'Generate 5 web apps'),
('IoT Explorer', 'Built your first IoT project', '🔧', 'platform', 25, 'uncommon', 'Generate Arduino/ESP32/RPi code'),
('Code Artisan', 'Generated 10 different projects', '🎨', 'milestone', 100, 'rare', 'Generate 10 projects'),
('Multi-Platform Master', 'Used all available platforms', '🏆', 'achievement', 150, 'rare', 'Use web, Arduino, ESP32, and RPi'),
('Voice Virtuoso', 'Used voice input 20 times', '🗣️', 'interaction', 200, 'epic', 'Use voice input 20 times'),
('Innovation Legend', 'Generated 50 unique projects', '⭐', 'milestone', 500, 'legendary', 'Generate 50 projects');

-- Insert starter badges (points_required = 0)
INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
SELECT name, description, icon, category, points_required, true, NOW()
FROM badge_library 
WHERE points_required = 0;

-- Create indexes for performance
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_language ON ideas(language);
CREATE INDEX idx_ideas_platform ON ideas(platform);
CREATE INDEX idx_badges_earned ON badges(is_earned);
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badge_library_category ON badge_library(category);
CREATE INDEX idx_badge_library_points ON badge_library(points_required);

-- Enable Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_library ENABLE ROW LEVEL SECURITY;

-- Create public access policies
CREATE POLICY "Allow public read access on ideas" ON ideas FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ideas" ON ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ideas" ON ideas FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Allow public insert on badges" ON badges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on badges" ON badges FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on badge_library" ON badge_library FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ideas table
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create badge awarding function
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    total_projects INTEGER;
    voice_usage_count INTEGER;
    platforms_used INTEGER;
BEGIN
    -- Count total projects
    SELECT COUNT(*) INTO total_projects FROM ideas;
    
    -- Count voice input usage
    SELECT COUNT(*) INTO voice_usage_count FROM ideas WHERE used_voice_input = true;
    
    -- Count unique platforms used
    SELECT COUNT(DISTINCT platform) INTO platforms_used FROM ideas;
    
    -- Award milestone badges
    IF total_projects >= 5 THEN
        INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
        SELECT name, description, icon, category, points_required, true, NOW()
        FROM badge_library 
        WHERE name = 'Web Developer' AND NOT EXISTS (
            SELECT 1 FROM badges WHERE name = 'Web Developer' AND is_earned = true
        );
    END IF;
    
    IF total_projects >= 10 THEN
        INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
        SELECT name, description, icon, category, points_required, true, NOW()
        FROM badge_library 
        WHERE name = 'Code Artisan' AND NOT EXISTS (
            SELECT 1 FROM badges WHERE name = 'Code Artisan' AND is_earned = true
        );
    END IF;
    
    IF total_projects >= 50 THEN
        INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
        SELECT name, description, icon, category, points_required, true, NOW()
        FROM badge_library 
        WHERE name = 'Innovation Legend' AND NOT EXISTS (
            SELECT 1 FROM badges WHERE name = 'Innovation Legend' AND is_earned = true
        );
    END IF;
    
    -- Award voice usage badges
    IF voice_usage_count >= 20 THEN
        INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
        SELECT name, description, icon, category, points_required, true, NOW()
        FROM badge_library 
        WHERE name = 'Voice Virtuoso' AND NOT EXISTS (
            SELECT 1 FROM badges WHERE name = 'Voice Virtuoso' AND is_earned = true
        );
    END IF;
    
    -- Award platform mastery badge
    IF platforms_used >= 4 THEN
        INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
        SELECT name, description, icon, category, points_required, true, NOW()
        FROM badge_library 
        WHERE name = 'Multi-Platform Master' AND NOT EXISTS (
            SELECT 1 FROM badges WHERE name = 'Multi-Platform Master' AND is_earned = true
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for badge awarding
CREATE TRIGGER award_badges_trigger
    AFTER INSERT ON ideas
    FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

-- Verification queries
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as badge_library_count FROM badge_library;
SELECT COUNT(*) as initial_badges_count FROM badges WHERE is_earned = true;

-- Verify badges table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'badges' 
ORDER BY ordinal_position;