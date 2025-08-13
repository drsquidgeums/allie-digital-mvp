-- Create a table to track active user sessions
CREATE TABLE public.active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text,
  ip_address text,
  page_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_id)
);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for active sessions
CREATE POLICY "Service role can manage active sessions" ON public.active_sessions
FOR ALL 
USING (current_setting('role') = 'service_role');

CREATE POLICY "Users can view all active sessions" ON public.active_sessions
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Enable realtime for the active_sessions table
ALTER TABLE public.active_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;

-- Create function to update session activity
CREATE OR REPLACE FUNCTION public.update_session_activity(
  p_user_id uuid,
  p_session_id text,
  p_user_agent text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_page_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    user_agent = COALESCE(EXCLUDED.user_agent, active_sessions.user_agent),
    ip_address = COALESCE(EXCLUDED.ip_address, active_sessions.ip_address),
    page_url = COALESCE(EXCLUDED.page_url, active_sessions.page_url);
END;
$$;

-- Create function to cleanup old sessions
CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove sessions inactive for more than 30 minutes
  DELETE FROM public.active_sessions 
  WHERE last_activity < now() - interval '30 minutes';
END;
$$;