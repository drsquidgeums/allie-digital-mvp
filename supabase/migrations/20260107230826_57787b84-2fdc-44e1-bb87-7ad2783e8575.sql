-- The profiles table already has restrictive RLS policies that require auth.uid() IS NOT NULL
-- But let's explicitly add a deny policy for unauthenticated users for defense in depth

-- Drop and recreate the select policies to be more explicit
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with explicit authentication requirement
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));