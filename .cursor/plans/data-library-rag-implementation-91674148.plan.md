<!-- 91674148-def4-44e3-aa83-baacd5a07775 306366b0-42f2-4526-b64e-417829991429 -->
# Data Library RAG Implementation Plan

## 1. Database Schema (Supabase)

### Nieuwe tabellen toevoegen:

**projects table:**

- id (UUID, primary key)
- company_id (UUID, foreign key naar companies)
- name (VARCHAR, project naam)
- description (TEXT, optioneel)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**documents table:**

- id (UUID, primary key)
- project_id (UUID, foreign key naar projects)
- company_id (UUID, foreign key naar companies)
- name (VARCHAR, bestandsnaam)
- file_path (VARCHAR, Supabase Storage path)
- file_type (VARCHAR, mime type)
- file_size (BIGINT, bytes)
- content_text (TEXT, geëxtraheerde tekst)
- status (TEXT: 'uploading', 'processing', 'ready', 'error')
- error_message (TEXT, optioneel)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**document_chunks table:**

- id (UUID, primary key)
- document_id (UUID, foreign key naar documents)
- chunk_index (INTEGER, volgorde)
- content (TEXT, chunk tekst)
- embedding (vector(1536), OpenAI embedding)
- metadata (JSONB, extra info zoals paginanummer)
- created_at (TIMESTAMP)

### Supabase Extensions:

- Enable pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`
- Create vector index voor similarity search

### Row Level Security (RLS):

- Policies zodat gebruikers alleen hun eigen company data kunnen zien
- Policies voor projects en documents per company_id

## 2. Data Library Pagina

**File:** `src/app/dashboard/data-library/page.tsx`

### Functionaliteit:

- Overzicht van alle projecten voor de huidige company
- Project aanmaken (modal/form)
- Project bewerken
- Project verwijderen (met confirmatie)
- Navigatie naar project detail pagina
- Empty state wanneer er geen projecten zijn

### UI Componenten:

- Project grid/list view
- "New Project" button
- Project cards met naam, document count, last updated
- Search/filter functionaliteit

## 3. Project Detail Pagina

**File:** `src/app/dashboard/data-library/[projectId]/page.tsx`

### Functionaliteit:

- Lijst van alle documenten in het project
- Document upload (drag & drop + file picker)
- Document verwijderen
- Document status weergeven (processing, ready, error)
- Preview van document content (optioneel)
- Document metadata (grootte, type, upload datum)

### UI Componenten:

- Document list/table
- Upload area component
- Status badges
- Delete buttons met confirmatie

## 4. Document Upload & Processing API

**File:** `src/app/api/documents/upload/route.ts`

### Functionaliteit:

- Accept file upload (multipart/form-data)
- Valideer file type (PDF, TXT, MD, etc.)
- Upload naar Supabase Storage
- Parse PDF content (gebruik pdf-parse of pdfjs-dist)
- Extract tekst uit document
- Split tekst in chunks (max 1000 tokens per chunk)
- Genereer embeddings voor elk chunk via OpenAI API
- Sla chunks + embeddings op in database
- Update document status

### Dependencies:

- `pdf-parse` of `pdfjs-dist` voor PDF parsing
- OpenAI SDK voor embeddings
- Supabase Storage client

## 5. OpenAI Embedding Service

**File:** `src/lib/embeddings.ts`

### Functionaliteit:

- `generateEmbedding(text: string)` - Genereer embedding voor tekst
- `generateEmbeddingsBatch(texts: string[])` - Batch processing
- Gebruik `text-embedding-3-small` of `text-embedding-ada-002`
- Error handling en retry logic

## 6. Document Chunking Logic

**File:** `src/lib/document-processing.ts`

### Functionaliteit:

- `chunkText(text: string, maxTokens: number)` - Split tekst in chunks
- Overlap tussen chunks voor context
- Metadata per chunk (paginanummer, sectie, etc.)
- Token counting (bij benadering)

## 7. RAG Integration in Chat

### Chat Page Updates:

**File:** `src/app/dashboard/chat/page.tsx`

### Nieuwe Features:

- Project selector dropdown bovenaan chat
- Wanneer project geselecteerd is: RAG enabled
- Bij chat messages: zoek relevante chunks in geselecteerde project
- Voeg context toe aan AI prompt
- Project selector toont aantal documenten per project

### RAG Query API:

**File:** `src/app/api/rag/search/route.ts`

### Functionaliteit:

- Accept query string en project_id
- Genereer embedding voor query
- Vector similarity search in Supabase (pgvector)
- Return top N relevante chunks met metadata
- Include document context (naam, project, etc.)

### Chat API Updates:

**File:** `src/app/api/chat/route.ts`

### Updates:

- Check of project_id meegegeven is
- Als project_id: call RAG search API
- Voeg relevante context toe aan webhook payload
- Include: `rag_context` array met relevante chunks

## 8. Supabase MCP Integration

### Database Setup:

- Gebruik Supabase MCP tools om:
- Tabellen aan te maken
- pgvector extension te enableen
- Indexes aan te maken
- RLS policies te configureren

### Storage Setup:

- Maak Storage bucket: `documents`
- Configureer policies voor company isolation

## 9. Helper Functions

**File:** `src/lib/data-library.ts`

### Functions:

- `getProjects(companyId: string)` - Haal alle projecten op
- `createProject(companyId: string, name: string, description?: string)`
- `getProjectDocuments(projectId: string)`
- `deleteDocument(documentId: string)`
- `getDocumentChunks(documentId: string)`

## 10. TypeScript Types

**File:** `src/lib/supabase.ts` (update)

### Nieuwe interfaces:

- `Project`
- `Document`
- `DocumentChunk`
- `RAGContext`

## Implementation Order:

1. Database schema setup (Supabase MCP)
2. Data Library pagina (project overview)
3. Project detail pagina met document list
4. Document upload API + processing
5. Embedding generation service
6. Vector search API
7. RAG integratie in chat
8. Testing & refinement

## Files to Create/Modify:

**New Files:**

- `src/app/dashboard/data-library/page.tsx`
- `src/app/dashboard/data-library/[projectId]/page.tsx`
- `src/app/api/documents/upload/route.ts`
- `src/app/api/rag/search/route.ts`
- `src/lib/embeddings.ts`
- `src/lib/document-processing.ts`
- `src/lib/data-library.ts`

**Modified Files:**

- `src/app/dashboard/chat/page.tsx` (project selector + RAG)
- `src/app/api/chat/route.ts` (RAG context toevoegen)
- `src/lib/supabase.ts` (nieuwe types)
- `src/components/sidebar-nav.tsx` (data-library link werkt al)

**Dependencies to Add:**

- `pdf-parse` of `pdfjs-dist` voor PDF parsing
- `openai` package voor embeddings (als nog niet aanwezig)

### To-dos

- [ ] Database schema aanmaken in Supabase: projects, documents, document_chunks tabellen met pgvector
- [ ] Supabase Storage bucket configureren voor document opslag
- [ ] Data Library pagina maken met project overview en CRUD functionaliteit
- [ ] Project detail pagina maken met document list en upload functionaliteit
- [ ] Document upload API maken met PDF parsing en tekst extractie
- [ ] OpenAI embedding service implementeren voor chunk embeddings
- [ ] Document chunking logic implementeren met overlap en metadata
- [ ] Volledige document processing pipeline: upload → parse → chunk → embed → store
- [ ] RAG search API maken met vector similarity search in Supabase
- [ ] RAG integratie in chat pagina: project selector en context injection
- [ ] Chat API updaten om RAG context mee te sturen naar webhook
- [ ] Helper functions maken voor project en document management