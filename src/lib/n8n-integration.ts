/**
 * N8N Integration Library
 * Handles secure communication with N8N instances
 */

import { supabaseAdmin } from './supabase';

interface N8NConfig {
  url: string;
  apiKey: string;
}

export async function getN8NCredentials(companyId: string): Promise<N8NConfig | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('n8n_credentials')
      .select('n8n_url, api_key')
      .eq('company_id', companyId)
      .single();

    if (error) {
      console.error('Error fetching N8N credentials:', error);
      return null;
    }

    return {
      url: data.n8n_url,
      apiKey: data.api_key,
    };
  } catch (error) {
    console.error('Error in getN8NCredentials:', error);
    return null;
  }
}

export async function saveN8NCredentials(
  companyId: string,
  url: string,
  apiKey: string
): Promise<boolean> {
  try {
    const isValid = await validateN8NCredentials(url, apiKey);
    if (!isValid) {
      throw new Error('Invalid N8N credentials');
    }

    const { error } = await supabaseAdmin
      .from('n8n_credentials')
      .upsert(
        {
          company_id: companyId,
          n8n_url: url,
          api_key: apiKey,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'company_id' }
      );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving N8N credentials:', error);
    return false;
  }
}

export async function validateN8NCredentials(url: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error validating N8N credentials:', error);
    return false;
  }
}

export async function getN8NWorkflows(config: N8NConfig): Promise<Record<string, unknown>[]> {
  try {
    const response = await fetch(`${config.url}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`N8N API error: ${response.statusText}`);
    }

    const data = await response.json() as { data: Record<string, unknown>[] };
    return data.data || [];
  } catch (error) {
    console.error('Error fetching N8N workflows:', error);
    return [];
  }
}

export async function getN8NExecutions(config: N8NConfig, workflowId: string, limit: number = 10): Promise<Record<string, unknown>[]> {
  try {
    const response = await fetch(
      `${config.url}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': config.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`N8N API error: ${response.statusText}`);
    }

    const data = await response.json() as { data: Record<string, unknown>[] };
    return data.data || [];
  } catch (error) {
    console.error('Error fetching N8N executions:', error);
    return [];
  }
}

export async function testWebhookConnection(webhookUrl: string): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: true,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error testing webhook:', error);
    return false;
  }
}

export async function triggerN8NWorkflow(webhookUrl: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    return await response.json() as Record<string, unknown>;
  } catch (error) {
    console.error('Error triggering N8N workflow:', error);
    throw error;
  }
}
