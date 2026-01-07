-- 1. Create a secure stripe_subscriptions table (service-role only)
CREATE TABLE public.stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stripe_customer_id text,
  subscription_id text,
  subscription_price_id text,
  subscription_current_period_end timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table (no client access)
CREATE POLICY "Service role only access to stripe subscriptions"
ON public.stripe_subscriptions
FOR ALL
USING (current_setting('role'::text) = 'service_role'::text);

-- Add trigger for updated_at
CREATE TRIGGER update_stripe_subscriptions_updated_at
BEFORE UPDATE ON public.stripe_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 2. Migrate existing payment data from profiles to stripe_subscriptions
INSERT INTO public.stripe_subscriptions (user_id, stripe_customer_id, subscription_id, subscription_price_id, subscription_current_period_end)
SELECT id, stripe_customer_id, subscription_id, subscription_price_id, subscription_current_period_end
FROM public.profiles
WHERE stripe_customer_id IS NOT NULL OR subscription_id IS NOT NULL;

-- 3. Remove payment columns from profiles table
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS subscription_id,
DROP COLUMN IF EXISTS subscription_price_id,
DROP COLUMN IF EXISTS subscription_current_period_end;

-- 4. Create function to hash IP addresses
CREATE OR REPLACE FUNCTION public.hash_ip_address(ip_address text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF ip_address IS NULL THEN
    RETURN NULL;
  END IF;
  -- Use SHA256 hash with a salt for privacy
  RETURN encode(sha256((ip_address || 'lovable_ip_salt_2026')::bytea), 'hex');
END;
$$;

-- 5. Update existing IP addresses to hashed versions
UPDATE public.active_sessions
SET ip_address = public.hash_ip_address(ip_address)
WHERE ip_address IS NOT NULL AND ip_address NOT LIKE '%[a-f0-9]{64}%';

-- 6. Create trigger to auto-hash IP addresses on insert/update
CREATE OR REPLACE FUNCTION public.hash_session_ip()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Only hash if it looks like a raw IP (contains dots or colons, not already 64 chars hex)
  IF NEW.ip_address IS NOT NULL AND length(NEW.ip_address) < 64 THEN
    NEW.ip_address := public.hash_ip_address(NEW.ip_address);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER hash_ip_on_session_insert_update
BEFORE INSERT OR UPDATE ON public.active_sessions
FOR EACH ROW
EXECUTE FUNCTION public.hash_session_ip();