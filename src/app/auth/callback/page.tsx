'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // First check if there's already a session (might be set from URL hash)
      const { data: { session: existingSession } } = await supabase.auth.getSession();

      if (existingSession) {
        console.log('Session already exists, redirecting to dashboard');
        window.location.href = '/dashboard';
        return;
      }

      // Check for code in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (errorParam) {
        console.error('OAuth error:', errorParam, errorDescription);
        setError(`OAuth error: ${errorDescription || errorParam}`);
        return;
      }

      if (code) {
        console.log('Exchanging code for session...');
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            setError(`Code exchange failed: ${exchangeError.message}`);
            return;
          }

          if (data.session) {
            console.log('Session created successfully');
            window.location.href = '/dashboard';
            return;
          }
        } catch (err) {
          console.error('Exchange exception:', err);
          setError(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
          return;
        }
      }

      // Check URL hash for implicit flow tokens
      if (window.location.hash) {
        console.log('Hash detected, waiting for auth state change...');
        // Give Supabase time to process the hash
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: { session: hashSession } } = await supabase.auth.getSession();
        if (hashSession) {
          window.location.href = '/dashboard';
          return;
        }
      }

      // No code, no hash, no session - redirect to login
      console.log('No auth data found, redirecting to login');
      window.location.href = '/login';
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <a href="/login" className="text-primary underline">Terug naar login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Inloggen...</p>
      </div>
    </div>
  );
}
