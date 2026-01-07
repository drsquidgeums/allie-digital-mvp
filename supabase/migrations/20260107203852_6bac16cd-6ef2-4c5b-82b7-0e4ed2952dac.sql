-- Fix 1: Set search_path on handle_updated_at function to prevent search path injection
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix 2: Add data retention - automatically clean up old session data (older than 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  DELETE FROM public.active_sessions 
  WHERE last_activity < now() - interval '7 days';
END;
$function$;

-- Fix 3: Ensure profiles table RLS explicitly requires authentication
-- Drop any potentially permissive policies and recreate with explicit auth check
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate with explicit auth.uid() IS NOT NULL check
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Fix 4: Strengthen active_sessions RLS to explicitly require authentication
DROP POLICY IF EXISTS "Users can view their own active sessions" ON public.active_sessions;

CREATE POLICY "Users can view their own active sessions" 
ON public.active_sessions 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);