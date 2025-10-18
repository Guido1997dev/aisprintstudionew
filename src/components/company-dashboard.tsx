'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { getCompanyWorkflows, type CompanyWorkflow } from '@/lib/company-workflows';
import { triggerWorkflow, type Execution } from '@/lib/n8n';
import { Play, CheckCircle2, XCircle, Clock, Zap, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CompanyDashboardProps {
  company: string;
}

export function CompanyDashboard({ company }: CompanyDashboardProps) {
  const [workflows] = useState<CompanyWorkflow[]>(getCompanyWorkflows(company));
  const [triggeringWorkflow, setTriggeringWorkflow] = useState<string | null>(null);
  const [triggerResults, setTriggerResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [executions, setExecutions] = useState<Record<string, Execution[]>>({});
  const [timeline] = useState<Array<{ date: string; success: number; error: number; total: number }>>([]);

  // Load execution data
  useEffect(() => {
    const loadExecutions = async () => {
      const executionData: Record<string, Execution[]> = {};
      
      for (const workflow of workflows) {
        if (workflow.webhookUrl && !workflow.requiresSetup) {
          try {
            // For now, we'll use mock data since we don't have workflow IDs
            // In production, you'd extract workflow ID from webhook URL or use N8N API
            executionData[workflow.id] = [];
          } catch (error) {
            console.error(`Error loading executions for ${workflow.id}:`, error);
          }
        }
      }
      
      setExecutions(executionData);
    };

    loadExecutions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadExecutions();
    }, 30000);

    return () => clearInterval(interval);
  }, [workflows]);

  const handleTrigger = async (workflow: CompanyWorkflow) => {
    if (!workflow.webhookUrl || workflow.requiresSetup) return;

    setTriggeringWorkflow(workflow.id);
    setTriggerResults(prev => {
      const newResults = { ...prev };
      delete newResults[workflow.id];
      return newResults;
    });

    try {
      await triggerWorkflow(workflow.webhookUrl, workflow.method || 'POST', {
        triggeredFrom: 'dashboard',
        company: company,
        timestamp: new Date().toISOString(),
      });

      setTriggerResults(prev => ({
        ...prev,
        [workflow.id]: {
          success: true,
          message: `${workflow.name} succesvol gestart!`,
        },
      }));
    } catch (error) {
      setTriggerResults(prev => ({
        ...prev,
        [workflow.id]: {
          success: false,
          message: `Fout bij starten: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
        },
      }));
    } finally {
      setTriggeringWorkflow(null);
    }
  };

  const activeWorkflows = workflows.filter(w => !w.requiresSetup);
  const setupNeeded = workflows.filter(w => w.requiresSetup);

  // Calculate statistics
  const totalExecutions = Object.values(executions).reduce((acc, execs) => acc + execs.length, 0);
  const successfulExecutions = Object.values(executions)
    .flat()
    .filter(e => e.status === 'success').length;
  const failedExecutions = Object.values(executions)
    .flat()
    .filter(e => e.status === 'error').length;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

  // Pie chart data
  const pieData = [
    { name: 'Success', value: successfulExecutions, color: '#22c55e' },
    { name: 'Failed', value: failedExecutions, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welkom, {company}</h2>
        <p className="text-muted-foreground">
          Beheer en monitor je automatiseringen
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Automatiseringen</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {setupNeeded.length > 0 && `${setupNeeded.length} in configuratie`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Uitgevoerd</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Alle tijd
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {successfulExecutions} van {totalExecutions} succesvol
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gefaald</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Requires aandacht
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Trigger Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeWorkflows.map((workflow) => {
          const result = triggerResults[workflow.id];
          const isTriggering = triggeringWorkflow === workflow.id;
          const workflowExecutions = executions[workflow.id] || [];
          const lastExecution = workflowExecutions[0];

          return (
            <Card key={workflow.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      {workflow.name}
                    </CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </div>
                  {lastExecution && (
                    <Badge variant={lastExecution.status === 'success' ? 'default' : 'destructive'}>
                      {lastExecution.status === 'success' ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Success</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                      )}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleTrigger(workflow)}
                  disabled={isTriggering}
                  size="lg"
                  className="w-full"
                >
                  {isTriggering ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Wordt gestart...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start {workflow.name}
                    </>
                  )}
                </Button>

                {result && (
                  <Alert variant={result.success ? 'default' : 'destructive'}>
                    <AlertTitle className="flex items-center gap-2">
                      {result.success ? (
                        <><CheckCircle2 className="h-4 w-4" /> Gelukt!</>
                      ) : (
                        <><XCircle className="h-4 w-4" /> Fout</>
                      )}
                    </AlertTitle>
                    <AlertDescription>{result.message}</AlertDescription>
                  </Alert>
                )}

                {workflowExecutions.length > 0 && (
                  <div className="pt-2 border-t space-y-2">
                    <p className="text-sm font-medium">Laatste uitvoeringen:</p>
                    <div className="space-y-1">
                      {workflowExecutions.slice(0, 3).map((exec) => (
                        <div key={exec.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {exec.status === 'success' ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span className="text-muted-foreground">
                              {new Date(exec.startedAt).toLocaleString('nl-NL', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {exec.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Setup Needed Workflows */}
      {setupNeeded.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Configuratie Vereist
            </CardTitle>
            <CardDescription>
              De volgende automatiseringen moeten nog worden geconfigureerd
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {setupNeeded.map((workflow) => (
              <div key={workflow.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{workflow.name}</p>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Setup Required
                </Badge>
              </div>
            ))}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hulp nodig?</AlertTitle>
              <AlertDescription>
                Neem contact op met je account manager voor het configureren van deze automatiseringen.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Analytics Section */}
      {totalExecutions > 0 && (
        <>
          <Separator />
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Success Rate Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Verdeling</CardTitle>
                <CardDescription>Verhouding succesvolle vs gefaalde uitvoeringen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Execution Timeline */}
            {timeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uitvoeringen Tijdlijn</CardTitle>
                  <CardDescription>Laatste 7 dagen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="success" stroke="#22c55e" name="Success" />
                        <Line type="monotone" dataKey="error" stroke="#ef4444" name="Failed" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

