-- Add labels column to tasks table if it doesn't exist
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';

-- Add index for labels for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_labels ON public.tasks USING GIN(labels);