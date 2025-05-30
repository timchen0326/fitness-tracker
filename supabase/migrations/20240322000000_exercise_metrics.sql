-- Add new columns to exercises table
ALTER TABLE exercises
  ADD COLUMN sets INTEGER,
  ADD COLUMN reps INTEGER,
  ADD COLUMN weight NUMERIC,
  ADD COLUMN distance NUMERIC,
  ADD COLUMN exercise_category VARCHAR(50) NOT NULL DEFAULT 'cardio',
  -- Make existing columns nullable since they only apply to certain types
  ALTER COLUMN duration DROP NOT NULL,
  ALTER COLUMN calories_burned DROP NOT NULL;

-- Add check constraint to ensure exercise_category is valid
ALTER TABLE exercises
  ADD CONSTRAINT valid_exercise_category 
  CHECK (exercise_category IN ('cardio', 'strength', 'flexibility', 'sports'));

-- Add comment to explain the columns
COMMENT ON COLUMN exercises.exercise_category IS 'The category of exercise: cardio, strength, flexibility, or sports';
COMMENT ON COLUMN exercises.sets IS 'Number of sets (for strength training)';
COMMENT ON COLUMN exercises.reps IS 'Number of repetitions per set (for strength training)';
COMMENT ON COLUMN exercises.weight IS 'Weight used in kilograms (for strength training)';
COMMENT ON COLUMN exercises.distance IS 'Distance covered in kilometers (for cardio)';
COMMENT ON COLUMN exercises.duration IS 'Duration in minutes (optional, mainly for cardio)';
COMMENT ON COLUMN exercises.calories_burned IS 'Estimated calories burned (optional)'; 