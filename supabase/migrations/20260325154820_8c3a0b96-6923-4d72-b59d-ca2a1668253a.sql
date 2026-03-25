-- Add permissive base policy so the restrictive admin check can gate inserts
CREATE POLICY "Authenticated can attempt insert roles"
  ON public.user_roles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (true);