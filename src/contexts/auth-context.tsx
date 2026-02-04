'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  company: string | undefined;
  role: string | undefined;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUserToUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;

  const metadata = supabaseUser.user_metadata || {};

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || null,
    name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0] || null,
    company: metadata.company as string | undefined,
    role: metadata.role as string | undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(mapSupabaseUserToUser(initialSession?.user ?? null));
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(mapSupabaseUserToUser(newSession?.user ?? null));
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
