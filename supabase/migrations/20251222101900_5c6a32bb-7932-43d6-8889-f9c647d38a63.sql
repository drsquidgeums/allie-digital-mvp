-- Remove old permissive storage policies that allow anyone access
DROP POLICY IF EXISTS "Anyone can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;