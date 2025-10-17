'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  LayoutDashboard,
  Activity,
  BarChart3,
  FolderKanban,
  Users,
  Database,
  FileText,
  FileEdit,
  MoreHorizontal,
} from 'lucide-react';

const mainNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lifecycle', href: '/lifecycle', icon: Activity },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Team', href: '/team', icon: Users },
];

const documentItems = [
  { name: 'Data Library', href: '/data-library', icon: Database },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Word Assistant', href: '/word-assistant', icon: FileEdit },
  { name: 'More', href: '/more', icon: MoreHorizontal },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Company Logo/Name */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <span className="text-sm font-bold text-primary-foreground">A</span>
        </div>
        <span className="text-lg font-semibold">Acme Inc.</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Documents Section */}
        <div className="pt-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Documents
          </h3>
          <div className="space-y-1">
            {documentItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

