-- Create table for AI-generated study materials
CREATE TABLE IF NOT EXISTS public.ai_study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  source_text text NOT NULL,
  material_type text NOT NULL CHECK (material_type IN ('flashcards', 'quiz', 'summary', 'concept_map', 'mnemonics')),
  content jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_study_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own AI study materials"
  ON public.ai_study_materials
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI study materials"
  ON public.ai_study_materials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI study materials"
  ON public.ai_study_materials
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI study materials"
  ON public.ai_study_materials
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create table for tracking AI feature usage (analytics)
CREATE TABLE IF NOT EXISTS public.ai_feature_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_name text NOT NULL,
  usage_data jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own AI feature usage"
  ON public.ai_feature_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI feature usage"
  ON public.ai_feature_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_ai_study_materials_user_id ON public.ai_study_materials(user_id);
CREATE INDEX idx_ai_study_materials_created_at ON public.ai_study_materials(created_at DESC);
CREATE INDEX idx_ai_feature_usage_user_id ON public.ai_feature_usage(user_id);
CREATE INDEX idx_ai_feature_usage_feature_name ON public.ai_feature_usage(feature_name);