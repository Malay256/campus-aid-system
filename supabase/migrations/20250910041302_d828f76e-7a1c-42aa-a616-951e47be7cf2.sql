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