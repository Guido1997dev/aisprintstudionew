-- Create quick_scan_submissions table
CREATE TABLE IF NOT EXISTS quick_scan_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT NOT NULL,
  challenge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quick_scan_email ON quick_scan_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_quick_scan_created_at ON quick_scan_submissions(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_quick_scan_status ON quick_scan_submissions(status);

-- Enable Row Level Security
ALTER TABLE quick_scan_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (public submissions)
CREATE POLICY "Allow public inserts" ON quick_scan_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all
CREATE POLICY "Allow authenticated users to read all" ON quick_scan_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON quick_scan_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_quick_scan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quick_scan_updated_at
  BEFORE UPDATE ON quick_scan_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_quick_scan_updated_at();

COMMENT ON TABLE quick_scan_submissions IS 'Stores quick scan form submissions from the homepage';
COMMENT ON COLUMN quick_scan_submissions.name IS 'Full name of the person submitting';
COMMENT ON COLUMN quick_scan_submissions.email IS 'Email address for follow-up';
COMMENT ON COLUMN quick_scan_submissions.website IS 'Company website URL';
COMMENT ON COLUMN quick_scan_submissions.challenge IS 'Optional description of their biggest challenge';
COMMENT ON COLUMN quick_scan_submissions.status IS 'Status of the quick scan: pending, in_progress, completed';
COMMENT ON COLUMN quick_scan_submissions.notes IS 'Internal notes about the scan results';

