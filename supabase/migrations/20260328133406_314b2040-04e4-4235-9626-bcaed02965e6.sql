-- Fix profiles UPDATE policy to prevent subscription_status/trial_started_at modification at RLS level
-- Defense-in-depth on top of the existing prevent_self_subscription_update trigger

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND subscription_status IS NOT DISTINCT FROM (SELECT p.subscription_status FROM public.profiles p WHERE p.id = auth.uid())
    AND trial_started_at IS NOT DISTINCT FROM (SELECT p.trial_started_at FROM public.profiles p WHERE p.id = auth.uid())
  );