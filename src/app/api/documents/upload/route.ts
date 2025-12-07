import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { chunkText, isValidFileType, getMimeTypeFromExtension } from '@/lib/document-processing';
import { generateEmbeddingsBatch } from '@/lib/embeddings';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add proper authentication check
    // For now, we trust the client-sent companyId
    // In production, verify session and match companyId to user's company

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const companyId = formData.get('companyId') as string;

    if (!file || !projectId || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, projectId, companyId' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type || getMimeTypeFromExtension(file.name.split('.').pop() || '');
    if (!isValidFileType(fileType)) {
      return NextResponse.json(
        { error: `File type ${fileType} is not supported. Please upload PDF, TXT, MD, or CSV files.` },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Create document record with 'uploading' status
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        project_id: projectId,
        company_id: companyId,
        name: file.name,
        file_type: fileType,
        file_size: file.size,
        status: 'uploading',
      })
      .select()
      .single();

    if (docError || !document) {
      console.error('Error creating document record:', docError);
      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      );
    }

    // Upload file to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${companyId}/${projectId}/${document.id}/${file.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType: fileType,
        upsert: false,
      });

    if (uploadError) {
      // Delete document record if upload fails
      await supabaseAdmin.from('documents').delete().eq('id', document.id);
      console.error('Error uploading file to storage:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Update document status to 'processing'
    await supabaseAdmin
      .from('documents')
      .update({
        file_path: filePath,
        status: 'processing',
      })
      .eq('id', document.id);

    // Process document asynchronously
    processDocument(document.id, fileBuffer, fileType, filePath).catch((error) => {
      console.error('Error processing document:', error);
      // Update document status to 'error'
      supabaseAdmin
        .from('documents')
        .update({
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Processing failed',
        })
        .eq('id', document.id);
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        status: 'processing',
      },
    });
  } catch (error) {
    console.error('Error in upload endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process document: extract text, chunk, generate embeddings, and store
 */
async function processDocument(
  documentId: string,
  fileBuffer: Buffer,
  fileType: string,
  filePath: string
) {
  try {
    // Extract text from file
    let text: string;

    if (fileType === 'application/pdf') {
      // Parse PDF
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text;
    } else if (fileType.startsWith('text/')) {
      // Plain text files
      text = fileBuffer.toString('utf-8');
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text content extracted from document');
    }

    // Update document with extracted text
    await supabaseAdmin
      .from('documents')
      .update({
        content_text: text.substring(0, 100000), // Store first 100k chars for preview
      })
      .eq('id', documentId);

    // Chunk the text
    const chunks = chunkText(text, 1000, 200); // max 1000 tokens, 200 overlap

    if (chunks.length === 0) {
      throw new Error('No chunks created from document');
    }

    // Generate embeddings for all chunks
    const chunkTexts = chunks.map((chunk) => chunk.content);
    const embeddings = await generateEmbeddingsBatch(chunkTexts, 100);

    if (embeddings.length !== chunks.length) {
      throw new Error('Mismatch between chunks and embeddings');
    }

    // Store chunks with embeddings in database
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: documentId,
      chunk_index: index,
      content: chunk.content,
      embedding: embeddings[index],
      metadata: {
        ...chunk.metadata,
        start_index: chunk.startIndex,
        end_index: chunk.endIndex,
      },
    }));

    // Insert chunks in batches
    const batchSize = 50;
    for (let i = 0; i < chunksToInsert.length; i += batchSize) {
      const batch = chunksToInsert.slice(i, i + batchSize);
      const { error: chunkError } = await supabaseAdmin
        .from('document_chunks')
        .insert(batch);

      if (chunkError) {
        console.error('Error inserting chunks:', chunkError);
        throw new Error(`Failed to store chunks: ${chunkError.message}`);
      }
    }

    // Update document status to 'ready'
    await supabaseAdmin
      .from('documents')
      .update({
        status: 'ready',
      })
      .eq('id', documentId);

    console.log(`Successfully processed document ${documentId}: ${chunks.length} chunks created`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    throw error;
  }
}

