-- Fix function search_path
CREATE OR REPLACE FUNCTION public.is_admin_email(_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
SET search_path = public
AS $$
  SELECT lower(_email) = 'atikhasan.io2042@gmail.com'
$$;

-- Tighten visitor update policy: only recent rows
DROP POLICY IF EXISTS "Anyone can update visit duration" ON public.visitors;

CREATE POLICY "Anyone can update recent visit duration"
ON public.visitors FOR UPDATE
TO anon, authenticated
USING (visited_at > now() - interval '24 hours')
WITH CHECK (visited_at > now() - interval '24 hours');

-- Tighten contact_messages insert: rate-limit-ish via length checks already; replace true WITH CHECK with explicit non-empty checks (already non-true). Nothing to do.
-- The linter likely flagged the visitors UPDATE which is now fixed.