'use client';

import { useState, useRef, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { PromptBox } from '@/components/prompt-box';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Database } from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';
import type { Project } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  isError?: boolean;
}

const AI_MODELS = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
];

export default function ChatPage() {
  const { companyId } = useTenant();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('none');
  const [projects, setProjects] = useState<Array<Project & { documentCount?: number; readyDocuments?: number }>>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load projects on mount
  useEffect(() => {
    if (companyId) {
      loadProjects();
    }
  }, [companyId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [chatMessages]);

  const loadProjects = async () => {
    if (!companyId) return;
    
    try {
      setIsLoadingProjects(true);
      const response = await fetch(`/api/projects?companyId=${encodeURIComponent(companyId)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Set empty array on error to prevent infinite retries
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleMessage = (message: { role: 'user' | 'assistant'; message: string; timestamp: string; isError?: boolean }) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: message.role,
      message: message.message,
      timestamp: message.timestamp,
      isError: message.isError,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="AI Chat">
        <div className="flex flex-col h-full max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-semibold">AI Chat Assistant</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Chat met verschillende AI modellen
                {selectedProjectId && selectedProjectId !== 'none' && (
                  <Badge variant="secondary" className="ml-2">
                    <Database className="h-3 w-3 mr-1" />
                    RAG Enabled
                  </Badge>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Project (RAG)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project (General Chat)</SelectItem>
                  {isLoadingProjects ? (
                    <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                  ) : projects.length === 0 ? (
                    <SelectItem value="no-projects" disabled>No projects available</SelectItem>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                        {project.readyDocuments !== undefined && project.readyDocuments > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({project.readyDocuments} docs)
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select AI Model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {chatMessages.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearChat}>
                  Clear Chat
                </Button>
              )}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 space-y-4 bg-muted/30 rounded-lg p-6 min-h-[400px]"
          >
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p className="text-lg mb-2">Start een gesprek met AI</p>
                <p className="text-sm">Kies een AI model en stel je vraag hieronder</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : msg.isError
                        ? 'bg-red-500/20 dark:bg-red-500/10 text-red-900 dark:text-red-100 rounded-bl-none border border-red-500/20'
                        : 'bg-background border rounded-bl-none'
                    }`}
                  >
                    {msg.isError && (
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-semibold">Error</span>
                      </div>
                    )}
                    <p className="text-sm break-words leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString('nl-NL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="border-t pt-4">
            <PromptBox 
              className="w-full" 
              onMessage={handleMessage}
              selectedModel={selectedModel}
              selectedProjectId={selectedProjectId}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

