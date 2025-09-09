-- Create admin role enum if not exists
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Update study_materials table
ALTER TABLE public.study_materials DROP COLUMN IF EXISTS uploader;
ALTER TABLE public.study_materials ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id);
ALTER TABLE public.study_materials ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Update notices policies
DROP POLICY IF EXISTS "Anyone can view notices" ON public.notices;
DROP POLICY IF EXISTS "Only admins can create notices" ON public.notices;
DROP POLICY IF EXISTS "Only admins can update notices" ON public.notices;
DROP POLICY IF EXISTS "Only admins can delete notices" ON public.notices;

CREATE POLICY "Anyone can view notices"
ON public.notices
FOR SELECT
USING (true);

CREATE POLICY "Only admins can create notices"
ON public.notices
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update notices"
ON public.notices
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete notices"
ON public.notices
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update study_materials policies
DROP POLICY IF EXISTS "Anyone can view study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Only admins can create study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Only admins can update study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Only admins can delete study materials" ON public.study_materials;

CREATE POLICY "Anyone can view study materials"
ON public.study_materials
FOR SELECT
USING (true);

CREATE POLICY "Only admins can create study materials"
ON public.study_materials
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update study materials"
ON public.study_materials
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete study materials"
ON public.study_materials
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update events policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Only admins can create events" ON public.events;
DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;

CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

CREATE POLICY "Only admins can create events"
ON public.events
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update events"
ON public.events
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete events"
ON public.events
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));