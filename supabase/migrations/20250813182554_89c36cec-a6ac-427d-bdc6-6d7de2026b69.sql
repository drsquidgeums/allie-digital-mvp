-- Verify and fix any remaining public access policies

-- Check current policies on nda_agreements
-- Remove any remaining public policies
DROP POLICY IF EXISTS "Users can view their own NDA agreements" ON public.nda_agreements;
DROP POLICY IF EXISTS "Allow NDA agreement creation only" ON public.nda_agreements;
DROP POLICY IF EXISTS "Anyone can insert NDA agreements" ON public.nda_agreements;

-- Keep only the strict admin policy and controlled insert
CREATE POLICY "Strict admin only view NDA agreements" ON public.nda_agreements
FOR SELECT 
USING (false); -- Only service role access

CREATE POLICY "Allow controlled NDA agreement creation" ON public.nda_agreements
FOR INSERT 
WITH CHECK (true); -- Allow creation but no reading

-- Remove any remaining public access to secrets
DROP POLICY IF EXISTS "Allow full access to secrets" ON public.secrets;

-- Remove any remaining public access to teams_config  
DROP POLICY IF EXISTS "Allow full access to teams_config" ON public.teams_config;

-- Verify service role policies are in place
-- These should already exist but let's ensure they're correct