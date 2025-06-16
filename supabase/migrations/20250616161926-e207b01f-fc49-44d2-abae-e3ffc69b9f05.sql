
-- Phase 1: Critical RLS Security Fixes

-- Drop existing permissive policies that allow unauthorized access
DROP POLICY IF EXISTS "No direct access to secrets" ON public.secrets;
DROP POLICY IF EXISTS "No direct access to teams config" ON public.teams_config;
DROP POLICY IF EXISTS "No direct access to view NDA agreements" ON public.nda_agreements;

-- Create proper admin-only access for secrets (for edge functions only)
CREATE POLICY "Service role only access to secrets" ON public.secrets
  FOR ALL USING (current_setting('role') = 'service_role');

-- Secure teams_config for admin access only
CREATE POLICY "Admin only access to teams config" ON public.teams_config
  FOR ALL USING (false); -- Will be updated when admin roles are implemented

-- Secure NDA agreements - only allow admin viewing
CREATE POLICY "Admin only view NDA agreements" ON public.nda_agreements
  FOR SELECT USING (false); -- Will be updated when admin roles are implemented

CREATE POLICY "Allow NDA agreement creation only" ON public.nda_agreements
  FOR INSERT WITH CHECK (true);

-- Fix tasks table to prevent data leakage
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- Create secure task policies that require authentication
CREATE POLICY "Authenticated users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Make user_id columns NOT NULL where required for security
ALTER TABLE public.tasks ALTER COLUMN user_id SET NOT NULL;

-- Secure feedback table - restrict viewing to prevent data mining
DROP POLICY IF EXISTS "No direct access to feedback data" ON public.feedback;
CREATE POLICY "No public access to feedback data" ON public.feedback
  FOR SELECT USING (false);

-- Only allow feedback insertion with proper validation
DROP POLICY IF EXISTS "Users can insert feedback anonymously" ON public.feedback;
CREATE POLICY "Controlled feedback insertion" ON public.feedback
  FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );
