-- Fix for existing badges table missing points_required column
-- Run this if you get: column "points_required" of relation "badges" does not exist

-- Add the missing column
ALTER TABLE badges ADD COLUMN IF NOT EXISTS points_required INTEGER DEFAULT 0;

-- Update existing badges with points_required values from badge_library
UPDATE badges 
SET points_required = bl.points_required
FROM badge_library bl
WHERE badges.name = bl.name;

-- Verify the fix
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'badges' 
ORDER BY ordinal_position;

-- Test the insert that was failing
INSERT INTO badges (name, description, icon, category, points_required, is_earned, earned_at)
SELECT name, description, icon, category, points_required, true, NOW()
FROM badge_library 
WHERE points_required = 0
ON CONFLICT (name) DO NOTHING;

SELECT 'Badges table fixed successfully!' as status;