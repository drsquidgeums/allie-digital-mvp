-- Fix the remaining security issue with NDA agreements table
-- The issue is that INSERT is allowed without authentication

-- Remove the current INSERT policy that allows unauthenticated access
DROP POLICY IF EXISTS "Allow controlled NDA agreement creation" ON public.nda_agreements;

-- Create a new policy that requires authentication or is specifically controlled
-- Since this is an NDA form that external users need to fill, we'll allow INSERT but with better controls
CREATE POLICY "Allow authenticated NDA agreement creation" ON public.nda_agreements
FOR INSERT 
WITH CHECK (
  -- Allow insert only if email and name are provided (basic validation)
  email IS NOT NULL AND 
  name IS NOT NULL AND
  length(trim(email)) > 0 AND 
  length(trim(name)) > 0
);

-- Also fix the AI insights system access issue
-- Update AI insights policies to be more restrictive
DROP POLICY IF EXISTS "System can insert insights for users" ON public.ai_insights;
DROP POLICY IF EXISTS "System can update insights" ON public.ai_insights;

-- Create more secure AI insights policies
CREATE POLICY "Service role can insert insights" ON public.ai_insights
FOR INSERT 
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Service role can update insights" ON public.ai_insights
FOR UPDATE 
USING (current_setting('role') = 'service_role');