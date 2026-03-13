
-- Add trial_started_at column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_started_at timestamp with time zone DEFAULT NULL;

-- Update the handle_new_user trigger function to set trial status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_status, trial_started_at)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'trial',
    now()
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$function$;
