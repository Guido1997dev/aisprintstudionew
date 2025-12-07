'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, Zap, Loader2 } from 'lucide-react';

interface QuickScanFormData {
  name: string;
  email: string;
  website: string;
  challenge?: string;
}

export function QuickScanForm() {
  const [formData, setFormData] = useState<QuickScanFormData>({
    name: '',
    email: '',
    website: '',
    challenge: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/quick-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Er ging iets mis (${response.status}). Probeer het opnieuw.`);
      }

      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        website: '',
        challenge: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bedankt! 🎉</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            We gaan direct aan de slag met je Quick Scan. Verwacht binnen 48 uur 
            een email met concrete AI automation mogelijkheden voor jouw bedrijf.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Nog een scan aanvragen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-8 pb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Copy */}
          <div>
            <Badge className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Gratis & Vrijblijvend
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Krijg je persoonlijke AI Quick Scan
            </h2>
            <p className="text-muted-foreground mb-4">
              Laat je website achter en ontvang binnen 48 uur een concrete analyse:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>3-5 AI automation mogelijkheden specifiek voor jouw bedrijf</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Inschatting van tijdsbesparing en ROI</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Geen verplichtingen, geen salesgesprek</span>
              </li>
            </ul>
          </div>

          {/* Right side - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium block mb-1.5">
                  Naam *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Je volledige naam"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium block mb-1.5">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="je@bedrijf.nl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="website" className="text-sm font-medium block mb-1.5">
                  Bedrijfswebsite *
                </label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://jouwbedrijf.nl"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="challenge" className="text-sm font-medium block mb-1.5">
                  Grootste uitdaging (optioneel)
                </label>
                <Textarea
                  id="challenge"
                  name="challenge"
                  placeholder="Bijv: We verliezen veel tijd aan handmatige factuurverwerking"
                  rows={3}
                  value={formData.challenge}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <Button size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Versturen...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Stuur mijn Quick Scan
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We respecteren je privacy. Geen spam, alleen waardevolle inzichten.
              </p>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

