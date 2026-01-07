-- Prevent any updates to analytics records (data should be immutable)
CREATE POLICY "Analytics records cannot be updated" 
ON public.user_analytics 
FOR UPDATE 
USING (false);

-- Prevent any deletions of analytics records (data should be immutable)
CREATE POLICY "Analytics records cannot be deleted" 
ON public.user_analytics 
FOR DELETE 
USING (false);