-- Delete old root-level files that don't have a user folder prefix
-- These files were uploaded before proper user isolation was implemented
DELETE FROM storage.objects 
WHERE bucket_id = 'files' 
AND name NOT LIKE '%/%';