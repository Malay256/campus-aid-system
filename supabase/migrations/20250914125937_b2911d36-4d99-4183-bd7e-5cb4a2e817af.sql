-- Fix study materials RLS policies to allow user uploads
-- Drop the restrictive admin-only INSERT policy
DROP POLICY "Only admins can create study materials" ON public.study_materials;

-- Drop the conflicting SELECT policy that blocks all access
DROP POLICY "Users can view basic study material info" ON public.study_materials;

-- Create a new INSERT policy allowing users to create their own materials
CREATE POLICY "Users can create their own study materials" 
ON public.study_materials 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

-- Create a SELECT policy allowing users to view all study materials (for browsing)
CREATE POLICY "Users can view all study materials" 
ON public.study_materials 
FOR SELECT 
USING (true);