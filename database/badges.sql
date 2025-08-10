-- CodeCrafter Badges Table Setup Script
-- Run this in your Supabase SQL editor after running setup.sql

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
-- In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow all operations on badges" ON badges
    FOR ALL USING (true);

-- Insert some sample badges for demo purposes
INSERT INTO badges (user_id, badge_name, awarded_at) VALUES 
    ('demo-user', 'First Idea', NOW() - INTERVAL '1 day'),
    ('demo-user', 'Code Generator', NOW() - INTERVAL '1 hour'),
    ('demo-user', 'Early Adopter', NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, badge_name) DO NOTHING;

-- Create a function to automatically award the "Code Generator" badge
-- This will be triggered when a user generates their first code
CREATE OR REPLACE FUNCTION award_code_generator_badge()
RETURNS TRIGGER AS $$
BEGIN
    -- Award "Code Generator" badge when first code is generated
    INSERT INTO badges (user_id, badge_name, awarded_at)
    VALUES ('demo-user', 'Code Generator', NOW())
    ON CONFLICT (user_id, badge_name) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically award badge on first code generation
DROP TRIGGER IF EXISTS trigger_award_code_generator_badge ON generated_code;
CREATE TRIGGER trigger_award_code_generator_badge
    AFTER INSERT ON generated_code
    FOR EACH ROW
    EXECUTE FUNCTION award_code_generator_badge();

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

-- Comments for documentation
COMMENT ON TABLE badges IS 'Stores user achievement badges for CodeCrafter';
COMMENT ON COLUMN badges.user_id IS 'Identifier for the user (in production, this would be from auth)';
COMMENT ON COLUMN badges.badge_name IS 'Name of the badge earned';
COMMENT ON COLUMN badges.awarded_at IS 'Timestamp when the badge was awarded';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Badges table setup completed successfully!';
    RAISE NOTICE 'Available badge types: First Idea, Voice Input Used, Code Generator, Todo Master, Weather Wizard, Early Adopter';
    RAISE NOTICE 'Sample badges have been inserted for demo-user';
END $$;