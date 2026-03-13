
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can check specific vouchers" ON public.vouchers;

-- Create a security definer function for voucher lookup by code
CREATE OR REPLACE FUNCTION public.check_voucher_by_code(_code text)
RETURNS TABLE (
  id uuid,
  code text,
  is_used boolean,
  expires_at timestamptz,
  description text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.id, v.code, v.is_used, v.expires_at, v.description
  FROM public.vouchers v
  WHERE v.code = _code
  LIMIT 1;
$$;

-- Remove all direct SELECT access for authenticated users
-- Only service_role and the security definer function can read vouchers now
