-- Add explicit SELECT deny policy on vouchers table for security
-- Voucher validation happens server-side via check_voucher_by_code function (SECURITY DEFINER)
CREATE POLICY "No direct read access to vouchers" ON public.vouchers
  FOR SELECT USING (false);