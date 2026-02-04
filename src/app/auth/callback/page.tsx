'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Get the code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Auth callback error:', error);
            window.location.href = '/login?error=callback_failed';
            return;
          }

          // Success! Redirect to dashboard
          window.location.href = '/dashboard';
        } catch (err) {
          console.error('Auth callback exception:', err);
          window.location.href = '/login?error=callback_exception';
        }
      } else {
        // No code, redirect to login
        window.location.href = '/login';
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Inloggen...</p>
      </div>
    </div>
  );
}
