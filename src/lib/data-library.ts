/**
 * Data Library Helper Functions
 * Project and Document management functions
 */

import { supabase, supabaseAdmin } from './supabase';
import type { Project, Document, DocumentChunk } from './supabase';

/**
 * Get all projects for a company
 */
export async function getProjects(companyId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('company_id', companyId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

/**
 * Create a new project
 */
export async function createProject(
  companyId: string,
  name: string,
  description?: string
): Promise<Project | null> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        company_id: companyId,
        name,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      // Provide more specific error messages
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error('Projects table does not exist. Please run the database migration to create the required tables.');
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error; // Re-throw to provide better error messages
  }
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  updates: { name?: string; description?: string }
): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

/**
 * Delete a project (cascades to documents and chunks)
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

/**
 * Get all documents for a project
 */
export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

/**
 * Get a single document by ID
 */
export async function getDocument(documentId: string): Promise<Document | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

/**
 * Delete a document (cascades to chunks)
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    // First get the document to delete the file from storage
    const document = await getDocument(documentId);
    
    if (document) {
      // Delete file from Supabase Storage
      const { error: storageError } = await supabaseAdmin.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.warn('Error deleting file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database (cascades to chunks)
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

/**
 * Get document chunks for a document
 */
export async function getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
  try {
    const { data, error } = await supabase
      .from('document_chunks')
      .select('*')
      .eq('document_id', documentId)
      .order('chunk_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching document chunks:', error);
    return [];
  }
}

/**
 * Get project with document count
 */
export async function getProjectWithStats(projectId: string): Promise<{
  project: Project | null;
  documentCount: number;
  readyDocuments: number;
}> {
  try {
    const project = await getProject(projectId);
    if (!project) {
      return { project: null, documentCount: 0, readyDocuments: 0 };
    }

    const documents = await getProjectDocuments(projectId);
    const readyDocuments = documents.filter(d => d.status === 'ready').length;

    return {
      project,
      documentCount: documents.length,
      readyDocuments,
    };
  } catch (error) {
    console.error('Error fetching project with stats:', error);
    return { project: null, documentCount: 0, readyDocuments: 0 };
  }
}

