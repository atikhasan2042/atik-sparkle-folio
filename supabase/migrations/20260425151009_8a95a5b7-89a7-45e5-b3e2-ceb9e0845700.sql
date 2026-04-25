DROP POLICY IF EXISTS "Anyone can record a visit" ON public.visitors;

CREATE POLICY "Anyone can record a visit"
ON public.visitors FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(session_id) > 0 AND length(session_id) <= 100
);