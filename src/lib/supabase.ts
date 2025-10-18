/**
 * Supabase Client Setup
 * Multi-tenant database integration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Database Types for Multi-Tenant System
 */

export interface Company {
  id: string;
  name: string;
  slug: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_start: string | null;
  subscription_end: string | null;
  trial_end_date: string | null;
  created_at: string;
  custom_branding: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
}

export interface TenantUser {
  id: string;
  company_id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface FeatureAccess {
  id: string;
  company_id: string;
  feature_name: string;
  is_enabled: boolean;
  limit_value: number | null;
  created_at: string;
}

export interface N8NCredentials {
  id: string;
  company_id: string;
  n8n_url: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  company_id: string;
  name: string;
  n8n_workflow_id: string;
  webhook_url: string;
  created_at: string;
}

export interface Execution {
  id: string;
  company_id: string;
  workflow_id: string;
  status: 'success' | 'error' | 'running' | 'waiting';
  started_at: string;
  ended_at: string | null;
}

export interface ChatMessage {
  id: string;
  company_id: string;
  user_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

/**
 * Utility: Get company by ID
 */
export async function getCompanyById(companyId: string): Promise<Company | null> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

/**
 * Utility: Check if user belongs to company
 */
export async function verifyUserCompanyAccess(
  userId: string,
  companyId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .eq('company_id', companyId)
      .single();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error verifying user access:', error);
    return false;
  }
}

/**
 * Utility: Get user with company info
 */
export async function getUserWithCompany(
  userId: string
): Promise<{ user: TenantUser; company: Company } | null> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', userData.company_id)
      .single();

    if (companyError) throw companyError;

    return {
      user: userData,
      company: companyData,
    };
  } catch (error) {
    console.error('Error fetching user with company:', error);
    return null;
  }
}
