'use client';

import { ThemeProvider } from './theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { TenantProvider } from '@/contexts/tenant-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <TenantProvider>
          {children}
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
