import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/embeddings';
import type { RAGContext } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { query, projectId, limit = 5 } = await request.json();

    if (!query || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: query, projectId' },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Perform vector similarity search using pgvector
    // Using cosine distance (1 - cosine similarity)
    // We want chunks from documents in the specified project
    const { data: chunks, error } = await supabaseAdmin.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      project_id: projectId,
      match_threshold: 0.7, // Minimum similarity threshold
      match_count: limit,
    });

    if (error) {
      // If the function doesn't exist, fall back to manual query
      console.warn('RPC function not found, using manual query:', error);
      return await manualVectorSearch(queryEmbedding, projectId, limit);
    }

    // Transform results to RAGContext format
    const ragContexts: RAGContext[] = await Promise.all(
      (chunks || []).map(async (chunk: any) => {
        // Get document and project info
        const { data: document } = await supabaseAdmin
          .from('documents')
          .select('name, project_id')
          .eq('id', chunk.document_id)
          .single();

        const { data: project } = await supabaseAdmin
          .from('projects')
          .select('name')
          .eq('id', document?.project_id || '')
          .single();

        return {
          chunk_id: chunk.id,
          document_id: chunk.document_id,
          document_name: document?.name || 'Unknown',
          project_id: document?.project_id || '',
          project_name: project?.name || 'Unknown',
          content: chunk.content,
          chunk_index: chunk.chunk_index,
          metadata: chunk.metadata,
          similarity: chunk.similarity || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      results: ragContexts,
      count: ragContexts.length,
    });
  } catch (error) {
    console.error('Error in RAG search:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Fallback manual vector search if RPC function doesn't exist
 */
async function manualVectorSearch(
  queryEmbedding: number[],
  projectId: string,
  limit: number
): Promise<NextResponse> {
  try {
    // First, get all document IDs for this project
    const { data: documents } = await supabaseAdmin
      .from('documents')
      .select('id')
      .eq('project_id', projectId)
      .eq('status', 'ready');

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        count: 0,
      });
    }

    const documentIds = documents.map((d) => d.id);

    // Get all chunks for these documents
    const { data: allChunks } = await supabaseAdmin
      .from('document_chunks')
      .select('*')
      .in('document_id', documentIds);

    if (!allChunks || allChunks.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        count: 0,
      });
    }

    // Calculate cosine similarity for each chunk
    const chunksWithSimilarity = allChunks
      .filter((chunk) => chunk.embedding && Array.isArray(chunk.embedding))
      .map((chunk) => {
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding as number[]);
        return { ...chunk, similarity };
      })
      .filter((chunk) => chunk.similarity >= 0.7) // Filter by threshold
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity descending
      .slice(0, limit); // Take top N

    // Transform to RAGContext format
    const ragContexts: RAGContext[] = await Promise.all(
      chunksWithSimilarity.map(async (chunk: any) => {
        const { data: document } = await supabaseAdmin
          .from('documents')
          .select('name, project_id')
          .eq('id', chunk.document_id)
          .single();

        const { data: project } = await supabaseAdmin
          .from('projects')
          .select('name')
          .eq('id', document?.project_id || '')
          .single();

        return {
          chunk_id: chunk.id,
          document_id: chunk.document_id,
          document_name: document?.name || 'Unknown',
          project_id: document?.project_id || '',
          project_name: project?.name || 'Unknown',
          content: chunk.content,
          chunk_index: chunk.chunk_index,
          metadata: chunk.metadata,
          similarity: chunk.similarity,
        };
      })
    );

    return NextResponse.json({
      success: true,
      results: ragContexts,
      count: ragContexts.length,
    });
  } catch (error) {
    console.error('Error in manual vector search:', error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}



