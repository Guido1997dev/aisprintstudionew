'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo, LogoText } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sparkles, Zap, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      router.push('/dashboard');
    } else {
      setError('Ongeldige inloggegevens. Probeer het opnieuw.');
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@aisprintstudio.nl', password: 'admin123', label: 'Admin' },
    { email: 'info@croonco.nl', password: 'croonco123', label: 'CROONCO' },
    { email: 'klant1@bedrijf.nl', password: 'demo123', label: 'Demo 1' },
    { email: 'klant2@company.com', password: 'demo123', label: 'Demo 2' },
  ];

  const fillDemoAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-6 px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Logo className="h-12" />
            <LogoText />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Welkom bij je{' '}
            <span className="text-primary">
              Automation Dashboard
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Beheer al je n8n workflows, monitor performance en trigger automations - 
            alles vanuit één centraal dashboard.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Volg je workflows live en zie direct resultaten
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-tenant Support</h3>
                <p className="text-sm text-muted-foreground">
                  Elke klant krijgt zijn eigen beveiligde omgeving
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Veilig & Betrouwbaar</h3>
                <p className="text-sm text-muted-foreground">
                  Jouw data is beveiligd met moderne authenticatie
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold">Inloggen</CardTitle>
                <div className="md:hidden">
                  <Logo className="h-8" />
                </div>
              </div>
              <CardDescription>
                Voer je inloggegevens in om toegang te krijgen tot je dashboard
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="naam@bedrijf.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Demo Accounts */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Demo accounts:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {demoAccounts.map((account, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoAccount(account.email, account.password)}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        {account.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Inloggen...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Inloggen
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-primary underline-offset-4 hover:underline">
                    Terug naar homepage
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Info text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Geen account? Neem contact op met je account manager.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
