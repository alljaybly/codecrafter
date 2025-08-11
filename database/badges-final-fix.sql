-- FINAL FIXED Badges Table Setup
-- Run this in your Supabase SQL Editor

-- Create the badges table
CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes and constraints
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_badge_name ON badges(badge_name);
CREATE INDEX IF NOT EXISTS idx_badges_awarded_at ON badges(awarded_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_badges_user_badge_unique ON badges(user_id, badge_name);

-- Enable Row Level Security
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Allow all operations on badges" ON badges;
CREATE POLICY "Allow all operations on badges" ON badges FOR ALL USING (true);

-- Insert sample badges for immediate testing
INSERT INTO badges (user_id, badge_name, awarded_at) VALUES 
    ('demo-user', 'Early Adopter', NOW() - INTERVAL '2 days'),
    ('demo-user', 'First Idea', NOW() - INTERVAL '1 day'),
    ('demo-user', 'Code Generator', NOW() - INTERVAL '1 day'),
    ('demo-user', 'Todo Master', NOW() - INTERVAL '12 hours'),
    ('demo-user', 'Weather Wizard', NOW() - INTERVAL '6 hours')
ON CONFLICT (user_id, badge_name) DO NOTHING;

-- Verify the setup
SELECT 'SUCCESS: Badges table created!' as message;
SELECT COUNT(*) as total_badges FROM badges;
SELECT badge_name, awarded_at FROM badges ORDER BY awarded_at DESC;