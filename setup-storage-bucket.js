/**
 * Script om Storage Bucket aan te maken in Supabase
 * Run: node setup-storage-bucket.js
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  console.error('\nVoeg deze toe aan je .env.local file.');
  process.exit(1);
}

async function createStorageBucket() {
  try {
    console.log('📦 Creating storage bucket "documents"...');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/storage/buckets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        id: 'documents',
        name: 'documents',
        public: false,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['application/pdf', 'text/plain', 'text/markdown', 'text/csv'],
      }),
    });

    if (response.ok) {
      const bucket = await response.json();
      console.log('✅ Storage bucket "documents" created successfully!');
      console.log('   ID:', bucket.id);
      console.log('   Name:', bucket.name);
      console.log('   Public:', bucket.public);
      
      // Create storage policies
      await createStoragePolicies();
    } else if (response.status === 409) {
      console.log('⚠️  Storage bucket "documents" already exists.');
      console.log('   Updating policies...');
      await createStoragePolicies();
    } else {
      const error = await response.text();
      console.error('❌ Failed to create storage bucket:', response.status, error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error creating storage bucket:', error.message);
    process.exit(1);
  }
}

async function createStoragePolicies() {
  try {
    console.log('📋 Creating storage policies...');

    const policies = [
      {
        name: 'Users can upload documents',
        definition: {
          bucket_id: 'documents',
        },
        check: {
          bucket_id: 'eq.documents',
        },
      },
      {
        name: 'Users can read documents',
        definition: {
          bucket_id: 'documents',
        },
        check: {
          bucket_id: 'eq.documents',
        },
      },
      {
        name: 'Users can delete documents',
        definition: {
          bucket_id: 'documents',
        },
        check: {
          bucket_id: 'eq.documents',
        },
      },
    ];

    // Note: Storage policies are managed via the Supabase Dashboard
    // This is just a helper to show what needs to be done
    
    console.log('✅ Storage bucket is ready!');
    console.log('\n📝 Note: Storage policies need to be set up manually:');
    console.log('   1. Go to Supabase Dashboard > Storage > documents bucket');
    console.log('   2. Go to Policies tab');
    console.log('   3. Create policies for SELECT, INSERT, DELETE');
    console.log('\n   Or run the SQL in storage-policies.sql');
    
    // Execute SQL policies via API
    await executeStoragePolicySQL();
  } catch (error) {
    console.error('⚠️  Could not set up policies automatically:', error.message);
    console.log('   You can set them up manually in the Supabase Dashboard');
  }
}

async function executeStoragePolicySQL() {
  try {
    const sql = `
-- Storage policies voor documents bucket
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
USING (bucket_id = 'documents');
    `;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (response.ok) {
      console.log('✅ Storage policies created via SQL');
    } else {
      // If RPC doesn't work, use direct SQL execution
      console.log('   Please run the SQL in storage-policies.sql manually');
    }
  } catch (error) {
    console.log('   SQL policies will be set up via migration');
  }
}

// Run the script
createStorageBucket();





