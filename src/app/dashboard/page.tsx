'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Play, Zap, Clock, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { getWorkflowsWithStats, triggerWorkflow, toggleWorkflow, formatRuntime, type WorkflowWithStats } from '@/lib/n8n';

// Mock chart data
const chartData = [
  { date: 'Jun 24', visitors: 4500 },
  { date: 'Jun 25', visitors: 3200 },
  { date: 'Jun 26', visitors: 2800 },
  { date: 'Jun 27', visitors: 4800 },
  { date: 'Jun 28', visitors: 4200 },
  { date: 'Jun 29', visitors: 3800 },
  { date: 'Jun 30', visitors: 5200 },
];

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<WorkflowWithStats[]>([]);
  const [timePeriod, setTimePeriod] = useState('3months');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowWithStats | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookMethod, setWebhookMethod] = useState<'GET' | 'POST'>('GET');
  const [webhookData, setWebhookData] = useState('{}');
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{ success: boolean; message: string } | null>(null);
  const [useTestUrl, setUseTestUrl] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const workflowsData = await getWorkflowsWithStats();
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleToggleWorkflow = async (id: string, currentActive: boolean) => {
    const success = await toggleWorkflow(id, !currentActive);
    if (success) {
      setWorkflows(workflows.map(w => 
        w.id === id ? { ...w, active: !currentActive } : w
      ));
    }
  };

  const handleTriggerWorkflow = async () => {
    if (!webhookUrl) return;
    
    setTriggering(true);
    setTriggerResult(null);
    
    try {
      let data;
      if (webhookMethod === 'POST') {
        try {
          data = JSON.parse(webhookData);
        } catch {
          data = {};
        }
      }
      
      const result = await triggerWorkflow(webhookUrl, webhookMethod, data);
      setTriggerResult({
        success: true,
        message: `Workflow triggered successfully! Response: ${typeof result === 'string' ? result : JSON.stringify(result).substring(0, 100)}`
      });
      
      // Reload workflows after a short delay
      setTimeout(() => loadData(), 2000);
    } catch (error) {
      setTriggerResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Failed to trigger workflow'}`
      });
    } finally {
      setTriggering(false);
    }
  };

  const handleSelectWorkflow = (workflow: WorkflowWithStats) => {
    setSelectedWorkflow(workflow);
    if (workflow.webhookUrl) {
      setWebhookUrl(workflow.webhookUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate stats
  const totalAutomations = workflows.length;
  const activeAutomations = workflows.filter(w => w.active).length;
  const totalExecutions = workflows.reduce((acc, w) => acc + (w.executionCount || 0), 0);
  const avgSuccessRate = workflows.length > 0
    ? workflows.reduce((acc, w) => acc + (w.successRate || 0), 0) / workflows.length
    : 0;

  const StatCard = ({ 
    title, 
    value, 
    trend, 
    trendValue, 
    description,
    trendUp,
    icon: Icon
  }: { 
    title: string; 
    value: string; 
    trend: string; 
    trendValue: string;
    description: string;
    trendUp: boolean;
    icon: any;
  }) => (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center gap-1 text-xs">
          {trendUp ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={trendUp ? 'text-green-500' : 'text-red-500'}>
            {trendValue}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Automation Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Automations"
            value={totalAutomations.toString()}
            trend="Active workflows running"
            trendValue={`${activeAutomations} active`}
            description={`${activeAutomations} of ${totalAutomations} automations are currently active`}
            trendUp={true}
            icon={Zap}
          />
          <StatCard
            title="Total Executions"
            value={totalExecutions.toLocaleString()}
            trend="Workflow runs completed"
            trendValue="+12.5%"
            description="Total workflow executions across all automations"
            trendUp={true}
            icon={Play}
          />
          <StatCard
            title="Success Rate"
            value={`${avgSuccessRate.toFixed(1)}%`}
            trend="Average success rate"
            trendValue="+4.5%"
            description="Meets performance projections"
            trendUp={true}
            icon={CheckCircle2}
          />
          <StatCard
            title="Avg Runtime"
            value={workflows.length > 0 ? formatRuntime(workflows.reduce((acc, w) => acc + (w.averageRuntime || 0), 0) / workflows.length) : '0ms'}
            trend="Average execution time"
            trendValue="-8.2%"
            description="Improved performance this period"
            trendUp={true}
            icon={Clock}
          />
        </div>

        {/* Chart Section */}
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Execution Trends</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Total executions for the last 3 months
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={timePeriod === '3months' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimePeriod('3months')}
                  className="text-sm"
                >
                  Last 3 months
                </Button>
                <Button
                  variant={timePeriod === '30days' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimePeriod('30days')}
                  className="text-sm"
                >
                  Last 30 days
                </Button>
                <Button
                  variant={timePeriod === '7days' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimePeriod('7days')}
                  className="text-sm"
                >
                  Last 7 days
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    stroke="currentColor"
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground"
                    stroke="currentColor"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="automations" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="automations">
              Automations
              <Badge variant="secondary" className="ml-2">
                {totalAutomations}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trigger">Trigger Webhook</TabsTrigger>
            <TabsTrigger value="performance">Performance Stats</TabsTrigger>
          </TabsList>

          {/* Automations Tab */}
          <TabsContent value="automations" className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>All Automations</CardTitle>
                <CardDescription>View and manage your n8n workflow automations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead>Workflow Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Executions</TableHead>
                      <TableHead className="text-right">Avg Runtime</TableHead>
                      <TableHead className="text-right">Success Rate</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No automations found. Create workflows in your n8n instance to see them here.
                        </TableCell>
                      </TableRow>
                    ) : (
                      workflows.map((workflow) => (
                        <TableRow key={workflow.id} className="border-b border-border">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {workflow.name}
                              {workflow.webhookUrl && (
                                <Badge variant="outline" className="text-xs">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Webhook
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={workflow.active ? 'text-green-600' : 'text-yellow-600'}
                            >
                              {workflow.active ? (
                                <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {workflow.executionCount || 0}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {workflow.averageRuntime ? formatRuntime(workflow.averageRuntime) : '--'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={workflow.successRate && workflow.successRate > 90 ? 'text-green-600 font-semibold' : workflow.successRate && workflow.successRate > 70 ? 'text-yellow-600' : 'text-red-600'}>
                              {workflow.successRate?.toFixed(1) || '--'}%
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {workflow.lastExecution ? new Date(workflow.lastExecution).toLocaleString() : 'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {workflow.webhookUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectWorkflow(workflow)}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Trigger
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant={workflow.active ? 'outline' : 'default'}
                                onClick={() => handleToggleWorkflow(workflow.id, workflow.active)}
                              >
                                {workflow.active ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trigger Webhook Tab */}
          <TabsContent value="trigger" className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Trigger Workflow via Webhook</CardTitle>
                <CardDescription>
                  Manually trigger any workflow that has a webhook trigger configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Webhook URL Tabs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="url-type"
                        checked={!useTestUrl}
                        onCheckedChange={(checked) => setUseTestUrl(!checked)}
                      />
                      <Label htmlFor="url-type" className="text-sm">
                        {useTestUrl ? 'Test URL' : 'Production URL'}
                      </Label>
                    </div>
                    <div className="flex-1">
                      <Badge variant={useTestUrl ? 'secondary' : 'default'}>
                        {useTestUrl ? 'Using Test Environment' : 'Using Production Environment'}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Select */}
                  {workflows.filter(w => w.webhookUrl).length > 0 && (
                    <div className="space-y-2">
                      <Label>Quick Select Workflow</Label>
                      <Select onValueChange={(value) => {
                        const workflow = workflows.find(w => w.id === value);
                        if (workflow) handleSelectWorkflow(workflow);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a workflow with webhook..." />
                        </SelectTrigger>
                        <SelectContent>
                          {workflows.filter(w => w.webhookUrl).map((workflow) => (
                            <SelectItem key={workflow.id} value={workflow.id}>
                              {workflow.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Webhook URL */}
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        placeholder="https://guidocroon.com/n8n/webhook/your-path"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(webhookUrl)}
                        disabled={!webhookUrl}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* HTTP Method */}
                  <div className="space-y-2">
                    <Label>HTTP Method</Label>
                    <div className="flex gap-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="method-get"
                          name="method"
                          checked={webhookMethod === 'GET'}
                          onChange={() => setWebhookMethod('GET')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="method-get" className="font-normal cursor-pointer">
                          GET
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="method-post"
                          name="method"
                          checked={webhookMethod === 'POST'}
                          onChange={() => setWebhookMethod('POST')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="method-post" className="font-normal cursor-pointer">
                          POST
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Data (only for POST) */}
                  {webhookMethod === 'POST' && (
                    <div className="space-y-2">
                      <Label htmlFor="webhook-data">Request Body (JSON)</Label>
                      <textarea
                        id="webhook-data"
                        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm font-mono"
                        placeholder='{"message": "Hello from dashboard", "timestamp": "2025-01-01T00:00:00Z"}'
                        value={webhookData}
                        onChange={(e) => setWebhookData(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter JSON data to send with the POST request
                      </p>
                    </div>
                  )}

                  {/* Trigger Button */}
                  <Button
                    onClick={handleTriggerWorkflow}
                    disabled={!webhookUrl || triggering}
                    className="w-full"
                    size="lg"
                  >
                    {triggering ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Trigger Workflow
                      </>
                    )}
                  </Button>

                  {/* Result */}
                  {triggerResult && (
                    <Alert variant={triggerResult.success ? 'default' : 'destructive'}>
                      <AlertTitle className="flex items-center gap-2">
                        {triggerResult.success ? (
                          <><CheckCircle2 className="h-4 w-4" /> Success</>
                        ) : (
                          <><XCircle className="h-4 w-4" /> Error</>
                        )}
                      </AlertTitle>
                      <AlertDescription>{triggerResult.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Info Box */}
                <Alert>
                  <AlertTitle>How to use webhooks</AlertTitle>
                  <AlertDescription className="space-y-2 text-sm">
                    <p><strong>GET Method:</strong> Use for simple triggers without data. Best for testing and basic automation starts.</p>
                    <p><strong>POST Method:</strong> Use when you need to send data to your workflow. The JSON body will be available in your workflow nodes.</p>
                    <p>Configure webhook triggers in your n8n workflow using the Webhook node, then copy the URL here.</p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Stats Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>Detailed runtime and success metrics per automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{workflow.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {workflow.executionCount || 0} total executions
                          </p>
                        </div>
                        <Badge variant={workflow.active ? 'default' : 'secondary'}>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Average Runtime</p>
                          <p className="text-lg font-bold">
                            {workflow.averageRuntime ? formatRuntime(workflow.averageRuntime) : '--'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className="text-lg font-bold text-green-600">
                            {workflow.successRate?.toFixed(1) || '--'}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Last Execution</p>
                          <p className="text-sm font-medium">
                            {workflow.lastExecution 
                              ? new Date(workflow.lastExecution).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
