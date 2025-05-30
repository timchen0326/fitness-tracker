-- Add daily_calorie_goal column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER DEFAULT 2300;

-- Update existing rows to have the default value
UPDATE profiles 
SET daily_calorie_goal = 2300 
WHERE daily_calorie_goal IS NULL; 