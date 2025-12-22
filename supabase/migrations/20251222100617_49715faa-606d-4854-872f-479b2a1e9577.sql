-- Add RLS policies for user-specific file storage in the 'files' bucket

-- Allow authenticated users to upload files only to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read only their own files
CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update only their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete only their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);