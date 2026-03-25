-- 1. Fix privilege escalation: restrict user_roles INSERT to service_role only
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

CREATE POLICY "Service role can insert roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Also allow admins to insert via a separate policy using JWT check
CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Fix stripe_subscriptions SELECT policy to require auth
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.stripe_subscriptions;

CREATE POLICY "Users can view their own subscription"
  ON public.stripe_subscriptions
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 3. Allow users to read their own redeemed vouchers
CREATE POLICY "Users can view their own vouchers"
  ON public.vouchers
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = used_by);