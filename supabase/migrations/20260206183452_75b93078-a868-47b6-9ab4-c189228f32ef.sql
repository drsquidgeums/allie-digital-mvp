-- Create vouchers table for redemption codes
CREATE TABLE public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  description TEXT
);

-- Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if a voucher exists (for validation during signup)
CREATE POLICY "Anyone can check voucher validity"
  ON public.vouchers FOR SELECT
  USING (true);

-- Only service role can update vouchers (edge function handles redemption)
CREATE POLICY "Service role can update vouchers"
  ON public.vouchers FOR UPDATE
  USING (current_setting('role'::text) = 'service_role'::text);

-- Only service role can insert vouchers (admin creates via dashboard)
CREATE POLICY "Service role can insert vouchers"
  ON public.vouchers FOR INSERT
  WITH CHECK (current_setting('role'::text) = 'service_role'::text);