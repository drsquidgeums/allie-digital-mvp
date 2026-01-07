-- Add INSERT policy to prevent users from creating sessions for other users
CREATE POLICY "Users can only insert their own sessions" 
ON public.active_sessions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);