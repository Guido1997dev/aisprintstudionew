'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id?: string;
  email?: string | null;
  name?: string | null;
  company?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user ? { ...session.user, company: (session.user as any).company, role: (session.user as any).role } as User : null;

  return (
    <AuthContext.Provider value={{ user, isLoading: status === 'loading' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
