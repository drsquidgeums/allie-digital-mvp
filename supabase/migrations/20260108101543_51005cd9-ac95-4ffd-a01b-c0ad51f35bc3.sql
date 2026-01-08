-- Add missing RLS policies to fix security scan findings

-- 1. Profiles: Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 2. Stripe Subscriptions: Allow users to view their own subscription (read-only)
CREATE POLICY "Users can view their own subscription"
ON public.stripe_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- 3. AI Insights: Allow users to delete their own insights
CREATE POLICY "Users can delete their own insights"
ON public.ai_insights
FOR DELETE
USING (auth.uid() = user_id);

-- 4. AI Feature Usage: Allow users to update their own usage data
CREATE POLICY "Users can update their own usage"
ON public.ai_feature_usage
FOR UPDATE
USING (auth.uid() = user_id);

-- 5. AI Feature Usage: Allow users to delete their own usage data
CREATE POLICY "Users can delete their own usage"
ON public.ai_feature_usage
FOR DELETE
USING (auth.uid() = user_id);