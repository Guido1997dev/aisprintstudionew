/**
 * n8n API Integration
 * Provides functions to interact with n8n workflows
 */

const N8N_API_URL = process.env.NEXT_PUBLIC_N8N_API_URL || process.env.N8N_API_URL;
const N8N_API_KEY = process.env.NEXT_PUBLIC_N8N_API_KEY || process.env.N8N_API_KEY;

export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  tags?: Array<{ id: string; name: string }>;
  createdAt?: string;
  updatedAt?: string;
  nodes?: unknown[];
  settings?: {
    executionTimeout?: number;
  };
}

export interface Execution {
  id: string;
  workflowId: string;
  mode: string;
  status: 'success' | 'error' | 'waiting' | 'running';
  startedAt: string;
  stoppedAt?: string;
  workflowData?: {
    name: string;
  };
}

export interface ExecutionStats {
  total: number;
  success: number;
  error: number;
  waiting: number;
}

export interface WorkflowWithStats extends Workflow {
  executionCount?: number;
  averageRuntime?: number;
  lastExecution?: string;
  successRate?: number;
  webhookUrl?: string;
}

/**
 * Fetch helper with n8n authentication
 * Note: n8n API integration is optional - webhooks work without API
 */
async function n8nFetch(endpoint: string, options: RequestInit = {}) {
  if (!N8N_API_URL || !N8N_API_KEY) {
    // Return empty response instead of throwing - webhooks work without API
    console.warn('n8n API configuration missing. Using webhooks only (API not required).');
    return { data: [] };
  }

  const url = `${N8N_API_URL}/api/v1${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('n8n fetch error:', error);
    throw error;
  }
}

/**
 * Get all workflows
 */
export async function getWorkflows(): Promise<Workflow[]> {
  try {
    const data = await n8nFetch('/workflows');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return [];
  }
}

/**
 * Get workflows with execution statistics
 */
export async function getWorkflowsWithStats(): Promise<WorkflowWithStats[]> {
  try {
    const workflows = await getWorkflows();
    const executionsPromises = workflows.map(async (workflow) => {
      const executions = await getExecutions(workflow.id, 50);
      const successfulExecutions = executions.filter(e => e.status === 'success');
      const totalRuntime = successfulExecutions.reduce((acc, exec) => {
        if (exec.stoppedAt) {
          const runtime = new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime();
          return acc + runtime;
        }
        return acc;
      }, 0);

      const averageRuntime = successfulExecutions.length > 0 
        ? totalRuntime / successfulExecutions.length 
        : 0;

      const successRate = executions.length > 0
        ? (successfulExecutions.length / executions.length) * 100
        : 0;

      // Extract webhook URL from workflow nodes if it has a webhook trigger
      let webhookUrl = '';
      if (workflow.nodes && Array.isArray(workflow.nodes)) {
        const webhookNode = workflow.nodes.find((node: unknown) => {
          const n = node as { type?: string; parameters?: { path?: string } };
          return n.type === 'n8n-nodes-base.webhook' || 
                 n.type === 'n8n-nodes-base.webhookTrigger';
        }) as { type?: string; parameters?: { path?: string } } | undefined;
        
        if (webhookNode && webhookNode.parameters?.path) {
          webhookUrl = `${N8N_API_URL}/webhook/${webhookNode.parameters.path}`;
        }
      }

      return {
        ...workflow,
        executionCount: executions.length,
        averageRuntime: Math.round(averageRuntime),
        lastExecution: executions[0]?.startedAt,
        successRate: Math.round(successRate * 10) / 10,
        webhookUrl,
      };
    });

    return await Promise.all(executionsPromises);
  } catch (error) {
    console.error('Error fetching workflows with stats:', error);
    return [];
  }
}

/**
 * Get a specific workflow by ID
 */
export async function getWorkflow(id: string): Promise<Workflow | null> {
  try {
    return await n8nFetch(`/workflows/${id}`);
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    return null;
  }
}

/**
 * Get executions for a workflow
 */
export async function getExecutions(workflowId?: string, limit: number = 10): Promise<Execution[]> {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (workflowId) {
      params.append('workflowId', workflowId);
    }
    
    const data = await n8nFetch(`/executions?${params.toString()}`);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching executions:', error);
    return [];
  }
}

/**
 * Get execution statistics
 */
export async function getExecutionStats(workflowId?: string): Promise<ExecutionStats> {
  const executions = await getExecutions(workflowId, 100);
  
  return {
    total: executions.length,
    success: executions.filter(e => e.status === 'success').length,
    error: executions.filter(e => e.status === 'error').length,
    waiting: executions.filter(e => e.status === 'waiting').length,
  };
}

/**
 * Trigger a workflow via webhook (supports GET and POST)
 */
export async function triggerWorkflow(
  webhookUrl: string, 
  method: 'GET' | 'POST' = 'POST',
  data?: unknown
): Promise<unknown> {
  try {
    const options: RequestInit = {
      method,
      headers: method === 'POST' ? {
        'Content-Type': 'application/json',
      } : undefined,
    };

    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(webhookUrl, options);

    if (!response.ok) {
      throw new Error(`Failed to trigger workflow: ${response.statusText}`);
    }

    // Try to parse JSON, but handle text responses too
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('Error triggering workflow:', error);
    throw error;
  }
}

/**
 * Activate/Deactivate a workflow
 */
export async function toggleWorkflow(id: string, active: boolean): Promise<boolean> {
  try {
    await n8nFetch(`/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
    return true;
  } catch (error) {
    console.error(`Error toggling workflow ${id}:`, error);
    return false;
  }
}

/**
 * Format runtime duration in human-readable format
 */
export function formatRuntime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Get workflows filtered by company tags
 */
export async function getWorkflowsByCompany(company: string): Promise<WorkflowWithStats[]> {
  try {
    const allWorkflows = await getWorkflowsWithStats();
    
    // Filter by company tag or return all for admin
    if (company === 'AI Sprint Studio') {
      return allWorkflows;
    }
    
    return allWorkflows.filter(workflow => {
      if (!workflow.tags) return false;
      return workflow.tags.some(tag => 
        tag.name.toLowerCase().includes(company.toLowerCase())
      );
    });
  } catch (error) {
    console.error('Error fetching workflows by company:', error);
    return [];
  }
}

/**
 * Get detailed execution history for a workflow
 */
export async function getExecutionHistory(
  workflowId: string, 
  limit: number = 20
): Promise<Execution[]> {
  try {
    return await getExecutions(workflowId, limit);
  } catch (error) {
    console.error(`Error fetching execution history for workflow ${workflowId}:`, error);
    return [];
  }
}

/**
 * Get detailed information about a specific execution
 */
export async function getExecutionDetails(executionId: string): Promise<Execution | null> {
  try {
    return await n8nFetch(`/executions/${executionId}`);
  } catch (error) {
    console.error(`Error fetching execution ${executionId}:`, error);
    return null;
  }
}

/**
 * Get execution statistics for the last N days
 */
export async function getExecutionTimeline(
  workflowId?: string, 
  days: number = 7
): Promise<Array<{ date: string; success: number; error: number; total: number }>> {
  try {
    const executions = await getExecutions(workflowId, 1000);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const timeline: Record<string, { success: number; error: number; total: number }> = {};
    
    executions.forEach(execution => {
      const execDate = new Date(execution.startedAt);
      if (execDate >= startDate) {
        const dateKey = execDate.toISOString().split('T')[0];
        
        if (!timeline[dateKey]) {
          timeline[dateKey] = { success: 0, error: 0, total: 0 };
        }
        
        timeline[dateKey].total++;
        if (execution.status === 'success') {
          timeline[dateKey].success++;
        } else if (execution.status === 'error') {
          timeline[dateKey].error++;
        }
      }
    });
    
    return Object.entries(timeline)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching execution timeline:', error);
    return [];
  }
}
