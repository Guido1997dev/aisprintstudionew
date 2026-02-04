'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo, LogoText } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sparkles, Zap, Lock, Mail, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for auth code in URL and exchange it, or check existing session
  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get('code');

      // If there's a code parameter, exchange it for a session
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeError) {
          window.location.href = '/dashboard';
          return;
        }
        console.error('Code exchange error:', exchangeError);
      }

      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setIsCheckingSession(false);
      }
    };
    handleAuth();
  }, [supabase, router, searchParams]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === 'Invalid login credentials'
          ? 'Ongeldige inloggegevens.'
          : signInError.message);
        return;
      }

      if (data.session) {
        // Use window.location for full page reload to ensure session is recognized
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Ongeldige inloggegevens.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden.');
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@aisprintstudio.nl', password: 'admin123', label: 'Admin' },
    { email: 'info@croonco.nl', password: 'croonco123', label: 'CROONCO' },
    { email: 'klant1@bedrijf.nl', password: 'demo123', label: 'Demo 1' },
    { email: 'klant2@company.com', password: 'demo123', label: 'Demo 2' },
  ];

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col justify-center space-y-6 px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Logo className="h-12" />
            <LogoText />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welkom bij je <span className="text-primary">Automation Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Beheer al je n8n workflows, monitor performance en trigger automations - alles vanuit één centraal dashboard.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">Volg je workflows live en zie direct resultaten</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-tenant Support</h3>
                <p className="text-sm text-muted-foreground">Elke klant krijgt zijn eigen beveiligde omgeving</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Veilig & Betrouwbaar</h3>
                <p className="text-sm text-muted-foreground">Jouw data is beveiligd met moderne authenticatie</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold">Inloggen</CardTitle>
                <div className="md:hidden">
                  <Logo className="h-8" />
                </div>
              </div>
              <CardDescription>Voer je inloggegevens in of gebruik Google</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading}>
                <Chrome className="mr-2 h-4 w-4" />
                Inloggen met Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Of</span></div>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="naam@bedrijf.nl" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" disabled={isLoading} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" disabled={isLoading} />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? <><Sparkles className="mr-2 h-4 w-4 animate-spin" />Inloggen...</> : <><Zap className="mr-2 h-4 w-4" />Inloggen</>}
                </Button>
              </form>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">Demo accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((account, i) => (
                    <Button key={i} type="button" variant="outline" size="sm" onClick={() => { setEmail(account.email); setPassword(account.password); }} disabled={isLoading} className="text-xs">
                      {account.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary underline-offset-4 hover:underline">Terug naar homepage</Link>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Geen account? Neem contact op met je account manager.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
