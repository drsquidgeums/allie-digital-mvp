-- Restrict cleanup_old_sessions to admin role only
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can cleanup sessions';
  END IF;
  
  DELETE FROM public.active_sessions 
  WHERE last_activity < now() - interval '7 days';
END;
$function$;

-- Also restrict cleanup_inactive_sessions
CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can cleanup sessions';
  END IF;
  
  DELETE FROM public.active_sessions 
  WHERE last_activity < now() - interval '30 minutes';
END;
$function$;