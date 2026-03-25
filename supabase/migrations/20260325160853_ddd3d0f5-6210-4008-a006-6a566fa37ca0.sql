-- Remove both INSERT policies and replace with a single secure permissive policy
DROP POLICY IF EXISTS "Authenticated can attempt insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Single permissive policy: only admins can insert, scoped to authenticated users
CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));