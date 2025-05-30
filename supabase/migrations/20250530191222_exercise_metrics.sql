-- Add new columns to exercises table
ALTER TABLE public.exercises
  ADD COLUMN sets INTEGER,
  ADD COLUMN reps INTEGER,
  ADD COLUMN weight NUMERIC,
  ADD COLUMN distance NUMERIC,
  ADD COLUMN exercise_category VARCHAR(50) NOT NULL DEFAULT 'cardio';

-- Make existing columns nullable since they only apply to certain types
ALTER TABLE public.exercises
  ALTER COLUMN duration DROP NOT NULL,
  ALTER COLUMN calories_burned DROP NOT NULL;

-- Add check constraint to ensure exercise_category is valid
ALTER TABLE public.exercises
  ADD CONSTRAINT valid_exercise_category 
  CHECK (exercise_category IN ('cardio', 'strength', 'flexibility', 'sports'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(exercise_category);

-- Add comments to explain the columns
COMMENT ON COLUMN public.exercises.exercise_category IS 'The category of exercise: cardio, strength, flexibility, or sports';
COMMENT ON COLUMN public.exercises.sets IS 'Number of sets (for strength training)';
COMMENT ON COLUMN public.exercises.reps IS 'Number of repetitions per set (for strength training)';
COMMENT ON COLUMN public.exercises.weight IS 'Weight used in kilograms (for strength training)';
COMMENT ON COLUMN public.exercises.distance IS 'Distance covered in kilometers (for cardio)';
