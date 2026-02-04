/**
 * Document Processing Utilities
 * Text extraction, chunking, and metadata generation
 */

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Split text into chunks with overlap for context preservation
 * @param text - The text to chunk
 * @param maxTokens - Maximum tokens per chunk (default: 1000)
 * @param overlapTokens - Number of tokens to overlap between chunks (default: 200)
 * @returns Array of chunks with metadata
 */
export function chunkText(
  text: string,
  maxTokens: number = 1000,
  overlapTokens: number = 200
): Array<{ content: string; startIndex: number; endIndex: number; metadata: Record<string, unknown> }> {
  const chunks: Array<{ content: string; startIndex: number; endIndex: number; metadata: Record<string, unknown> }> = [];
  
  // Split by paragraphs first for better semantic boundaries
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  let currentChunk = '';
  let currentStartIndex = 0;
  let chunkIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    const paragraphTokens = estimateTokenCount(paragraph);
    const currentChunkTokens = estimateTokenCount(currentChunk);

    // If adding this paragraph would exceed max tokens, save current chunk
    if (currentChunkTokens + paragraphTokens > maxTokens && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        startIndex: currentStartIndex,
        endIndex: currentStartIndex + currentChunk.length,
        metadata: {
          chunk_index: chunkIndex,
          type: 'paragraph_based',
        },
      });

      // Start new chunk with overlap from previous chunk
      const overlapText = getOverlapText(currentChunk, overlapTokens);
      currentChunk = overlapText + '\n\n' + paragraph;
      currentStartIndex = currentStartIndex + currentChunk.length - overlapText.length - paragraph.length - 2;
      chunkIndex++;
    } else {
      // Add paragraph to current chunk
      if (currentChunk.length > 0) {
        currentChunk += '\n\n' + paragraph;
      } else {
        currentChunk = paragraph;
        currentStartIndex = text.indexOf(paragraph);
      }
    }
  }

  // Add remaining chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      startIndex: currentStartIndex,
      endIndex: currentStartIndex + currentChunk.length,
      metadata: {
        chunk_index: chunkIndex,
        type: 'paragraph_based',
      },
    });
  }

  // If no chunks were created (text is shorter than maxTokens), return single chunk
  if (chunks.length === 0) {
    chunks.push({
      content: text.trim(),
      startIndex: 0,
      endIndex: text.length,
      metadata: {
        chunk_index: 0,
        type: 'single',
      },
    });
  }

  return chunks;
}

/**
 * Get overlap text from the end of a chunk
 */
function getOverlapText(text: string, overlapTokens: number): string {
  const overlapChars = overlapTokens * 4; // Rough estimate
  if (text.length <= overlapChars) {
    return text;
  }
  
  // Try to overlap at sentence boundaries
  const overlapStart = text.length - overlapChars;
  const sentenceStart = text.lastIndexOf('.', overlapStart);
  
  if (sentenceStart > overlapStart - overlapChars / 2) {
    return text.substring(sentenceStart + 1).trim();
  }
  
  return text.substring(overlapStart).trim();
}

/**
 * Extract text from PDF buffer
 * Note: This will be implemented in the API route since pdf-parse is a Node.js library
 */
export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

/**
 * Extract text from plain text files
 */
export function extractTextFromPlainText(content: string, fileType: string): string {
  // For plain text files, return as-is
  if (fileType === 'text/plain' || fileType === 'text/markdown') {
    return content;
  }
  
  return content;
}

/**
 * Validate file type
 */
export function isValidFileType(fileType: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/csv',
  ];
  
  return allowedTypes.includes(fileType);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    txt: 'text/plain',
    md: 'text/markdown',
    markdown: 'text/markdown',
    csv: 'text/csv',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}





