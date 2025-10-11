-- Create table for AI task breakdowns
CREATE TABLE public.ai_task_breakdowns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  original_task_text TEXT NOT NULL,
  breakdown JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_task_breakdowns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own task breakdowns"
ON public.ai_task_breakdowns
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task breakdowns"
ON public.ai_task_breakdowns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task breakdowns"
ON public.ai_task_breakdowns
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task breakdowns"
ON public.ai_task_breakdowns
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_ai_task_breakdowns_user_id ON public.ai_task_breakdowns(user_id);
CREATE INDEX idx_ai_task_breakdowns_task_id ON public.ai_task_breakdowns(task_id);