
-- Drop the existing overly-permissive self-update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a validation trigger that prevents non-service-role users from changing sensitive fields
CREATE OR REPLACE FUNCTION public.prevent_self_subscription_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role to update anything
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Allow admins to update anything
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Block changes to sensitive fields for regular users
  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status THEN
    RAISE EXCEPTION 'You cannot modify subscription_status';
  END IF;

  IF NEW.trial_started_at IS DISTINCT FROM OLD.trial_started_at THEN
    RAISE EXCEPTION 'You cannot modify trial_started_at';
  END IF;

  RETURN NEW;
END;
$$;

-- Attach the trigger
DROP TRIGGER IF EXISTS prevent_self_subscription_update ON public.profiles;
CREATE TRIGGER prevent_self_subscription_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_subscription_update();

-- Re-create the user self-update policy (RLS still needed for row-level access)
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
