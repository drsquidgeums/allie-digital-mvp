
CREATE TABLE public.quick_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint so each user has one note row
ALTER TABLE public.quick_notes ADD CONSTRAINT quick_notes_user_id_unique UNIQUE (user_id);

-- Enable RLS
ALTER TABLE public.quick_notes ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notes
CREATE POLICY "Users can view their own quick notes"
  ON public.quick_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own notes
CREATE POLICY "Users can insert their own quick notes"
  ON public.quick_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update their own quick notes"
  ON public.quick_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete their own quick notes"
  ON public.quick_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
