# Supabase Setup Guide for Data Library RAG

## Step 1: Create Supabase Project

Since project creation is disabled for Vercel-managed organizations via API, create the project manually:

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Enter project details:
   - **Name:** `AI Sprint Studio - Data Library`
   - **Organization:** guido1997dev's projects
   - **Region:** eu-central-1 (recommended)
   - **Database Password:** Choose a strong password
4. Click **"Create new project"**
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Project Credentials

After the project is created:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (for `NEXT_PUBLIC_SUPABASE_KEY`)
   - **service_role key** (for `SUPABASE_SERVICE_ROLE_KEY`)

## Step 3: Run Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `supabase-migration.sql`
3. Copy all the SQL content
4. Paste it into the SQL Editor
5. Click **"Run"** to execute the migration

This will create:
- ✅ `projects` table
- ✅ `documents` table
- ✅ `document_chunks` table with vector support
- ✅ Indexes for performance
- ✅ Vector similarity search function
- ✅ Row Level Security policies

## Step 4: Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **"New bucket"**
3. Name: `documents`
4. **Public bucket:** ❌ No (private)
5. Click **"Create bucket"**

### Storage Policies

After creating the bucket, set up RLS policies:

1. Go to **Storage** → **Policies** for the `documents` bucket
2. Create policies to allow authenticated users to upload/read files for their company

Example SQL for storage policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload documents for their company"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow users to read documents from their company
CREATE POLICY "Users can read their company documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Allow users to delete their company documents
CREATE POLICY "Users can delete their company documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
```

## Step 5: Configure Environment Variables

Create `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI API (for embeddings)
OPENAI_API_KEY=your-openai-api-key-here

# NextAuth (if needed)
NEXTAUTH_URL=http://localhost:3333
NEXTAUTH_SECRET=your-nextauth-secret-here
```

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/data-library`
3. Try creating a new project
4. If successful, you're all set! ✅

## Troubleshooting

### Error: "Projects table does not exist"
- Make sure you ran the migration SQL in Step 3

### Error: "Supabase is not configured"
- Check that your `.env.local` file has the correct variables
- Restart the dev server after adding environment variables

### Error: "Permission denied"
- Check RLS policies in Supabase dashboard
- Make sure storage bucket policies are set up correctly

### Vector search not working
- Verify pgvector extension is enabled: `SELECT * FROM pg_extension WHERE extname = 'vector';`
- Check that embeddings are being generated and stored correctly

## Next Steps

Once the database is set up:
1. ✅ Create projects in the Data Library
2. ✅ Upload documents to projects
3. ✅ Documents will be automatically processed and embedded
4. ✅ Use RAG in the Chat interface by selecting a project



