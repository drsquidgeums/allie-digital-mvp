-- Create user analytics table to track user behavior patterns
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for user analytics
CREATE POLICY "Users can insert their own analytics" 
ON public.user_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics" 
ON public.user_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create AI insights table to store personalized recommendations and insights
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  insight_data JSONB NOT NULL,
  confidence_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for AI insights
CREATE POLICY "Users can view their own insights" 
ON public.ai_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert insights for users" 
ON public.ai_insights 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update insights" 
ON public.ai_insights 
FOR UPDATE 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);
CREATE INDEX idx_user_analytics_created_at ON public.user_analytics(created_at);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON public.ai_insights(insight_type);
CREATE INDEX idx_ai_insights_expires_at ON public.ai_insights(expires_at);