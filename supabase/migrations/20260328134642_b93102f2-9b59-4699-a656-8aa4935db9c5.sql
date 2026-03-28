-- 1. Fix user_roles: explicitly deny INSERT for authenticated users
-- The existing policy targets service_role DB role, but we need to block authenticated explicitly
CREATE POLICY "Block authenticated from inserting roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- 2. Fix stripe_subscriptions: block authenticated users from inserting subscription records
CREATE POLICY "Block authenticated from inserting subscriptions"
  ON public.stripe_subscriptions
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (false);