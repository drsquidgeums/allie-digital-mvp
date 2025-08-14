-- Fix the security issue: Restrict active_sessions access to user's own sessions only
DROP POLICY IF EXISTS "Users can view all active sessions" ON public.active_sessions;

-- Create a new policy that only allows users to see their own sessions
CREATE POLICY "Users can view their own active sessions" 
ON public.active_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep the service role policy for system operations
-- (This policy already exists and allows service role to manage all sessions)