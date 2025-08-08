-- CodeCrafter Database Setup Script
-- Run this in your Supabase SQL editor

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
-- In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow all operations on generated_code" ON generated_code
    FOR ALL USING (true);

-- Insert some sample data (optional)
INSERT INTO generated_code (idea) VALUES 
    ('Create a todo app with user authentication'),
    ('Build a weather dashboard'),
    ('Make a simple blog platform')
ON CONFLICT DO NOTHING;