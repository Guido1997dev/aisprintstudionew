/**
 * Company-Workflow Mapping
 * Defines which workflows belong to which company
 */

export interface CompanyWorkflow {
  id: string;
  name: string;
  webhookUrl: string;
  description: string;
  requiresSetup?: boolean;
  method?: 'GET' | 'POST';
}

export const COMPANY_WORKFLOWS: Record<string, CompanyWorkflow[]> = {
  'CROONCO': [
    {
      id: 'croonco-zaken-schikken',
      name: 'Zaken schikken',
      webhookUrl: 'https://guidocroon.com/n8n/webhook/cf0b17f2-527e-4058-9c64-1dfe008e515f',
      description: 'Automatische verwerking van zakelijke schikkingen',
      method: 'POST',
    },
    {
      id: 'croonco-verzoekschriften',
      name: 'Verzoekschriften analyseren',
      webhookUrl: '', // Moet nog geconfigureerd worden in N8N
      description: 'AI-analyse van juridische verzoekschriften',
      requiresSetup: true,
      method: 'POST',
    }
  ],
  'AI Sprint Studio': [
    // Admin kan alle workflows zien
  ],
  'Bedrijf A': [
    // Demo workflows voor Bedrijf A
  ],
  'Company B': [
    // Demo workflows voor Company B
  ],
};

/**
 * Get workflows for a specific company
 */
export function getCompanyWorkflows(company: string): CompanyWorkflow[] {
  return COMPANY_WORKFLOWS[company] || [];
}

/**
 * Check if a company has workflows configured
 */
export function hasWorkflows(company: string): boolean {
  const workflows = getCompanyWorkflows(company);
  return workflows.length > 0 && workflows.some(w => !w.requiresSetup);
}

/**
 * Get workflows that need setup
 */
export function getWorkflowsNeedingSetup(company: string): CompanyWorkflow[] {
  return getCompanyWorkflows(company).filter(w => w.requiresSetup);
}

