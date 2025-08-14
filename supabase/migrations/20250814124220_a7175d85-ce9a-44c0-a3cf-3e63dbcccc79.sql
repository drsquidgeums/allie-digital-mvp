-- Fix remaining security warnings

-- 1. Remove duplicate RLS policy for nda_agreements
DROP POLICY IF EXISTS "Strict admin only view NDA agreements" ON public.nda_agreements;

-- 2. Fix conflicting RLS policies for feedback table
DROP POLICY IF EXISTS "No public access to feedback data" ON public.feedback;

-- 3. Fix function search_path security issues
CREATE OR REPLACE FUNCTION public.update_session_activity(
  p_user_id uuid, 
  p_session_id text, 
  p_user_agent text DEFAULT NULL::text, 
  p_ip_address text DEFAULT NULL::text, 
  p_page_url text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.active_sessions (
    user_id, 
    session_id, 
    last_activity, 
    user_agent, 
    ip_address, 
    page_url
  )
  VALUES (
    p_user_id, 
    p_session_id, 
    now(), 
    p_user_agent, 
    p_ip_address, 
    p_page_url
  )
  ON CONFLICT (user_id, session_id) 
  DO UPDATE SET 
    last_activity = now(),
    user_agent = COALESCE(EXCLUDED.user_agent, public.active_sessions.user_agent),
    ip_address = COALESCE(EXCLUDED.ip_address, public.active_sessions.ip_address),
    page_url = COALESCE(EXCLUDED.page_url, public.active_sessions.page_url);
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Remove sessions inactive for more than 30 minutes
  DELETE FROM public.active_sessions 
  WHERE last_activity < now() - interval '30 minutes';
END;
$function$;