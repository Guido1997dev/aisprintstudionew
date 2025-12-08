import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo, LogoText } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
// import Image from 'next/image';
import {
  Rocket,
  Target,
  Users,
  Heart,
  Sparkles,
  Mail,
  Linkedin
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Team Member 1',
      role: 'Co-Founder & AI Sprint Lead',
      image: '/team/team-member-1.jpg',
      description: 'Expert in AI-implementatie en sprint methodologieën. Passie voor het vertalen van complexe technologie naar praktische business value.',
      linkedin: '#',
      email: 'info@aisprintstudio.nl'
    },
    {
      name: 'Team Member 2',
      role: 'Co-Founder & Automation Specialist',
      image: '/team/team-member-2.jpg',
      description: 'Specialist in workflow automation en n8n integraties. Bouwt slimme oplossingen die teams tijd besparen en fouten elimineren.',
      linkedin: '#',
      email: 'info@aisprintstudio.nl'
    },
  ];

  const values = [
    {
      icon: Rocket,
      title: 'Snelheid',
      description: 'We werken in sprints om snel resultaat te leveren. Geen maandenlange projecten, maar tastbare oplossingen binnen weken.',
    },
    {
      icon: Heart,
      title: 'Happy Teams',
      description: 'Tevreden teams maken betere software. Onze methodologie zorgt voor plezier in het werk en trots op het resultaat.',
    },
    {
      icon: Target,
      title: 'Focus',
      description: 'Elk sprint heeft één duidelijk doel. Door laser-focus bereiken we meer in minder tijd.',
    },
    {
      icon: Sparkles,
      title: 'Innovatie',
      description: 'We omarmen nieuwe technologieën en zoeken altijd naar betere manieren om problemen op te lossen.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-3">
            <Logo className="h-8" />
            <LogoText />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-sm font-medium text-primary">
              Over Ons
            </Link>
            <Link href="/#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <a href="https://calendar.app.google/hzFh9uHLzH8qaCYXA" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors hover:text-primary">
              Plan Gesprek
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4" style={{ margin: '0 auto -5px', padding: '128px 16px 0' }}>
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Users className="h-3 w-3" />
            Ons Team
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Wij zijn{' '}
            <span className="text-primary">
              AI Sprint Studio
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Een team van AI-enthousiastelingen en automation experts die bedrijven helpen 
            om sneller, slimmer en gelukkiger te werken met de Happy Sprint Machine methodologie.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4" style={{ margin: '-3px auto 0', padding: '57px 16px 80px' }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Het Team
            </h2>
            <p className="text-lg text-muted-foreground">
              De mensen achter de Happy Sprint Machine
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-xl hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="aspect-[4/5] relative bg-muted hover:brightness-110 transition-all duration-300">
                  {/* Image will be added by user */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Users className="h-24 w-24 text-primary/20" />
                  </div>
                  {/* Uncomment when images are added:
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  */}
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{member.name}</CardTitle>
                  <CardDescription className="text-base">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {member.description}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Sprint Machine Section */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="mb-4">Onze Methodologie</Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                De Happy Sprint Machine
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Onze unieke aanpak combineert de snelheid van sprints met de kracht van AI, 
                en het allerbelangrijkste: tevreden teams die met plezier werken.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300 animate-float">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Sprint Planning</h3>
                <p className="text-sm text-muted-foreground">
                  We starten met heldere doelen en realistische deliverables voor de sprint.
                </p>
              </div>

              <div className="text-center animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '200ms' }}>
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Build & Iterate</h3>
                <p className="text-sm text-muted-foreground">
                  In korte cycli bouwen we, testen we en verbeteren we. Elke dag voortgang.
                </p>
              </div>

              <div className="text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '400ms' }}>
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Happy Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  We leveren werkende oplossingen op waar je direct mee verder kunt.
                </p>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20 animate-fade-in-up transition-all hover:shadow-lg hover:scale-105" style={{ animationDelay: '450ms' }}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Heart className="h-12 w-12 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Waarom &quot;Happy&quot;?</h3>
                    <p className="text-muted-foreground">
                      Omdat we geloven dat tevreden teams betere software maken. Door korte sprints, 
                      heldere communicatie en snelle wins houden we iedereen gemotiveerd en enthousiast. 
                      Het resultaat? Betere oplossingen, snellere implementatie, en teams die trots zijn op hun werk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Onze Kernwaarden
            </h2>
            <p className="text-lg text-muted-foreground">
              Waar we voor staan en hoe we werken
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center transition-all hover:shadow-lg hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 hover:scale-110 transition-transform animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 animate-fade-in-up transition-all hover:shadow-2xl hover:scale-105" style={{ animationDelay: '500ms' }}>
          <CardContent className="pt-12 pb-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Laten we samen iets moois bouwen
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Klaar om je eerste sprint te starten? We helpen je graag met AI-automation 
                die echt werkt en waarde levert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Rocket className="mr-2 h-4 w-4" />
                    Start Je Sprint
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <a href="mailto:info@aisprintstudio.nl">
                    <Mail className="mr-2 h-4 w-4" />
                    Neem Contact Op
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Logo className="h-8" />
                <LogoText />
              </div>
              <p className="text-sm text-muted-foreground">
                AI-automation in snelle sprints met de Happy Sprint Machine methodologie.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Over Ons</Link></li>
                <li><Link href="/#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">n8n Documentatie</a></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Happy Sprint Machine</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Ons Team</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:info@aisprintstudio.nl" className="text-muted-foreground hover:text-foreground">info@aisprintstudio.nl</a></li>
                <li><a href="https://calendar.app.google/hzFh9uHLzH8qaCYXA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Plan een Gesprek</a></li>
                <li className="text-muted-foreground">Nederland</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 AI Sprint Studio. Gebouwd met de Happy Sprint Machine.
          </div>
        </div>
      </footer>
    </div>
  );
}
