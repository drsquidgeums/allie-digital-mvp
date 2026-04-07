-- FIX 1: Remove bypassable service role JWT claim policies
-- Service role already bypasses RLS natively, these are unnecessary

DROP POLICY IF EXISTS "Service role can manage active sessions" ON public.active_sessions;
DROP POLICY IF EXISTS "Service role can insert insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Service role can update insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Service role only access to stripe subscriptions" ON public.stripe_subscriptions;
DROP POLICY IF EXISTS "Service role can read API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Service role can insert vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Service role can update vouchers" ON public.vouchers;

-- FIX 2: Drop the unused secrets table (plaintext, not used in app code)
DROP TABLE IF EXISTS public.secrets;