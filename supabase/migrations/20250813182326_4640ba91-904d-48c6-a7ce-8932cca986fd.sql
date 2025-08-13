-- Fix critical security vulnerabilities by removing public access policies

-- 1. Remove public access to nda_agreements table
DROP POLICY IF EXISTS "Users can view their own NDA agreements" ON public.nda_agreements;

-- Create admin-only access to NDA agreements (replace the false policy)
DROP POLICY IF EXISTS "Admin only view NDA agreements" ON public.nda_agreements;
CREATE POLICY "Admin only view NDA agreements" ON public.nda_agreements
FOR SELECT 
USING (false); -- Only service role can access via backend

-- 2. Remove public access to secrets table
DROP POLICY IF EXISTS "Allow full access to secrets" ON public.secrets;
-- Keep only the service role policy which is already correct

-- 3. Fix teams_config table access
DROP POLICY IF EXISTS "Allow full access to teams_config" ON public.teams_config;
DROP POLICY IF EXISTS "Admin only access to teams config" ON public.teams_config;

-- Create proper admin-only access for teams_config
CREATE POLICY "Service role only access to teams config" ON public.teams_config
FOR ALL
USING (false); -- Only service role can access via backend

-- 4. Enable leaked password protection
UPDATE auth.config 
SET leaked_password_protection = true
WHERE key = 'leaked_password_protection';