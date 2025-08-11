-- CodeCrafter Complete Database Setup Script
-- Run this in your Supabase SQL editor to set up all required tables

-- =====================================================
-- 1. CREATE GENERATED_CODE TABLE
-- =====================================================

-- Create the generated_code table
CREATE TABLE IF NOT EXISTS generated_code (
    id BIGSERIAL PRIMARY KEY,
    idea TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on generated_at for better query performance
CREATE INDEX IF NOT EXISTS idx_generated_code_generated_at ON generated_code(generated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
CREATE POLICY "Allow all operations on generated_code" ON generated_code
    FOR ALL USING (true);

-- =====================================================
-- 2. CREATE BADGES TABLE
-- =====================================================

-- Create the badges table
CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_badge_name ON badges(badge_name);
CREATE INDEX IF NOT EXISTS idx_badges_awarded_at ON badges(awarded_at DESC);

-- Create a unique constraint to prevent duplicate badges for the same user
CREATE UNIQUE INDEX IF NOT EXISTS idx_badges_user_badge_unique ON badges(user_id, badge_name);

-- Enable Row Level Security (RLS)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
CREATE POLICY "Allow all operations on badges" ON badges
    FOR ALL USING (true);

-- =====================================================
-- 3. CREATE BADGE AWARDING FUNCTIONS
-- =====================================================

-- Function to award a badge to a user
CREATE OR REPLACE FUNCTION award_badge(p_user_id TEXT, p_badge_name TEXT)
RETURNS BOOLEAN AS $
BEGIN
    -- Insert badge, ignore if already exists
    INSERT INTO badges (user_id, badge_name, awarded_at)
    VALUES (p_user_id, p_badge_name, NOW())
    ON CONFLICT (user_id, badge_name) DO NOTHING;
    
    -- Return true if badge was awarded (or already existed)
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$ LANGUAGE plpgsql;

-- Function to automatically award badges when code is generated
CREATE OR REPLACE FUNCTION award_code_generation_badges()
RETURNS TRIGGER AS $
BEGIN
    -- Award "First Idea" badge for any code generation
    PERFORM award_badge('demo-user', 'First Idea');
    
    -- Award "Code Generator" badge
    PERFORM award_badge('demo-user', 'Code Generator');
    
    -- Award specific badges based on idea content
    IF LOWER(NEW.idea) LIKE '%todo%' OR LOWER(NEW.idea) LIKE '%task%' THEN
        PERFORM award_badge('demo-user', 'Todo Master');
    END IF;
    
    IF LOWER(NEW.idea) LIKE '%weather%' THEN
        PERFORM award_badge('demo-user', 'Weather Wizard');
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger to automatically award badges on code generation
DROP TRIGGER IF EXISTS trigger_award_code_generation_badges ON generated_code;
CREATE TRIGGER trigger_award_code_generation_badges
    AFTER INSERT ON generated_code
    FOR EACH ROW
    EXECUTE FUNCTION award_code_generation_badges();

-- =====================================================
-- 4. INSERT SAMPLE DATA
-- =====================================================

-- Insert some sample ideas
INSERT INTO generated_code (idea, generated_at) VALUES 
    ('Create a todo app with user authentication', NOW() - INTERVAL '2 days'),
    ('Build a weather dashboard with real-time data', NOW() - INTERVAL '1 day'),
    ('Make a simple blog platform', NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

-- Insert some sample badges
INSERT INTO badges (user_id, badge_name, awarded_at) VALUES 
    ('demo-user', 'Early Adopter', NOW() - INTERVAL '3 days'),
    ('demo-user', 'First Idea', NOW() - INTERVAL '2 days'),
    ('demo-user', 'Code Generator', NOW() - INTERVAL '2 days'),
    ('demo-user', 'Todo Master', NOW() - INTERVAL '2 days'),
    ('demo-user', 'Weather Wizard', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, badge_name) DO NOTHING;

-- =====================================================
-- 5. CREATE USEFUL VIEWS
-- =====================================================

-- View to get badge statistics
CREATE OR REPLACE VIEW badge_stats AS
SELECT 
    badge_name,
    COUNT(*) as total_awarded,
    COUNT(DISTINCT user_id) as unique_users,
    MIN(awarded_at) as first_awarded,
    MAX(awarded_at) as last_awarded
FROM badges
GROUP BY badge_name
ORDER BY total_awarded DESC;

-- View to get user badge progress
CREATE OR REPLACE VIEW user_badge_progress AS
SELECT 
    user_id,
    COUNT(*) as badges_earned,
    ARRAY_AGG(badge_name ORDER BY awarded_at) as badge_names,
    MIN(awarded_at) as first_badge,
    MAX(awarded_at) as latest_badge
FROM badges
GROUP BY user_id
ORDER BY badges_earned DESC;

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
DO $
BEGIN
    -- Check generated_code table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'generated_code') THEN
        RAISE NOTICE '✅ generated_code table created successfully';
    ELSE
        RAISE NOTICE '❌ generated_code table creation failed';
    END IF;
    
    -- Check badges table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'badges') THEN
        RAISE NOTICE '✅ badges table created successfully';
    ELSE
        RAISE NOTICE '❌ badges table creation failed';
    END IF;
    
    -- Show record counts
    RAISE NOTICE 'Generated code records: %', (SELECT COUNT(*) FROM generated_code);
    RAISE NOTICE 'Badge records: %', (SELECT COUNT(*) FROM badges);
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 CodeCrafter database setup completed!';
    RAISE NOTICE 'Available badge types: First Idea, Voice Input Used, Code Generator, Todo Master, Weather Wizard, Early Adopter';
    RAISE NOTICE 'Automatic badge awarding is now active via triggers';
END $;