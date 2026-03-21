
-- Fix bypassable RLS policies: replace current_setting('role') with (auth.jwt() ->> 'role')
-- current_setting('role') can be spoofed by clients via SET LOCAL role = 'service_role'

-- 1. secrets table
DROP POLICY "Service role only access to secrets" ON public.secrets;
CREATE POLICY "Service role only access to secrets" ON public.secrets
  FOR ALL USING (false);

-- 2. ai_insights - insert
DROP POLICY "Service role can insert insights" ON public.ai_insights;
CREATE POLICY "Service role can insert insights" ON public.ai_insights
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- 3. ai_insights - update
DROP POLICY "Service role can update insights" ON public.ai_insights;
CREATE POLICY "Service role can update insights" ON public.ai_insights
  FOR UPDATE USING ((auth.jwt() ->> 'role') = 'service_role');

-- 4. active_sessions
DROP POLICY "Service role can manage active sessions" ON public.active_sessions;
CREATE POLICY "Service role can manage active sessions" ON public.active_sessions
  FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- 5. user_api_keys - service role read
DROP POLICY "Service role can read API keys" ON public.user_api_keys;
CREATE POLICY "Service role can read API keys" ON public.user_api_keys
  FOR SELECT USING ((auth.jwt() ->> 'role') = 'service_role');

-- 6. stripe_subscriptions
DROP POLICY "Service role only access to stripe subscriptions" ON public.stripe_subscriptions;
CREATE POLICY "Service role only access to stripe subscriptions" ON public.stripe_subscriptions
  FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- 7. vouchers - update
DROP POLICY "Service role can update vouchers" ON public.vouchers;
CREATE POLICY "Service role can update vouchers" ON public.vouchers
  FOR UPDATE USING ((auth.jwt() ->> 'role') = 'service_role');

-- 8. vouchers - insert
DROP POLICY "Service role can insert vouchers" ON public.vouchers;
CREATE POLICY "Service role can insert vouchers" ON public.vouchers
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');
