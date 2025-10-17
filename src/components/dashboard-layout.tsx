'use client';

import { SidebarNav } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="bg-primary text-primary-foreground">
              <span className="mr-2">⊕</span>
              Quick Create
            </Button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

