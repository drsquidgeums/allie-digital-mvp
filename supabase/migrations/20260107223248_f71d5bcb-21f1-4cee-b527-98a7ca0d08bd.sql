-- Prevent any user from deleting their own profile
-- Only service_role can delete profiles (for admin cleanup operations)
CREATE POLICY "Prevent profile deletion" 
ON public.profiles 
FOR DELETE 
USING (false);