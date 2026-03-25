
-- 1. Fix user_roles: drop both INSERT policies, create single service_role-only policy
-- Regular admins should use edge functions (service_role) to manage roles, not direct INSERT
DROP POLICY IF EXISTS "Service role can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- Only service_role (used by triggers like handle_new_user) can insert roles
CREATE POLICY "Only service role can insert roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 2. Fix profiles INSERT: prevent users from setting subscription_status on insert
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND (subscription_status IS NULL OR subscription_status = 'trial')
    AND (trial_started_at IS NULL OR trial_started_at = now())
  );

-- 3. Fix user_analytics: restrict to authenticated only
DROP POLICY IF EXISTS "Users can insert their own analytics" ON public.user_analytics;

CREATE POLICY "Users can insert their own analytics"
  ON public.user_analytics
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
