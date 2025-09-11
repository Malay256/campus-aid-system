-- Create a view for public study materials that excludes sensitive credentials
CREATE OR REPLACE VIEW public.study_materials_public AS
SELECT 
  id,
  title,
  subject,
  type,
  size,
  downloads,
  created_at,
  updated_at,
  uploaded_by,
  -- Only show if file is protected, not the actual credentials
  CASE WHEN access_id IS NOT NULL THEN true ELSE false END as is_protected,
  -- Hide file_path for security - only expose through download function
  CASE WHEN access_id IS NULL THEN file_path ELSE NULL END as file_path
FROM public.study_materials;

-- Create a secure function to get file access info (credentials + path) only when downloading
CREATE OR REPLACE FUNCTION public.get_file_access_info(material_id uuid, provided_access_id text DEFAULT NULL, provided_password text DEFAULT NULL)
RETURNS TABLE(file_path text, access_granted boolean, error_message text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    sm.file_path,
    CASE 
      WHEN sm.access_id IS NULL THEN true  -- No protection needed
      WHEN sm.access_id = provided_access_id AND sm.access_password = provided_password THEN true
      ELSE false 
    END as access_granted,
    CASE 
      WHEN sm.access_id IS NULL THEN 'No credentials required'::text
      WHEN sm.access_id = provided_access_id AND sm.access_password = provided_password THEN 'Access granted'::text
      WHEN provided_access_id IS NULL OR provided_password IS NULL THEN 'Credentials required'::text
      ELSE 'Invalid credentials'::text
    END as error_message
  FROM public.study_materials sm
  WHERE sm.id = material_id
  LIMIT 1;
$$;

-- Update RLS policies to be more restrictive

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view study materials" ON public.study_materials;

-- Create restrictive policies for the actual table
CREATE POLICY "Users can view basic study material info" 
ON public.study_materials 
FOR SELECT 
USING (
  -- Only allow selecting non-sensitive fields
  -- This policy will work with the view, but direct table access is restricted
  false  -- Force users to use the public view instead
);

-- Allow admins full access to manage materials  
CREATE POLICY "Admins can manage study materials" 
ON public.study_materials 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Grant permissions on the view
GRANT SELECT ON public.study_materials_public TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_file_access_info TO authenticated;