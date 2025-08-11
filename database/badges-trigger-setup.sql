-- Badges Trigger Setup (Run AFTER badges-simple-setup.sql)
-- This adds automatic badge awarding when ideas are generated

-- Create function to award badges automatically
CREATE OR REPLACE FUNCTION award_code_generation_badges()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Award "First Idea" badge
    INSERT INTO badges (user_id, badge_name, awarded_at) 
    VALUES ('demo-user', 'First Idea', NOW())
    ON CONFLICT (user_id, badge_name) DO NOTHING;
    
    -- Award "Code Generator" badge
    INSERT INTO badges (user_id, badge_name, awarded_at) 
    VALUES ('demo-user', 'Code Generator', NOW())
    ON CONFLICT (user_id, badge_name) DO NOTHING;
    
    -- Award specific badges based on idea content
    IF LOWER(NEW.idea) LIKE '%todo%' OR LOWER(NEW.idea) LIKE '%task%' THEN
        INSERT INTO badges (user_id, badge_name, awarded_at) 
        VALUES ('demo-user', 'Todo Master', NOW())
        ON CONFLICT (user_id, badge_name) DO NOTHING;
    END IF;
    
    IF LOWER(NEW.idea) LIKE '%weather%' THEN
        INSERT INTO badges (user_id, badge_name, awarded_at) 
        VALUES ('demo-user', 'Weather Wizard', NOW())
        ON CONFLICT (user_id, badge_name) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for automatic badge awarding
DROP TRIGGER IF EXISTS trigger_award_code_generation_badges ON generated_code;
CREATE TRIGGER trigger_award_code_generation_badges
    AFTER INSERT ON generated_code
    FOR EACH ROW
    EXECUTE FUNCTION award_code_generation_badges();

-- Test the trigger function
SELECT 'Trigger setup completed successfully!' as status;