-- Add access credentials to study materials
ALTER TABLE study_materials 
ADD COLUMN access_id TEXT,
ADD COLUMN access_password TEXT;

-- Add a table for file access logs
CREATE TABLE public.file_access_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  file_id uuid REFERENCES study_materials(id),
  accessed_at timestamp with time zone NOT NULL DEFAULT now(),
  access_method text DEFAULT 'download'
);

-- Enable RLS on file access logs
ALTER TABLE public.file_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for file access logs
CREATE POLICY "Users can view their own access logs" 
ON public.file_access_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert access logs" 
ON public.file_access_logs 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all access logs
CREATE POLICY "Admins can view all access logs" 
ON public.file_access_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow any authenticated user to upload to the study-materials bucket
DROP POLICY IF EXISTS "Only admins can upload study materials" ON storage.objects;
CREATE POLICY "Authenticated users can upload study materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'study-materials');

-- Allow users to update their own files
CREATE POLICY "Users can update their own study materials"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'study-materials' AND auth.uid() = owner);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own study materials"
ON storage.objects
FOR DELETE
USING (bucket_id = 'study-materials' AND auth.uid() = owner);

-- Update RLS policy for study_materials table to allow users to insert their own materials
DROP POLICY IF EXISTS "Only admins can create study materials" ON public.study_materials;
CREATE POLICY "Users can create their own study materials"
ON public.study_materials
FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());

-- Update RLS policy for study_materials table for viewing
-- Users can see their own materials OR materials uploaded by an admin
DROP POLICY IF EXISTS "Anyone can view study materials" ON public.study_materials;
CREATE POLICY "Users can view their own or admin materials"
ON public.study_materials
FOR SELECT
USING (
  (uploaded_by = auth.uid()) OR
  (EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = study_materials.uploaded_by AND user_roles.role = 'admin'::app_role
  ))
);
