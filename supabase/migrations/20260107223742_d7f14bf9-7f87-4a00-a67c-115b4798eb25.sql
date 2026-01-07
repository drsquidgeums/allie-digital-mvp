-- Allow users to delete their own session records for privacy control
CREATE POLICY "Users can delete their own sessions" 
ON public.active_sessions 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Allow users to update their own session records
CREATE POLICY "Users can update their own sessions" 
ON public.active_sessions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);