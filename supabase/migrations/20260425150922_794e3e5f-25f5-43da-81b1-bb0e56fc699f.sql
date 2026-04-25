-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if email belongs to allowed admin
CREATE OR REPLACE FUNCTION public.is_admin_email(_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT lower(_email) = 'atikhasan.io2042@gmail.com'
$$;

-- Auto-grant admin role on signup if email matches
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_email(NEW.email) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS for user_roles: only admin can view; users can view own
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================
-- Visitors tracking table
-- =========================
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  ip_hash TEXT,
  duration_seconds INTEGER DEFAULT 0,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_visitors_session ON public.visitors(session_id);
CREATE INDEX idx_visitors_visited_at ON public.visitors(visited_at DESC);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a visitor record (public tracking)
CREATE POLICY "Anyone can record a visit"
ON public.visitors FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can update their own session row (to update duration)
CREATE POLICY "Anyone can update visit duration"
ON public.visitors FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Only admins can view visitors
CREATE POLICY "Admins can view visitors"
ON public.visitors FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =========================
-- Contact messages table
-- =========================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message
CREATE POLICY "Anyone can submit a message"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) > 0 AND length(name) <= 100
  AND length(email) > 0 AND length(email) <= 255
  AND length(message) > 0 AND length(message) <= 2000
);

-- Only admins can view messages
CREATE POLICY "Admins can view messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update messages (mark as read)
CREATE POLICY "Admins can update messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));