-- Data Library RAG Implementation Migration
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  content_text TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'ready', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_chunks table with vector support
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, chunk_index)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_index ON document_chunks(document_id, chunk_index);

-- Create vector index for similarity search (using cosine distance)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RPC function for vector similarity search
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  project_id UUID,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_index INTEGER,
  content TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  INNER JOIN documents d ON dc.document_id = d.id
  WHERE d.project_id = match_document_chunks.project_id
    AND d.status = 'ready'
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view their own company projects"
  ON projects FOR SELECT
  USING (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

CREATE POLICY "Users can create projects for their company"
  ON projects FOR INSERT
  WITH CHECK (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

CREATE POLICY "Users can update their own company projects"
  ON projects FOR UPDATE
  USING (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

CREATE POLICY "Users can delete their own company projects"
  ON projects FOR DELETE
  USING (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

-- RLS Policies for documents
CREATE POLICY "Users can view their own company documents"
  ON documents FOR SELECT
  USING (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

CREATE POLICY "Users can create documents for their company"
  ON documents FOR INSERT
  WITH CHECK (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

CREATE POLICY "Users can update their own company documents"
  ON documents FOR UPDATE
  USING (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

CREATE POLICY "Users can delete their own company documents"
  ON documents FOR DELETE
  USING (auth.uid()::text = company_id::text OR true); -- Adjust based on your auth setup

-- RLS Policies for document_chunks
CREATE POLICY "Users can view chunks from their own company documents"
  ON document_chunks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_chunks.document_id
      AND (auth.uid()::text = d.company_id::text OR true) -- Adjust based on your auth setup
    )
  );

-- Note: The RLS policies above use a simplified check (OR true)
-- In production, you should implement proper company-based access control
-- based on your authentication system (NextAuth, Supabase Auth, etc.)

-- Grant necessary permissions (adjust based on your setup)
-- GRANT ALL ON projects TO authenticated;
-- GRANT ALL ON documents TO authenticated;
-- GRANT ALL ON document_chunks TO authenticated;





