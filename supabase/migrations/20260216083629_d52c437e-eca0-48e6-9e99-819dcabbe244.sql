
DROP POLICY IF EXISTS "Anyone can check voucher validity" ON vouchers;

CREATE POLICY "Users can check specific vouchers" ON vouchers FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
