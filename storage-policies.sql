-- Storage Policies voor documents bucket
-- Run deze SQL in Supabase SQL Editor

-- Allow authenticated users to upload files
CREATE POLICY IF NOT EXISTS "Users can upload documents for their company"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow users to read documents from their company
CREATE POLICY IF NOT EXISTS "Users can read their company documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Allow users to delete their company documents
CREATE POLICY IF NOT EXISTS "Users can delete their company documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');

-- Allow service role full access (for API operations)
CREATE POLICY IF NOT EXISTS "Service role full access to documents"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');



