'use client';

import { useState, useRef, useEffect } from 'react';
import { PromptBox } from './prompt-box';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertCircle, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function Chatbox({ open, onOpenChange }: ChatboxProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0" showCloseButton={true}>
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">AI Chat Assistant</DialogTitle>
            <div className="flex items-center gap-3">
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
        </DialogHeader>

        {/* Chat Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30"
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
        <div className="p-4 border-t bg-background">
          <PromptBox 
            className="w-full" 
            onMessage={handleMessage}
            selectedModel={selectedModel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

