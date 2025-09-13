-- Allow users to view their own study materials
CREATE POLICY "Users can view their own study materials" 
ON public.study_materials 
FOR SELECT 
USING (auth.uid() = uploaded_by);

-- Allow users to update their own study materials  
CREATE POLICY "Users can update their own study materials"
ON public.study_materials
FOR UPDATE 
USING (auth.uid() = uploaded_by);

-- Allow users to delete their own study materials
CREATE POLICY "Users can delete their own study materials"
ON public.study_materials
FOR DELETE 
USING (auth.uid() = uploaded_by);