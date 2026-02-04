/**
 * OpenAI Embedding Service
 * Generate embeddings for text chunks using OpenAI API
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings';

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set. Embedding generation will fail.');
}

/**
 * Generate embedding for a single text
 * Uses text-embedding-3-small (1536 dimensions) for cost efficiency
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      throw new Error('Invalid response from OpenAI API');
    }

    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * OpenAI supports up to 2048 inputs per request
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize: number = 100
): Promise<number[][]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const embeddings: number[][] = [];
  
  // Process in batches to avoid rate limits
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: batch,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response from OpenAI API');
      }

      // Extract embeddings in order
      const batchEmbeddings = data.data.map((item: { embedding: number[] }) => item.embedding);
      embeddings.push(...batchEmbeddings);

      // Add small delay between batches to respect rate limits
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error generating embeddings for batch ${i}-${i + batch.length}:`, error);
      throw error;
    }
  }

  return embeddings;
}

/**
 * Retry wrapper for embedding generation with exponential backoff
 */
export async function generateEmbeddingWithRetry(
  text: string,
  maxRetries: number = 3
): Promise<number[]> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateEmbedding(text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on authentication errors
      if (lastError.message.includes('401') || lastError.message.includes('auth')) {
        throw lastError;
      }
      
      // Exponential backoff: wait 1s, 2s, 4s
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Failed to generate embedding after retries');
}





